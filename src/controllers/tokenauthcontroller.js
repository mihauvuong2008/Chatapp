const jwtConfig = require("../config/jwt/jwtConfig");
const jwtTool = require("../config/jwt/jwtTool");
const jwt = require("jsonwebtoken");
const databasequery = require('./databasequery');
const { QueryTypes } = require('sequelize');
var exports = module.exports = {};

Database = {};

exports.setupDatabase = function(db){
  Database = db;
}

exports.generateToken = async function (req, res) {
  try {
    const userFakeData = {
      userid:  req.user.userid,
      username:  req.user.username
    };
    // debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
    const accessToken = await jwtTool.generateToken(userFakeData, jwtConfig.accessTokenSecret, jwtConfig.accessTokenLife);
    // debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
    const refreshToken = await jwtTool.generateToken(userFakeData, jwtConfig.refreshTokenSecret, jwtConfig.refreshTokenLife);
    // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
    // save to database
    const result = await Database.sequelize.query(databasequery.addtokenlist(accessToken, refreshToken, new Date()), { type: QueryTypes.INSERT });
    // save fail
    if(!result)  if(result.length<2) /*accessToken, refreshToken = 2*/ return ;
    // debug(`Gửi Token và Refresh Token về cho client...`);

    // res.writeHead(302, {
    //   'Location': '/chatapp?token='+accessToken,
    //   "x-access-token": refreshToken,
    //   accessToken: accessToken,
    //   refreshToken: refreshToken,
    //   userid:  req.user.userid,
    // });
    // res.end();
    return res.render('accesschatapp', {accessToken: accessToken, refreshToken: refreshToken});

  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log("generateToken", error);
    return res.status(500).json(error);
  }
}

exports.refreshToken = async function(req, res) {
  // User gửi mã refresh token kèm theo trong body

  const refreshTokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  // Nếu như tồn tại refreshToken truyền lên và nằm trong DB
  const result = await Database.sequelize.query(databasequery.checkexistsaccesstoken(refreshTokenFromClient), { type: QueryTypes.SELECT });
  // tslint:disable-next-line:no-console
  // console.log("query checkexistsaccesstoken: ", result);
  let tokenExists = 0;
  result.forEach((item, i) => {
    for (const key of Object.keys(item)) {
      tokenExists = parseInt(item[key], 10);
    }
  });
  // tslint:disable-next-line:no-console
  // console.log("query checkexistsaccesstoken: ", tokenExists);

  if (refreshTokenFromClient && tokenExists>0) {
    try {
      // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
      const decoded = await jwtTool.verifyToken(refreshTokenFromClient, jwtConfig.refreshTokenSecret);
      // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
      // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
      // debug("decoded: ", decoded);
      const userFakeData = decoded.data;
      // debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
      const accessToken = await jwtTool.generateToken(userFakeData, jwtConfig.accessTokenSecret, jwtConfig.accessTokenLife);

      const update = await Database.sequelize.query(databasequery.updateaccesstoken(accessToken, refreshTokenFromClient), { type: QueryTypes.UPDATE });
      // tslint:disable-next-line:no-console
      console.log("query updateaccesstoken: ", accessToken,update ,update[1]);
      let updateStatus = true;
      if(!update) updateStatus = false;
      if(update[1]===0) updateStatus = false;
      if(!updateStatus) return res.status(401).json({ message: 'refresh error', });
      // tslint:disable-next-line:no-console
      console.log("query updateaccesstoken success: ", accessToken);
      // gửi token mới về cho người dùng
      return res.status(200).json({accessToken});
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("refreshToken: ", error);
      // debug(error);
      res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'refresh-token: No token provided.',
    });
  }
}

exports.middlewareTokenChecker = async function (req, res, next) {
  // after setup middleware; generate chat API route
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header

  let tokenFromClient =  req.body.token || req.query.token || req.headers["x-access-token"];
  // tslint:disable-next-line:no-console
  // console.log("here is req.headers", tokenFromClient);
  if (tokenFromClient) { // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, jwtConfig.accessTokenSecret);
      // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
      req.jwtDecoded = decoded;
      const userid = decoded.data.userid;
      const sessionid = req.user.userid;
      if (userid !== sessionid) return res.status(401).json({ message: 'Unauthorized.' });
      // Cho phép req đi tiếp sang controller.
      next();
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("middlewareTokenChecker: ", error);
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      // debug("Error while verify token:", error);
      return res.status(401).json({
        message: 'Unauthorized.'+ error, // for debug
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}
