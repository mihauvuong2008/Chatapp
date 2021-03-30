

class chatService {
  constructor () {
    this.isstart = false;
    this.timeout = 1000;
    this.updaterrate = {
      "istillonline":
      {"delay": 4900, "fullpower": 10000, "limittocooldown": 300, "cooldownrate": 70, "cooldownstep": 150, "cooldowndelay": 3000},
      "serverupdater":
      {"delay": 8000, "fullpower": 8000, "limittocooldown": 300, "cooldownrate": 55, "cooldownstep": 150, "cooldowndelay": 3000},
      "browserupdater":
      {"delay": 800, "fullpower": 800, "limittocooldown": 200, "cooldownrate": 8,"cooldownstep": 100, "cooldowndelay": 1200}
    }
  }

  async startchatService (ACTIVECHATBOX_LIST, Groupchat_list_, Friendchat_list_) {
    // console.log (ACTIVECHATBOX_LIST, Groupchat_list_, Friendchat_list_) ;
    this.isstart = true;
    this.keeponlinestate (ACTIVECHATBOX_LIST, Groupchat_list_, Friendchat_list_) ;
    this.serverupdater (ACTIVECHATBOX_LIST) ;
    this.browserUpdater (ACTIVECHATBOX_LIST, Groupchat_list_, Friendchat_list_) ;
  }

  async keeponlinestate (ACTIVECHATBOX_LIST, Groupchat_list_, Friendchat_list_) {
    while (true) {
      // say to server i still online
      istillonline() ;

      // keep update online status

      if (Groupchat_list_!== undefined) {
        Groupchat_list_.forEach (async (item, i) => {
          var online = false;
          const info = await getGroupInfomation (item.groupid)
          if(!info) return ;
          const groupinfo = JSON.parse (info) ;
          if (groupinfo)
          groupinfo.some ((item_, i) => {
            // console.log (item_.lastdatetimelogin) ;
            if (item_.userid!= USERDATA.ID)
            if (item_.lastdatetimelogin) {
              // console.log (item_.lastdatetimelogin, is_Stillonline (item_.lastdatetimelogin)) ;
              if (is_Stillonline (item_.lastdatetimelogin)) { online = true; return;}
            }
          }) ;
          // console.log ("grouponlinestatusID"+item.groupid) ;
          const onlinestatus = document.getElementById ("grouponlinestatusID"+item.groupid) ;
          // if (onlinestatus)
          onlinestatus.style.backgroundColor = (online?"#06FF0B":"#cc0000") ;

        }) ;
      }
      // console.log (Friendchat_list_) ;
      if (Friendchat_list_) {
        Friendchat_list_.forEach (async (item, i) => {
          const rs = JSON.parse (await getfriendstillonline (item.userid)) ;
          // console.log (item, rs) ;
          if (rs.length>0) {
            // console.log (rs[0].lastdatetimelogin) ;
            const online = is_Stillonline (rs[0].lastdatetimelogin) ;
            // console.log (is_Stillonline (rs[0].lastdatetimelogin) , rs[0].lastdatetimelogin) ;
            const onlinestatus = document.getElementById ("friendonlinestatusID"+item.userid) ;
            onlinestatus.style.backgroundColor = (online?"#06FF0B":"#cc0000") ;
          }
        }) ;
      }

      // update recentchatbox
      ACTIVECHATBOX_LIST.recentchatbox.data.forEach (async (item, i) => {
        var online = false;
        if (item.type.localeCompare (CHATROOMTYPE.TYPEFRIEND) == 0) {
          const rs = JSON.parse (await getfriendstillonline (item.id)) ;
          if (rs.length>0) {
            if (rs.length>0)
            online = is_Stillonline (rs[0].lastdatetimelogin) ;
          }
          const onlinestatus = document.getElementById ("recentonlinestatusID" + item.type + item.id) ;
          if (onlinestatus) {
            onlinestatus.style.backgroundColor = (online?"#06FF0B":"#cc0000") ;
          }
        }else if (item.type.localeCompare (CHATROOMTYPE.TYPEGROUP) == 0) {
          const info = await getGroupInfomation (item.id);
          if(!info) return;
          const groupinfo = JSON.parse (await getGroupInfomation (item.id)) ;
          if (groupinfo)
          groupinfo.some ((item_, i) => {
            // console.log (item_.lastdatetimelogin) ;
            if (item_.userid!= USERDATA.ID)
            if (item_.lastdatetimelogin)
            if (is_Stillonline (item_.lastdatetimelogin)) {online = true;return ;}
          }) ;
          // console.log ("group: ", online) ;
          const onlinestatus = document.getElementById ("recentonlinestatusID" + item.type + item.id) ;
          if (onlinestatus) {
            onlinestatus.style.backgroundColor = (online?"#06FF0B":"#cc0000") ;
          }
        }
      }) ;

      // console.log ("time for give: ", (new Date ("2021-3-19 17:08:00") - new Date ("2021-3-19 17:00:00"))) ;
      await sleep (this.updaterrate.istillonline.delay) ;
    }
  }

  async serverupdater (ACTIVECHATBOX_LIST) {
    while (true) {
      /*
      * load data from server to cache:
      */
      //loadnewUser_notice_cache (new friend message, group message...)
      loadUser_notice_cache () ;
      //chatbox load_receive_chatdata_to_cache
      ACTIVECHATBOX_LIST.chatboxStack.data.forEach ((item, i) => {
        // group and friend
        load_receive_chatdata_to_cache (item) ;
      }) ;


      if (this.updaterrate.serverupdater.delay == this.updaterrate.serverupdater.limittocooldown) {
        //cooldown
        this.cooldown (this.updaterrate.serverupdater) ;
      }

      // console.log ("cooldown: this.updaterrate.serverupdater.delay", this.updaterrate.serverupdater.delay) ;
      await sleep (this.updaterrate.serverupdater.delay) ;
    }
  }

  async browserUpdater (ACTIVECHATBOX_LIST, Groupchat_list_, Friendchat_list_) {
    while (true) {

      /*
      * update browsers from cache:
      */
      // update browsers - send conversation and update status HTML element

      ACTIVECHATBOX_LIST.chatboxStack.data.forEach ((chatboxStack_data_item, i) => {

        chatboxStack_data_item.sending_chatdata_cache.forEach (async (item, i) => {
          if (!item.sended|| (!item.success&&item.sendingcount < 5)) {
            this.updaterrate.browserupdater.delay = this.updaterrate.browserupdater.limittocooldown;//ms for cooldown
            try {
              if (chatboxStack_data_item.type.localeCompare (CHATROOMTYPE.TYPEGROUP) == 0) {
                console.log ("send to group:", chatboxStack_data_item.id, item) ;
                await sendMessagetoGroup (chatboxStack_data_item.id, item) ;
                //item.success = res;
              }else if (chatboxStack_data_item.type.localeCompare (CHATROOMTYPE.TYPEFRIEND) == 0) {
                await sendMessagetoFriend (chatboxStack_data_item.id, item) ;
              }
              item.sendingcount += 1;
              item.sended = true;
              // console.log ("item:",item) ;
            } catch (e) {
              console.log (e) ;
            } finally {

            }
          } else {
            //neu gui thanh cong
            // update HTML element
            if (item.success) {
              browser_updatechatbox_msgitemsended_status (true, item) ;
            }else if (item.sendingcount>= 5) { // neu ko gui thanh cong
              browser_updatechatbox_msgitemsended_status (false, item) ;
            }
          }
        }) ;

        // set readed message
        //update browsers - syn receive message
        chatboxStack_data_item.receive_chatdata_cache.forEach (async (item, i) => {
          // console.log ("item.userid, USERDATA.ID", item.userid, USERDATA.ID, item, USERDATA) ;
          if (item.datetime_read == null &&!item.sended&&item.viewinbrowser) {
            // console.log ("update message readed",item) ;
            try {
              if (chatboxStack_data_item.type.localeCompare (CHATROOMTYPE.TYPEGROUP) == 0) {
                // item.datetime_read = new Date ().toISOString ().slice (0, 19).replace ('T', ' ') ,
                // after insert item to browsers
                await setitem_readedMessage_Group (item, getDateString (new Date ())) ;
                //item.success = res;
              }else if (chatboxStack_data_item.type.localeCompare (CHATROOMTYPE.TYPEFRIEND) == 0) {
                await setitem_readedMessage_Friend (item, getDateString (new Date ())) ;
              }
              item.sendingcount += 1;
              item.sended = true;
              // console.log ("setitem_readedMessage_Group:",item) ;
            } catch (e) {
              console.log (e) ;
            } finally {

            }
          }else if (!item.viewinbrowser) {
            // console.log ("item.viewinbrowser", item.viewinbrowser) ;
            // show new message from cache
            await browser_insert_item_to_chatbox (chatboxStack_data_item, item) ;
          }
        }) ;
      }) ;

      //update notify cache: - group notice
      // console.log ("Groupchat_list_:", Groupchat_list) ;
      if (Groupchat_list_) {
        Groupchat_list_.forEach ((item, i) => {
          // brownser_update_groupnotice (0, item.groupid) ;
          // console.log ("item.totalnoticecount:", item.totalnoticecount) ;
          if (item.totalnoticecount!== undefined) {
            brownser_update_groupnotice (item.totalnoticecount, item.groupid) ;
            browser_update_recentnotice (item.totalnoticecount, CHATROOMTYPE.TYPEGROUP, item.groupid) ;
          }
        }) ;
      }

      if (Friendchat_list_) {
        Friendchat_list_.forEach ((item, i) => {
          if (item.totalnoticecount!== undefined) {
            // console.log (item) ;
            brownser_update_friendnotice (item.totalnoticecount, item.userid) ;
            browser_update_recentnotice (item.totalnoticecount, CHATROOMTYPE.TYPEFRIEND, item.userid) ;
          }
        }) ;
      }
      if (this.updaterrate.browserupdater.delay == this.updaterrate.browserupdater.limittocooldown) {
        // incre serverupdater updaterate
        this.updaterrate.serverupdater.delay = this.updaterrate.serverupdater.limittocooldown
        //cooldown
        this.cooldown (this.updaterrate.browserupdater) ;
      }
      // console.log ("cooldown: this.updaterrate.browserupdater.delay", this.updaterrate.browserupdater.delay) ;
      await sleep (this.updaterrate.browserupdater.delay) ;
    }
  }

  async cooldown (updaterate) {
    updaterate.delay += 1;
    if (updaterate.delay >= updaterate.fullpower) {
      updaterate.delay = updaterate.fullpower;
      return ;
    }
    //cooldown
    // const start = Date.now () ;
    // console.log ("1", serverupdaterate.delay , new Date ().getMilliseconds ()) ;
    for (var i = 0;i < updaterate.cooldownrate;i++) {
      await sleep (updaterate.cooldowndelay) ;
      updaterate.delay += updaterate.cooldownstep;
      if (updaterate.delay >= updaterate.fullpower) {
        break;
      }
      // console.log ("serverupdaterate.fullpower", serverupdaterate.fullpower, serverupdaterate.fullpower) ;
    }
    // console.log ("2", new Date ().getMilliseconds ()) ;
    // const millis = Date.now () - start;
    // console.log (`seconds elapsed = ${millis}`) ;
    updaterate.delay = updaterate.fullpower;//ms
  }
}

let User_notice_cache = { "unreadGroupmessage" : [], "unreadFriendmessage" : []};
let TIMEFORGIVE = {"value": 10000};
let RECEI_CHTDATA_CACHEITEM_ID = 0;
let _chatService = new chatService();

function is_Stillonline (date) {
  if (!date) return false;
  const delay = new Date () - new Date (date) ;
  if (delay > TIMEFORGIVE.value) return false;
  return true;
}

function browser_update_recentnotice (totalnoticecount, type, id) {
  const recentnotice = document.getElementById ("noticeID" + type + id) ;
  const noticevalue = document.getElementById ("noticevalueID"+ type + id) ;
  if (!recentnotice) { return ;}
  if (!noticevalue) { return ;}
  if (totalnoticecount == 0)
  {
    recentnotice.classList.add ("hidenotice") ;
    noticevalue.innerHTML = 0;
    return;
  }
  recentnotice.classList.remove ("hidenotice") ;
  noticevalue.innerHTML = totalnoticecount;
}

function brownser_update_groupnotice (totalnoticecount, groupid) {
  // console.log (totalnoticecount, groupid) ;
  if (totalnoticecount == 0)
  {
    const groupnotice = document.getElementById ("groupnotice"+groupid) ;
    groupnotice.classList.add ("hidenotice") ;
    const groupnoticevalue = document.getElementById ("groupnoticevalue"+groupid) ;
    groupnoticevalue.innerHTML = 0;
    return;
  }
  const groupnotice = document.getElementById ("groupnotice"+groupid) ;
  groupnotice.classList.remove ("hidenotice") ;
  const groupnoticevalue = document.getElementById ("groupnoticevalue"+groupid) ;
  groupnoticevalue.innerHTML = totalnoticecount;
}

function brownser_update_friendnotice (totalnoticecount, friendid) {
  // console.log (totalnoticecount, friendid) ;
  if (totalnoticecount == 0)
  {
    // console.log ("friendnotice"+friendid) ;
    const friendnotice = document.getElementById ("friendnotice"+friendid) ;
    friendnotice.classList.add ("hidenotice") ;
    const friendnoticevalue = document.getElementById ("friendnoticevalue"+friendid) ;
    friendnoticevalue.innerHTML = 0;
    return;
  }
  const friendnotice = document.getElementById ("friendnotice"+friendid) ;
  friendnotice.classList.remove ("hidenotice") ;
  const friendnoticevalue = document.getElementById ("friendnoticevalue"+friendid) ;
  friendnoticevalue.innerHTML = totalnoticecount;
}

async function loadUser_notice_cache () {
  User_notice_cache.unreadGroupmessage = JSON.parse (await getGroupNotify ()) ;
  User_notice_cache.unreadFriendmessage = JSON.parse (await getFriendNotify ()) ;
  // User_notice_cache luu vao User_notice_cache de moi lan query khong can lay toan bo list
  Groupchat_list.forEach ((item_, i) => {
    var flag = false;
    User_notice_cache.unreadGroupmessage.some ((item, i) => {
      if (item.groupid == item_.groupid) {
        item_.totalnoticecount = item.totalnoticecount;
        flag = true;
        return ;
      }
    }) ;
    if (!flag)
    item_.totalnoticecount = 0;
  }) ;

  Friendchat_list.forEach ((item_, i) => {
    var flag = false;
    User_notice_cache.unreadFriendmessage.some ((item, i) => {
      // console.log (item) ;
      if (item.userid == item_.userid) {
        item_.totalnoticecount = item.totalnoticecount;
        flag = true;
        return ;
      }
    }) ;
    if (!flag)
    item_.totalnoticecount = 0;
  }) ;

}

function browser_insert_item_to_chatbox (chatboxStack_data_item, item_) {
  const messagebox = document.getElementById ("messageboxID"+chatboxStack_data_item.type+chatboxStack_data_item.id) ;
  if (!messagebox) return ;// insert first (by messageboxID) to need indentify messagebox
  const sending_chatdata_cache = chatboxStack_data_item.sending_chatdata_cache;
  var addfirst = false;
  if (!sending_chatdata_cache) {addfirst = true;}
  else if (sending_chatdata_cache.length == 0) {addfirst = true;}
  else if (item_.datetime_unhide <= sending_chatdata_cache[0].datetimesend) addfirst = true;
  const messageitem = makeHTMLitemforInsertChatbox_from_receiveCache (item_) ;
  if (addfirst) {
    console.log ("messageboxID+chatboxStack_data_item.type+chatboxStack_data_item.id", "messageboxID"+chatboxStack_data_item.type+chatboxStack_data_item.id) ;
    messagebox = document.getElementById ("messageboxID"+chatboxStack_data_item.type+chatboxStack_data_item.id) ;
    messagebox.append (messageitem) ;
    item_.viewinbrowser = true;
  } else {
    var flagItem_to_insert;
    sending_chatdata_cache.some ((item, i) => {// find data sended and insert to conversation message
      // console.log ("item_.datetime_unhide>item.datetimesend:",new Date (item_.datetime_unhide) , new Date (item.datetimesend) ,new Date (item_.datetime_unhide) >new Date (item.datetimesend)) ;
      if (new Date (item_.datetime_unhide) >new Date (item.datetimesend)) {
        // console.log ("browser_insert_item_to_chatbox return ;", item_) ;
        flagItem_to_insert = document.getElementById ("sended"+item.post_data_id) ;// i will insert insertAfter
      }else {
        flagItem_to_insert = document.getElementById ("sended"+item.post_data_id) ;// insert before now
        if (!flagItem_to_insert) return true;
        console.log ("insert insertBefore") ;
        flagItem_to_insert.parentNode.insertBefore (messageitem, flagItem_to_insert) ;
        item_.viewinbrowser = true;
        return true;
      }
    });
    if (!item_.viewinbrowser) {
      if (!flagItem_to_insert) {
        return ;
      }
      console.log ("insert insertAfter") ;
      flagItem_to_insert.parentNode.insertBefore (messageitem, messageitem.nextSibling) ;
      item_.viewinbrowser = true;
    }
  }
  refreshchatbox (chatboxStack_data_item.type, chatboxStack_data_item.id) ;
}

function makeHTMLitemforInsertChatbox_from_receiveCache (item_) {
  const messageitem = document.createElement ("div") ;
  messageitem.classList.add ("messageitem") ;
  const messageitem_icon = document.createElement ("div") ;
  messageitem_icon.classList.add ("messageitem_icon") ;
  const _chatboxmessagae = document.createElement ("div") ;
  _chatboxmessagae.classList.add ("guestchatboxmessagae") ;
  const hidemessageinfo = document.createElement ("div") ;
  hidemessageinfo.classList.add ("hidemessageinfo") ;
  hidemessageinfo.innerHTML = getDateString (new Date (item_.datetime_unhide)) ;
  hidemessageinfo.id = "messageinfoID" + item_.unhide_usermindid;
  const messgetextbean = document.createElement ("div") ;
  const messgetext = document.createElement ("div") ;
  messgetext.classList.add ("messgetext") ;
  messgetext.classList.add ("msgguest") ;
  messgetext.id = "message_dataID" + item_.unhide_usermindid;
  messgetext.addEventListener ("click", function () {
    // show info text
    const id = this.id.substring (14) ;
    const infoID = "messageinfoID"+id ;
    const classname = document.getElementById (infoID).className;
    if (classname.localeCompare ("hidemessageinfo") == 0) {
      document.getElementById (infoID).className = "messageinfo";
    }else if (classname.localeCompare ("messageinfo") == 0) {
      document.getElementById (infoID).className = "hidemessageinfo";
    }
  }) ;
  messgetext.innerHTML = item_.message_data;
  messgetextbean.appendChild (messgetext) ;
  _chatboxmessagae.appendChild (hidemessageinfo) ;
  _chatboxmessagae.appendChild (messgetextbean) ;
  messageitem.appendChild (messageitem_icon) ;
  messageitem.appendChild (_chatboxmessagae) ;
  return messageitem;
}


function browser_updatechatbox_msgitemsended_status (update_status, item) {
  const gettempmessElement = document.getElementById ("tempmessageitemID"+item.post_data_id) ;
  if (!gettempmessElement) return ;
  const hidemessageinfo = document.getElementById ("tempmessageinfoID"+item.post_data_id) ;
  const messgetext = document.getElementById ("tempmessagetextID"+item.post_data_id) ;
  if (update_status) {
    // message has sened success
    hidemessageinfo.innerHTML = item.datetimesend;
    hidemessageinfo.id = "messageinfoID" + item.resID;
    hidemessageinfo.className = "hidemessageinfo";
    messgetext.id = "message_dataID" + item.resID;
    messgetext.addEventListener ("click", function () {
      const infoID = "messageinfoID"+item.resID ;
      // console.log (infoID) ;
      const classname = document.getElementById (infoID).className;
      if (classname.localeCompare ("hidemessageinfo") == 0) {
        document.getElementById (infoID).className = "messageinfo";
      } else if (classname.localeCompare ("messageinfo") == 0) {
        document.getElementById (infoID).className = "hidemessageinfo";
      }
    }) ;
  } else {
    // message has sened fail
    hidemessageinfo.innerHTML = "send fail, click to resend";
    messgetext.addEventListener ("click", function () {

      const gettempmessElement = document.getElementById ("sended" + item.post_data_id) ;
      if (gettempmessElement&&item.sended) {
        gettempmessElement.id = "tempmessageitemID" + item.post_data_id;
        //show hand to user resend
        item.sended = false;
        item.success = false;
        item.sendingcount = 0;
        messgetext.style.backgroundColor = "";
      }
    }) ;
    messgetext.style.backgroundColor = "#E00003";
  }
  // for give it
  gettempmessElement.id = "sended"+item.post_data_id;
}


async function load_receive_chatdata_to_cache (chatboxStack_data_item) {

  if (chatboxStack_data_item.type.localeCompare (CHATROOMTYPE.TYPEGROUP) == 0) {// check match type chatboox
    const groupUnreadmessage = JSON.parse (await getGroupUnreadmessage (chatboxStack_data_item.id)) ;// check match id and load
    // console.log ("groupUnreadmessage", groupUnreadmessage) ;
    if (!groupUnreadmessage) return ;
    if (groupUnreadmessage === undefined) return ;
    if (groupUnreadmessage.length === undefined) return ;
    if (groupUnreadmessage.length == 0) return ;
    console.log ("groupUnreadmessage: ",chatboxStack_data_item.id, "length: ", groupUnreadmessage.length) ;
    groupUnreadmessage.forEach ((item, i) => {
      console.log ("item: ",item) ;
      // add guest message
      var flag = true;
      chatboxStack_data_item.receive_chatdata_cache.some ((item_, i) => {
        if (item_.unhide_usermindid == item.unhide_usermindid) {// if cache have this item, do nothing
          flag = false;
          return true;
        }
      }) ;
      if (!flag) return ;
      const partnerchat_data = {
        "RECEI_CHTDATA_CACHEITEM_ID": RECEI_CHTDATA_CACHEITEM_ID,
        "userid": item.userid,
        "username": item.username,
        "unhide_usermindid": item.unhide_usermindid,
        "datetime_unhide":item.datetime_unhide,
        "message_data": item.message_data,
        "login": item.login,
        "datetime_read": null,
        "sended": false,
        "success": false,
        "sendingcount": 0,
        "viewinbrowser": false,
        "resID": {"readerid": -1, "unhide_usermindid":-1}
      };
      console.log ("add chat receive data to cache: ", partnerchat_data) ;
      if (chatboxStack_data_item.receive_chatdata_cache.length>= 100)
      {
        chatboxStack_data_item.receive_chatdata_cache = [];//refresh cache
      }
      chatboxStack_data_item.receive_chatdata_cache.push (partnerchat_data) ;
      RECEI_CHTDATA_CACHEITEM_ID += 1;
    });
  } else if (chatboxStack_data_item.type.localeCompare (CHATROOMTYPE.TYPEFRIEND) == 0) {
    const friendUnreadmessage = JSON.parse (await getFriendUnreadmessage (chatboxStack_data_item.id)) ;// check match id and load
    // console.log ("friendUnreadmessage", friendUnreadmessage) ;
    if (!friendUnreadmessage) return ;
    if (friendUnreadmessage === undefined) return ;
    if (friendUnreadmessage.length === undefined) return ;
    if (friendUnreadmessage.length == 0) return ;
    console.log ("friendUnreadmessage: ",chatboxStack_data_item.id, "length: ", friendUnreadmessage.length) ;
    friendUnreadmessage.forEach ((item, i) => {
      // add guest message
      var flag = true;
      chatboxStack_data_item.receive_chatdata_cache.some ((item_, i) => {
        if (item_.unhide_usermindid == item.unhide_usermindid) {// if cache have item, do nothing
          flag = false;
          return true;
        }
      }) ;
      if (!flag) return ;
      const partnerchat_data = {
        "RECEI_CHTDATA_CACHEITEM_ID": RECEI_CHTDATA_CACHEITEM_ID,
        "userid": item.userid,
        "username": item.username,
        "unhide_usermindid": item.unhide_usermindid,
        "datetime_unhide":item.datetime_unhide,
        "message_data": item.message_data,
        "login": item.login,
        "datetime_read": null,
        "sended": false,
        "success": false,
        "sendingcount": 0,
        "viewinbrowser": false,
        "resID": {"readerid": -1, "unhide_usermindid":-1}
      };
      console.log ("add chat receive data to cache: ", partnerchat_data) ;
      if (chatboxStack_data_item.receive_chatdata_cache.length>= 100)
      {
        chatboxStack_data_item.receive_chatdata_cache = [];//refresh cache
      }
      chatboxStack_data_item.receive_chatdata_cache.push (partnerchat_data) ;
      RECEI_CHTDATA_CACHEITEM_ID += 1;
    }) ;

    return;
  }else { return ;}
}

function getDateString (d) {
  const ye = new Intl.DateTimeFormat ('en', { year: 'numeric' }).format (d) ;
  const mo = new Intl.DateTimeFormat ('en', { month: '2-digit' }).format (d) ;
  const da = new Intl.DateTimeFormat ('en', { day: '2-digit' }).format (d) ;
  var hh = new Intl.DateTimeFormat ('en', { hour: '2-digit', hour12: false }).format (d) ;
  const mm = new Intl.DateTimeFormat ('en', { minute: '2-digit' }).format (d) ;
  const ss = new Intl.DateTimeFormat ('en', { second: '2-digit' }).format (d) ;
  if (parseInt (hh) >23) {
    hh = "00";
  }
  return `${ye}-${mo}-${da} ${hh}:${mm}:${ss}`;
}
