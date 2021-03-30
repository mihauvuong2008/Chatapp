// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "10m";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret1";
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "1d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret1";
module.exports = {
    accessTokenLife: accessTokenLife,
    accessTokenSecret: accessTokenSecret,
    refreshTokenLife: refreshTokenLife,
    refreshTokenSecret: refreshTokenSecret,
};
//# sourceMappingURL=jwtConfig.js.map