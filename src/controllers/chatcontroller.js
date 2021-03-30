const jwtTool = require("../config/jwt/jwtTool");
const jwtConfig = require("../config/jwt/jwtConfig");
const databasequery = require('./databasequery');
const formidable = require('formidable');
const { QueryTypes } = require('sequelize');

var Database = {};

const setupDatabase = function (db) {
  Database = db;
}

// tslint:disable-next-line:no-console
const chatapp = async function (req, res) {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  // const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  let tokenFromClient;
  req.headers.cookie.split(";").some((item, i) => {// doc cookie
    const n = item.indexOf("chattoken");
    if(n>=0){
      tokenFromClient = item.split("=")[1];
      return ;
    }
  });

  if (!tokenFromClient) return res.status(403).send({ message: 'router.use: No token provided.', });
  // Nếu tồn tại token
  try {
    // Thực hiện giải mã token xem có hợp lệ hay không?
    const decoded = await jwtTool.verifyToken(tokenFromClient, jwtConfig.accessTokenSecret);
    const userid = decoded.data.userid;
    const sessionid = req.user.userid;
    if (userid !== sessionid) return res.status(401).json({ message: 'Unauthorized.' });
    return res.render('chatapp', {userid: req.user.userid});
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log("error", error);
    return res.status(401).json({ message: 'Unauthorized.', });
  }
}

// tslint:disable-next-line:no-console
const logout = async function (req, res) {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!tokenFromClient) return res.status(401).json({message: 'Unauthorized.', });
  try {
    const removetoken = await Database.sequelize.query(databasequery.removetoken(tokenFromClient));
    if(removetoken.length<1) return res.status(401).json({message: 'Unauthorized.', });
    req.session.destroy(function(err) {
      res.writeHead(302, {
        'Location': '/signin',
      });
      res.end();
    });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}
// tslint:disable-next-line:no-console
const friendLists = async function (req, res) {
  try {
    const result = await Database.sequelize.query(databasequery.getFriendlist( req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const groupLists = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getGroupList(req.user.userid),  { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const postmessagetofriend = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const userid = req.user.userid;
      const receiverid = fields.friendid;
      const messageData = fields.message;
      const datetimeSend = fields.datetime_send;
      const unhidePrimarykey = await Database.sequelize.query(databasequery.unhide_yourmind(userid, messageData, datetimeSend), { type: QueryTypes.INSERT });
      if (unhidePrimarykey) {
        const unhideUsermindid = unhidePrimarykey[0];
        const result = await Database.sequelize.query(databasequery.say_to_friend(receiverid, unhideUsermindid, datetimeSend), { type: QueryTypes.INSERT });
        return res.status(200).json(result);
      }
      res.status(200).end();
    });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const postmessagetogroup = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const userid = req.user.userid;
      const groupid = fields.groupid;
      const messageData = fields.message;
      const datetimeSend = fields.datetime_send;
      const unhidePrimarykey = await Database.sequelize.query(databasequery.unhide_yourmind(userid, messageData, datetimeSend), { type: QueryTypes.INSERT });
      if (unhidePrimarykey) {
        const unhideUsermindid = unhidePrimarykey[0];
        const result = await Database.sequelize.query(databasequery.say_to_group(userid, unhideUsermindid, groupid, datetimeSend), { type: QueryTypes.INSERT });
        const getgroupmember = await Database.sequelize.query(databasequery.get_group_member(groupid, userid), { type: QueryTypes.SELECT });
        if (getgroupmember)
        getgroupmember.forEach((item, i) => {
          const sendNoticetouser = Database.sequelize.query(databasequery.insert_unread_group(item.userid, unhideUsermindid, groupid), { type: QueryTypes.INSERT });
        });
      }
      return res.status(200).json(unhidePrimarykey);
    });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const groupConversation = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getGroupConversation(req.query.groupID, req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const friendConversation = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getFriendConversation(req.query.friendID, req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const friendchatsUnreadmessage = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getfriendchatsUnreadMessagedata(req.query.friendID, req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);// console.log(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const groupchatsUnreadmessagedata = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getgroupchatsUnreadmessagedata(req.query.groupID, req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);//
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const postitemReadedmessageFriend = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const readerid = req.user.userid;
      const unhideUsermindid = fields.unhideUsermindid;
      const datetimeRead = fields.datetime_read;
      const unread = await Database.sequelize.query(databasequery.update_unread_friend(readerid, unhideUsermindid, datetimeRead), { type: QueryTypes.UPDATE });
      return res.status(200).json(unread);
      res.status(200).end();
    });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const postitemReadedmessageGroup = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const readerid = req.user.userid;
      const unhideUsermindid = fields.unhideUsermindid;
      const datetimeRead = fields.datetime_read;
      const unread = await Database.sequelize.query(databasequery.update_unread_group(readerid, unhideUsermindid, datetimeRead), { type: QueryTypes.UPDATE });
      return res.status(200).json(unread);
    });
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const groupInfomation = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getGroupInfomation(req.query.groupID), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const friendInfomation = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getFriendInfomation(req.query.friendID, req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
    // tslint:disable-next-line:no-console
    console.log("friendInfomation", result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const friendnotify = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getFriendnotify(req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const groupnotify = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getGroupnotify(req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const istillonline = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.updateAccount_islogin(new Date(), req.user.userid), { type: QueryTypes.UPDATE });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

const friendstillonline = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.getfriendlastlogin(req.query.userid, req.user.userid), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

//get user id
const getuserSessionAvailble = async (req, res) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) { // Nếu tồn tại token
    try { // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtTool.verifyToken(tokenFromClient, jwtConfig.accessTokenSecret);
      return res.status(200).json({
        availble: true,
        session: userFakeData.userid,
        username: userFakeData.name,
      });
    } catch (error) {   // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res.status(401).json({
        message: 'Unauthorized.' + error, // for debug
      });
    }
  } else { // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

const findUsername = async (req, res) => {
  try {
    const result = await Database.sequelize.query(databasequery.finduser(req.query.username), { type: QueryTypes.SELECT });
    return res.status(200).json(result);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log("error", e);
    return res.status(401).json({message: 'Unauthorized.', });
  }
}

module.exports = {
  chatapp: chatapp,
  logout: logout,
  setupDatabase: setupDatabase,
  friendLists: friendLists,
  groupLists: groupLists,
  getuserSessionAvailble: getuserSessionAvailble,
  groupConversation: groupConversation,
  friendConversation: friendConversation,
  groupchatsUnreadmessagedata: groupchatsUnreadmessagedata,
  friendchatsUnreadmessage: friendchatsUnreadmessage,
  postmessagetogroup: postmessagetogroup,
  postmessagetofriend: postmessagetofriend,
  groupInfomation: groupInfomation,
  friendInfomation: friendInfomation,
  postitemReadedmessageGroup: postitemReadedmessageGroup,
  postitemReadedmessageFriend: postitemReadedmessageFriend,
  groupnotify: groupnotify,
  friendnotify: friendnotify,
  istillonline: istillonline,
  friendstillonline: friendstillonline,
  findUsername: findUsername,
};
