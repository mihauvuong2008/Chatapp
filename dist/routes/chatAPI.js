const express = require("express");
const router = express.Router();
module.exports = (app, tokenauthcontroller, chatController) => {
    // const router = app.Router();
    router.get("/accesschatapp", isLoggedIn, tokenauthcontroller.generateToken);
    router.get("/refresh_token", isLoggedIn, tokenauthcontroller.refreshToken);
    router.get("/chatapp", isLoggedIn, chatController.chatapp); // reload
    router.use(isLoggedIn, tokenauthcontroller.middlewareTokenChecker);
    // protected by jwt token:
    // check session availble:
    router.get("/logout", isLoggedIn, chatController.logout);
    router.get("/friendLists", isLoggedIn, chatController.friendLists);
    router.get("/groupLists", isLoggedIn, chatController.groupLists);
    router.get("/groupchats_messagedata", isLoggedIn, chatController.groupConversation);
    router.get("/friendchats_messagedata", isLoggedIn, chatController.friendConversation);
    router.get("/groupchats_info", isLoggedIn, chatController.groupInfomation);
    router.get("/friendchats_info", isLoggedIn, chatController.friendInfomation);
    router.post("/postmessagetogroup", isLoggedIn, chatController.postmessagetogroup);
    router.post("/postmessagetofriend", isLoggedIn, chatController.postmessagetofriend);
    router.get("/groupchats_unreadmessage", isLoggedIn, chatController.groupchatsUnreadmessagedata);
    router.get("/friendchats_unreadmessage", isLoggedIn, chatController.friendchatsUnreadmessage);
    router.post("/postitemReadedmessageGroup", isLoggedIn, chatController.postitemReadedmessageGroup);
    router.post("/postitemReadedmessageFriend", isLoggedIn, chatController.postitemReadedmessageFriend);
    router.get("/groupnotify", isLoggedIn, chatController.groupnotify);
    router.get("/friendnotify", isLoggedIn, chatController.friendnotify);
    router.get("/istillonline", isLoggedIn, chatController.istillonline);
    router.get("/friendstillonline", isLoggedIn, chatController.friendstillonline);
    router.get("/findUsername", isLoggedIn, chatController.findUsername);
    app.use("/", isLoggedIn, router);
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) // passport Authenticated login
        return next();
    // tslint:disable-next-line:no-console
    console.log("what router");
    res.redirect('/signin'); //?
}
//# sourceMappingURL=chatAPI.js.map