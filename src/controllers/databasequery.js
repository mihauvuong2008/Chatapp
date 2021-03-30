var exports = module.exports = {}

exports.checklogin = function (username) {return "select userid, username, password, availabletoken FROM users WHERE username = '" + username + "'";}

exports.updateAccount_islogin = function (logindatetime, userid) {return "UPDATE users set lasttimelogin = '" + getDateString(logindatetime) + "' WHERE userid = '" + userid + "'";}

exports.getfriendlastlogin = function (friendid, userid) {return "select c.lasttimelogin FROM users c, friend_relates f WHERE c.userid = '"
+ friendid + "' AND (f.userid = '" + friendid + "' AND f.friendid = '" + userid + "') OR (f.userid = '" + userid + "' AND f.friendid = '" + friendid + "') ";}

exports.getFriendlist = function (userid) {return "select * FROM users c, friend_relates WHERE c.userid = '" + userid + "' AND (friend_relates.userid = '" + userid + "' AND c.userid = friend_relates.friendid) OR (friend_relates.friendid = '" + userid + "' AND c.userid = friend_relates.userid) ;";}

exports.getGroupList = function (userid) {return "select c.groupid, c.group_name FROM chat_groups c, member_of_chat_groups m WHERE c.groupid = m.groupid AND m.userid = '" + userid + "' ";}

exports.getGroupConversation = function (groupid, userid) {return "select distinct a.unhide_usermindid, a.userid, a.message_data, a.datetime_unhide, a.username, u.datetime_read, u.readerid FROM (select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, usr.username "
+ " FROM unhide_userminds c, member_of_chat_groups m, users usr, chat_groups cg, say_to_groups s "
+ " WHERE (c.userid = usr.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid = '"
+ groupid + "' AND m.userid = '" + userid + "') "
+ " ORDER BY c.datetime_unhide DESC, c.unhide_usermindid DESC) a " /* ORDER BY ASC vi fronend se append*/
+ " LEFT JOIN unread_groups u ON u.readerid = '" + userid + "' AND (u.unhide_usermindid = a.unhide_usermindid OR u.unhide_usermindid is NULL) ORDER BY a.unhide_usermindid DESC LIMIT 50;";}

exports.getFriendConversation = function (friendid, userid) {return "select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, usr.username, usr.lasttimelogin, s.receiverid, s.datetime_tell, s.datetime_read "
+ " FROM unhide_userminds c, users usr, say_to_friends s "
+ " WHERE ( (c.userid = '" + userid + "' AND s.receiverid = '" + friendid + "') OR (c.userid = '" + friendid + "' AND s.receiverid = '" + userid
+ "') ) AND s.unhide_usermindid = c.unhide_usermindid AND c.userid = usr.userid ORDER BY c.datetime_unhide DESC, c.unhide_usermindid DESC LIMIT 50;";}

exports.getfriendchatsUnreadMessagedata = function (friendid, userid) {return "select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, usr.username "
+ " FROM unhide_userminds c, say_to_friends s, users usr "
+ " WHERE c.userid = '" + friendid + "'AND c.userid = usr.userid AND s.unhide_usermindid = c.unhide_usermindid AND s.datetime_read is NULL AND s.receiverid = '" + userid
+ /* ORDER BY ASC vi fronend se append*/"' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC LIMIT 100";}

exports.getgroupchatsUnreadmessagedata = function (groupid, userid) {return "select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, usr.username "
+ " FROM unhide_userminds c, unread_groups u, users usr "
+ " WHERE c.userid = usr.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.groupid = '" + groupid
+ "' AND u.readerid = '" + userid + "'";}

exports.getFriendnotify = function (userid) {return "select COUNT (c.userid) AS 'totalnoticecount', c.userid FROM unhide_userminds c, say_to_friends s, users usr "
+ " WHERE c.userid = usr.userid AND s.unhide_usermindid = c.unhide_usermindid AND s.datetime_read is NULL AND s.receiverid = '" + userid + "' GROUP BY usr.userid";}

exports.getGroupnotify = function (userid) {return "select COUNT (u.groupid) AS 'totalnoticecount', u.groupid FROM unhide_userminds c, unread_groups u, users usr "
+ " WHERE c.userid = usr.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '" + userid + "' GROUP BY u.groupid";}

exports.getGroupInfomation = function (groupid) {return "select cg.groupid, cg.group_name, cg.creator, usr.userid, usr.username, usr.lasttimelogin FROM chat_groups cg, member_of_chat_groups m, users usr "
+ " WHERE cg.groupid = m.groupid AND m.userid = usr.userid AND cg.groupid = '" + groupid + "'";}

exports.getFriendInfomation = function (friendid, userid) {return "select usr.userid, usr.username, usr.lasttimelogin FROM users usr, friend_relates f "
+ " WHERE ( f.userid = '" + friendid + "' AND f.friendid = '" + userid + "' AND usr.userid = f.userid ) OR ( f.userid = '" + userid + "' AND f.friendid = '" + friendid + "' AND usr.userid = f.friendid )" ;}

exports.unhide_yourmind = function (userid, messageData, datetimeUnhide) {return "INSERT INTO unhide_userminds (userid, message_data, datetime_unhide) value"
+ " ('" + userid + "', '" + messageData + "', '" + datetimeUnhide + "') ;";}

exports.say_to_group = function (userid, unhideUsermindid, groupid, datetimeTell) {return "INSERT INTO say_to_groups (tellerid, unhide_usermindid, groupid, datetime_tell) value"
+ " ('" + userid + "', '" + unhideUsermindid + "', '" + groupid + "', '" + datetimeTell + "') ;";}

exports.say_to_friend = function (receiverid, unhideUsermindid, datetimeTell) {return "INSERT INTO say_to_friends (receiverid, unhide_usermindid, datetime_tell) value"
+ " ('" + receiverid + "', '" + unhideUsermindid + "', '" + datetimeTell + "') ;";}

exports.insert_unread_group = function (readerid, unhideUsermindid, groupid) {return "INSERT INTO unread_groups (readerid, unhide_usermindid, groupid) value"
+ " ('" + readerid + "', '" + unhideUsermindid + "', '" + groupid + "') ;";}

exports.update_unread_friend = function (readerid, unhideUsermindid, datetimeRead) {return "UPDATE say_to_friends set datetime_read = '"
+ datetimeRead + "' WHERE receiverid = '" + readerid + "' AND unhide_usermindid = '" + unhideUsermindid + "'";}

exports.update_unread_group = function (readerid, unhideUsermindid, datetimeRead) {return "UPDATE unread_groups set datetime_read = '"
+ datetimeRead + "' WHERE readerid = '" + readerid + "' AND unhide_usermindid = '" + unhideUsermindid + "'";}

exports.get_group_member = function (groupid, userid) {return "select usr.userid, usr.username FROM member_of_chat_groups m, users usr "
+ " WHERE m.userid = usr.userid AND m.groupid = '" + groupid + "' AND m.userid != '" + userid + "'";}

exports.finduser = function (username) {return "SELECT *   FROM users WHERE username LIKE '%"+ username +"%'";}

exports.addtokenlist = function (accesstoken, refreshtoken, createdAt) {return "insert into tokens (accesstoken, refreshtoken, createdAt) values ('"+accesstoken+"','"+refreshtoken+"' , '"+getDateString(createdAt)+"')";}
exports.removetoken = function (token) {return "delete from tokens where accesstoken='"+token+"' OR refreshtoken='"+token+"'";}
exports.updateaccesstoken = function (accesstoken, refreshtoken) {return "update tokens SET  accesstoken='"+accesstoken+"' where refreshtoken='"+refreshtoken+"'";}
exports.checkexistsaccesstoken = function (token) {return "SELECT EXISTS(SELECT * FROM tokens where accesstoken='"+token+"' OR refreshtoken='"+token+"' )";}

function getDateString(d){
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  var hh = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
  const mm = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  const ss = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);
  if (parseInt(hh, 10)>23) {
    hh="00";
  }
  return `${ye}-${mo}-${da} ${hh}:${mm}:${ss}`;
}
