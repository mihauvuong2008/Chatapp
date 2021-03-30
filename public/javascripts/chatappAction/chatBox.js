async function loadFriendConversation(friendID){
  const type = CHATROOMTYPE.TYPEFRIEND;
  const converstation = JSON.parse(await getFriendConversation(friendID));
  const messagebox = document.getElementById("messageboxID"+CHATROOMTYPE.TYPEFRIEND+friendID);
  messagebox.innerHTML = "";
  var chatboxStack_data_item = {};
  ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&& friendID == item.id) {
      chatboxStack_data_item = item;
    }
  });
  if(converstation)
  converstation.forEach((item, i) => {
    // console.log("item: ",item);
    const messageitem = document.createElement("div");
    messageitem.classList.add("messageitem");
    const messageitem_icon = document.createElement("div");
    messageitem_icon.classList.add("messageitem_icon");
    const _chatboxmessagae = document.createElement("div");
    _chatboxmessagae.classList.add( USERDATA.ID == item.userid?"userchatboxmessagae":"guestchatboxmessagae");
    const hidemessageinfo = document.createElement("div");
    hidemessageinfo.classList.add("hidemessageinfo");
    hidemessageinfo.innerHTML = getDateString(new Date(item.datetime_unhide));
    hidemessageinfo.id = "messageinfoID" + item.unhide_usermindid;
    const messgetextbean = document.createElement("div");
    const messgetext = document.createElement("div");
    messgetext.classList.add("messgetext");
    if (USERDATA.ID == item.userid) {
      messgetext.classList.add("msguser");
    }else {
      messgetext.classList.add("msgguest");
    }
    messgetext.id = "message_dataID" + item.unhide_usermindid;
    messgetext.addEventListener("click", function() {
      // show info text
      const id = this.id.substring(14);
      const infoID = "messageinfoID"+id ;
      const classname = document.getElementById(infoID).className;
      if (classname.localeCompare("hidemessageinfo") == 0) {
        document.getElementById(infoID).className = "messageinfo";
      }else if (classname.localeCompare("messageinfo") == 0) {
        document.getElementById(infoID).className = "hidemessageinfo";
      }
    });
    messgetext.innerHTML = item.message_data;
    messgetextbean.appendChild(messgetext);
    messageitem.appendChild(messageitem_icon);
    messageitem.appendChild(_chatboxmessagae);
    _chatboxmessagae.appendChild(hidemessageinfo);
    _chatboxmessagae.appendChild(messgetextbean);
    messagebox.prepend(messageitem);
    // console.log("item: ", item);
    if (item.receiverid == USERDATA.ID) {// load unread data from server to cache
      const partnerchat_data = {
        "RECEI_CHTDATA_CACHEITEM_ID": RECEI_CHTDATA_CACHEITEM_ID,
        "userid": item.userid, //sender
        "username": item.username, // sender
        "unhide_usermindid": item.unhide_usermindid,
        "datetime_unhide":item.datetime_unhide,
        "message_data": item.message_data,
        "login": item.lastdatetimelogin,
        "datetime_read": item.datetime_read,
        "sended": false,
        "success": false,
        "sendingcount": 0,
        "viewinbrowser": true,
        "resID": {"readerid": -1, "unhide_usermindid":-1}
      };
      chatboxStack_data_item.receive_chatdata_cache.push(partnerchat_data);
      RECEI_CHTDATA_CACHEITEM_ID += 1;
    }
  });
  if (chatboxStack_data_item.lastCountConversation < converstation.length&&!chatboxStack_data_item.user_isscrollchatbox) {
    refreshchatbox(type, friendID);
  }
  chatboxStack_data_item.lastCountConversation = converstation.length;

}


async function loadFriendchatbox(friendID){
  const type = CHATROOMTYPE.TYPEFRIEND;
  const friendinfo = JSON.parse(await getFriendInfomation(friendID));
  // console.log("friendID: ", friendID, friendinfo);
  if(friendinfo.length<=0) return ;
  let friend = friendinfo[0];
  document.getElementById("chatboxnameID"+type+friendID).innerHTML = friend.username;
  const memberList = document.getElementById("memberID"+type+friendID);
  memberList.innerHTML = "";
  const memberitem = document.createElement("div");
  memberitem.classList.add("memberitem");
  memberitem.id = "memberitemID" +type+friendID+"-"+ friend.userid;
  const onlinestatus = document.createElement("div");
  onlinestatus.classList.add("onlinestatus");
  const icon = document.createElement("div");
  icon.classList.add("icon");
  const username = document.createElement("div");
  username.classList.add("username");
  username.innerHTML = friend.username;
  memberitem.appendChild(onlinestatus);
  memberitem.appendChild(icon);
  memberitem.appendChild(username);
  memberList.appendChild(memberitem);
}


async function loadGroupchatbox(groupID){
  const type = CHATROOMTYPE.TYPEGROUP;
  const group = JSON.parse(await getGroupInfomation(groupID));
  if(group){
    const creator = group[0].creator, group_name = group[0].group_name, groupid = group[0].groupid;
    document.getElementById("chatboxnameID"+type+groupID).innerHTML = group_name;
    const memberList = document.getElementById("memberID"+type+groupID);
    memberList.innerHTML = "";
    group.forEach((item, i) => {
      const memberitem = document.createElement("div");
      memberitem.classList.add("memberitem");
      memberitem.id = "memberitemID" +type+groupID+"-"+ item.userid;
      const onlinestatus = document.createElement("div");
      onlinestatus.classList.add("onlinestatus");
      const icon = document.createElement("div");
      icon.classList.add("icon");
      const username = document.createElement("div");
      username.classList.add("username");
      username.innerHTML = item.username;
      memberitem.appendChild(onlinestatus);
      memberitem.appendChild(icon);
      memberitem.appendChild(username);
      if (creator == USERDATA.ID) {
        const removemember = document.createElement("div");
        removemember.classList.add("removemember");
        removemember.id = "removememberitemID"+type+groupID+item.userid;
        removemember.innerHTML = "&times;";
        memberitem.appendChild(removemember);
      }
      memberList.appendChild(memberitem);

    });

    if (creator == (USERDATA.ID)) {
      const memberitem = document.createElement("div");
      memberitem.classList.add("memberitem");
      const memberinvite = document.createElement("div");
      memberinvite.classList.add("memberinvite");
      memberinvite.innerHTML = "invite friend";
      memberitem.appendChild(memberinvite);
      memberList.appendChild(memberitem);
    }
  }
}


async function loadGroupConversation(groupID){
  // user view conversation, serverupdater will hot run to update:
  _chatService.updaterrate.serverupdater.delay = _chatService.updaterrate.serverupdater.limittocooldown;
  // get data
  const type = CHATROOMTYPE.TYPEGROUP;
  const groupConversation = JSON.parse(await getGroupConversation(groupID));
  const messagebox = document.getElementById("messageboxID"+type+groupID);
  messagebox.innerHTML = "";
  var chatboxStack_data_item = {};

  ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&& groupID == item.id) {
      chatboxStack_data_item = item;
    }
  });
  if(groupConversation)
  groupConversation.forEach((item, i) => {
    // console.log("item: ",item);
    const messageitem = document.createElement("div");
    messageitem.classList.add("messageitem");
    const messageitem_icon = document.createElement("div");
    messageitem_icon.classList.add("messageitem_icon");
    const _chatboxmessagae = document.createElement("div");
    _chatboxmessagae.classList.add( USERDATA.ID == item.userid?"userchatboxmessagae":"guestchatboxmessagae");
    const hidemessageinfo = document.createElement("div");
    hidemessageinfo.classList.add("hidemessageinfo");
    hidemessageinfo.innerHTML = getDateString(new Date(item.datetime_unhide));
    hidemessageinfo.id = "messageinfoID" + item.unhide_usermindid;
    const messgetextbean = document.createElement("div");
    const messgetext = document.createElement("div");
    messgetext.classList.add("messgetext");
    if (USERDATA.ID == item.userid) {
      messgetext.classList.add("msguser");
    }else {
      messgetext.classList.add("msgguest");
    }
    messgetext.id = "message_dataID" + item.unhide_usermindid;
    messgetext.addEventListener("click", function() {
      // show info text
      const id = this.id.substring(14);
      const infoID = "messageinfoID"+id ;
      const classname = document.getElementById(infoID).className;
      if (classname.localeCompare("hidemessageinfo") == 0) {
        document.getElementById(infoID).className = "messageinfo";
      }else if (classname.localeCompare("messageinfo") == 0) {
        document.getElementById(infoID).className = "hidemessageinfo";
      }
    });
    messgetext.innerHTML = item.message_data;
    messgetextbean.appendChild(messgetext);
    messageitem.appendChild(messageitem_icon);
    messageitem.appendChild(_chatboxmessagae);
    _chatboxmessagae.appendChild(hidemessageinfo);
    _chatboxmessagae.appendChild(messgetextbean);
    messagebox.prepend(messageitem);
    // console.log("item: ", item);
    if (item.readerid == USERDATA.ID) {// load unread data from server to cache
      const partnerchat_data = {
        "RECEI_CHTDATA_CACHEITEM_ID": RECEI_CHTDATA_CACHEITEM_ID,
        "userid": item.userid,
        "username": item.username,
        "unhide_usermindid": item.unhide_usermindid,
        "datetime_unhide":item.datetime_unhide,
        "message_data": item.message_data,
        "login": item.login,
        "datetime_read": item.datetime_read,
        "sended": false,
        "success": false,
        "sendingcount": 0,
        "viewinbrowser": true,
        "resID": {"readerid": -1, "unhide_usermindid":-1}
      };
      chatboxStack_data_item.receive_chatdata_cache.push(partnerchat_data);
      RECEI_CHTDATA_CACHEITEM_ID += 1;
    }

  });
  if (chatboxStack_data_item.lastCountConversation < groupConversation.length&&!chatboxStack_data_item.user_isscrollchatbox) {
    refreshchatbox(type, groupID);
  }
  chatboxStack_data_item.lastCountConversation = groupConversation.length;
}


// send data
var post_data_id = 0;
function sendMessage(type, id){
  // console.log("messID"+type+ id);
  const typingbox = document.getElementById("messID"+type+ id);
  const mess = typingbox.value.replaceAll(/'/g, "\\'");
  if(mess.localeCompare("") == 0)return;
  const post_data = {
    "post_data_id":post_data_id,
    "message": mess,
    "datetimesend" :getDateString(new Date()) ,
    "sended": false,
    "success": false,
    "sendingcount": 0,
    "resID":-1
  };
  temporaryShowClientMessage( type, id, post_data_id, mess);
  ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&&id == item.id) {
      if(item.receive_chatdata_cache.length>= 100)
      {
        item.sending_chatdata_cache = [];//refresh cache
      }
      item.sending_chatdata_cache.push(post_data);
    }
  });
  refreshchatbox(type, id);
  typingbox.value = "";
  auto_grow(typingbox);
  post_data_id += 1;
}


function temporaryShowClientMessage(type, friendID, post_data_id, mess){
  const messageitem = document.createElement("div");
  messageitem.classList.add("messageitem");
  messageitem.id = "tempmessageitemID"+post_data_id;
  const messageitem_icon = document.createElement("div");
  messageitem_icon.classList.add("messageitem_icon");
  const userchatboxmessagae = document.createElement("div");
  userchatboxmessagae.classList.add("userchatboxmessagae");
  const messageinfo = document.createElement("div");
  messageinfo.id = "tempmessageinfoID"+post_data_id;
  messageinfo.classList.add("messageinfo");
  messageinfo.innerHTML = "sending...";
  const messgetextbean = document.createElement("div");
  const messgetext = document.createElement("div");
  messgetext.id = "tempmessagetextID"+post_data_id;
  messgetext.classList.add("messgetext");
  messgetext.classList.add("msguser");
  messgetext.innerHTML = mess;
  // console.log("mess: ", mess);
  messgetextbean.appendChild(messgetext);
  userchatboxmessagae.appendChild(messageinfo);
  userchatboxmessagae.appendChild(messgetextbean);
  messageitem.appendChild(messageitem_icon);
  messageitem.appendChild(userchatboxmessagae);
  document.getElementById("messageboxID"+type + friendID).appendChild(messageitem);
}


async function addChatbox(type, id, name){
  // console.log(type, id);
  const chatbox = document.createElement("div");
  chatbox.id = "chatboxID" + type + id;
  chatbox.classList.add("chatbox");
  const typingbox = document.createElement("div");
  typingbox.classList.add("typingbox");
  typingbox.id = "typingboxID" + type + id;
  const mess = document.createElement("textarea");
  mess.classList.add("mess");
  mess.id = "messID" + type + id;
  mess.addEventListener("input",function() {
    this.style.height = "20px";
    this.style.height = (this.scrollHeight-8)+"px";
  });
  mess.addEventListener("keypress",function(event) {
    if(event.keyCode!== 13)
    return;
    event.preventDefault(); // Ensure it is only this code that runs
    sendMessage(type, id);
  });
  const sendbutton = document.createElement("div");
  sendbutton.classList.add("sendbutton");
  sendbutton.id = "sendbuttonID" + type + id;
  sendbutton.innerHTML = "send";
  sendbutton.addEventListener("click",function() {
    sendMessage(type, id);
  });
  const messagebox = document.createElement("div");
  messagebox.classList.add("messagebox");
  messagebox.id = "messageboxID"+ type + id;
  messagebox.addEventListener("scroll",function(event) {
    user_isscrollboxtrue(type, id);
  });
  const member = document.createElement("div");
  member.classList.add("member");
  member.id = "memberID"+ type + id;
  const titlechatbox = document.createElement("div");
  titlechatbox.classList.add("titlechatbox");
  const chatboxname = document.createElement("div");
  chatboxname.classList.add("chatboxname");
  chatboxname.id = "chatboxnameID"+ type + id;
  const controlchatbox = document.createElement("div");
  controlchatbox.classList.add("controlchatbox");
  const chatbox_minimize = document.createElement("div");
  chatbox_minimize.classList.add("chatbox_minimize");
  chatbox_minimize.id = "chatbox_minimizeID"+ type + id;
  chatbox_minimize.addEventListener('click', function(){
    const thisid = this.id;
    const typeid = thisid.substring(18);

    const chatbox = document.getElementById("chatboxID"+ typeid);
    const member = document.getElementById("memberID"+ typeid);
    const messagebox = document.getElementById("messageboxID"+ typeid);
    const typingbox = document.getElementById("typingboxID"+ typeid);
    const n = thisid.indexOf(CHATROOMTYPE.TYPEGROUP);
    const m = thisid.indexOf(CHATROOMTYPE.TYPEFRIEND);
    var type ;
    var id ;
    if (n>= 0) {
      type = CHATROOMTYPE.TYPEGROUP;
      id = parseInt(thisid.substring(23));
      console.log(type, thisid.substring(23));
    }
    if (m>= 0) {
      type = CHATROOMTYPE.TYPEFRIEND;
      id = parseInt(thisid.substring(24));
      console.log(type, id);
    }
    ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
      console.log(id, type);
      if ((type.localeCompare(item.type) == 0)&&id == item.id) {
        if(item.CHATBOXSTATE == CHATBOXSTATE.MINIMIZE){
          item.CHATBOXSTATE = CHATBOXSTATE.NORMAL;
          chatbox.style.height = "";
          chatbox.className = "chatbox";
          member.className = "member";
          messagebox.className = "messagebox";
          typingbox.className = "typingbox";
        }else {
          item.CHATBOXSTATE = CHATBOXSTATE.MINIMIZE;
          chatbox.style.height = "";
          chatbox.className = "chatboxminimize";
          member.className = "memberminimize";
          messagebox.className = "messageboxminimize";
          typingbox.className = "typingboxminimize";
        }
      }
    });
  });
  const chatbox_maximize = document.createElement("div");
  chatbox_maximize.classList.add("chatbox_maximize");
  chatbox_maximize.id = "chatbox_maximize"+ type + id;
  chatbox_maximize.addEventListener('click', function(){
    const thisid = this.id;
    const typeid = thisid.substring(16);

    const chatbox = document.getElementById("chatboxID"+ typeid);
    const n = thisid.indexOf(CHATROOMTYPE.TYPEGROUP);
    const m = thisid.indexOf(CHATROOMTYPE.TYPEFRIEND);
    var type ;
    var id ;
    if (n>= 0) {
      type = CHATROOMTYPE.TYPEGROUP;
      id = parseInt(thisid.substring(21));
    }
    if (m>= 0) {
      type = CHATROOMTYPE.TYPEFRIEND;
      id = parseInt(thisid.substring(22));
    }
    ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
      if ((type.localeCompare(item.type) == 0)&&id == item.id) {
        if(item.CHATBOXSTATE == CHATBOXSTATE.MAXIMIZE){
          item.CHATBOXSTATE = CHATBOXSTATE.NORMAL;
          chatbox.style.height = "";
          chatbox.className = "chatbox";
          member.className = "member";
          messagebox.className = "messagebox";
          typingbox.className = "typingbox";
        }else
        if(item.CHATBOXSTATE!= CHATBOXSTATE.MAXIMIZE){
          item.CHATBOXSTATE = CHATBOXSTATE.MAXIMIZE;
          chatbox.style.height = "calc(100vh - 80px)";
          chatbox.className = "chatbox";
          member.className = "member";
          messagebox.className = "messagebox";
          typingbox.className = "typingbox";
        }
      }
    });
  });
  const chatbox_close = document.createElement("div");
  chatbox_close.classList.add("chatbox_close");
  chatbox_close.id = "chatbox_closeID"+ type + id;
  chatbox_close.addEventListener('click', function(){
    const thisid = this.id;
    const n = thisid.indexOf(CHATROOMTYPE.TYPEGROUP);
    const m = thisid.indexOf(CHATROOMTYPE.TYPEFRIEND);
    let type ;
    let id ;
    if (n>= 0) {
      type = CHATROOMTYPE.TYPEGROUP;
      id = parseInt(thisid.substring(20));
    }
    if (m>= 0) {
      type = CHATROOMTYPE.TYPEFRIEND;
      id = parseInt(thisid.substring(21));
    }
    console.log("close: ",type, id);
    if (ACTIVECHATBOX_LIST.chatboxStack.data.length == 0) return ;
    if (ACTIVECHATBOX_LIST.recentchatbox.data.length == 0) return ;
    const chatboxbean = document.getElementById("chatboxbeanID");
    ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
      if (item.type.localeCompare(type) == 0&&id == item.id) {
        chatboxbean.removeChild(item.chatbox);// .remove();
        // console.log(ACTIVECHATBOX_LIST.chatboxStack.data[0].chatbox);
        ACTIVECHATBOX_LIST.chatboxStack.data.remove(item);
      }
    });

  });
  chatbox_close.innerHTML = "&times;";
  controlchatbox.appendChild(chatbox_minimize);
  controlchatbox.appendChild(chatbox_maximize);
  controlchatbox.appendChild(chatbox_close);
  titlechatbox.appendChild(chatboxname);
  titlechatbox.appendChild(controlchatbox);
  typingbox.appendChild(mess);
  typingbox.appendChild(sendbutton);

  chatbox.appendChild(typingbox);
  chatbox.appendChild(messagebox);
  chatbox.appendChild(member);
  chatbox.appendChild(titlechatbox);

  const chatboxbean = document.getElementById("chatboxbeanID");

  var return_ = false;
  ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&&id == item.id) {
      // dont add double id
      return_ = true;
    }
  });
  if(return_ )return;
  // remove chatbox
  if (ACTIVECHATBOX_LIST.chatboxStack.data.length>= ACTIVECHATBOX_LIST.chatboxStack.maxWindows) {
    chatboxbean.removeChild(ACTIVECHATBOX_LIST.chatboxStack.data[0].chatbox);// .remove();
    ACTIVECHATBOX_LIST.chatboxStack.data.remove(ACTIVECHATBOX_LIST.chatboxStack.data[0]);
  }
  //add chatbox
  const data = {"id": id, "type":type, "user_isscrollchatbox": false,
  "lastCountConversation": 0, "CHATBOXSTATE": CHATBOXSTATE.NORMAL,
  "sending_chatdata_cache": [], "receive_chatdata_cache": [],
  "chatbox": chatbox};
  ACTIVECHATBOX_LIST.chatboxStack.data.push(data);
  chatboxbean.append(chatbox);
  // chatboxbean.prepend(chatbox);

  var return__ = false;
  ACTIVECHATBOX_LIST.recentchatbox.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&&id == item.id) {
      // dont add double id
      return__ = true;
    }
  });
  if(return__)return ;

  if (ACTIVECHATBOX_LIST.recentchatbox.data.length>= ACTIVECHATBOX_LIST.recentchatbox.maxRecent) {
    const idx = ACTIVECHATBOX_LIST.recentchatbox.data.length - ACTIVECHATBOX_LIST.recentchatbox.maxRecent;
    for (var i = 0; i < idx; i++) {
      ACTIVECHATBOX_LIST.recentchatbox.data.remove(ACTIVECHATBOX_LIST.recentchatbox.data[i]);
      // remove now, if dont, you cant access it
      const body = document.getElementById("bodyID");
      const recentitem = document.getElementById("recentchatboxID" + ACTIVECHATBOX_LIST.recentchatbox.data[0].type + ACTIVECHATBOX_LIST.recentchatbox.data[0].id);
      if (recentitem)
      await body.removeChild(recentitem);// .remove();
    }
  }

  const recentdata = {"id": id, "type":type, "name": name};
  // console.log("add data: ", recentdata);
  ACTIVECHATBOX_LIST.recentchatbox.data.push(recentdata);
  // console.log(ACTIVECHATBOX_LIST.recentchatbox.data);
  saverecentcontacttocookie(ACTIVECHATBOX_LIST.recentchatbox);
  drawrecentchatbox(ACTIVECHATBOX_LIST.recentchatbox);
}

function saverecentcontacttocookie(recentchatbox){
  new Promise(function(resolve, reject) {
    var recentcontact = "";
    // console.log("recentchatbox", recentchatbox);
    recentchatbox.data.some((item, i) => {
      if(item.type!== undefined&&item.id)
      recentcontact += item.type + "+" +item.id+ "+" + item.name + ((i == recentchatbox.data.length-1)?"":"-");
    });
    // console.log("recentcontact: ", "recentcontact = "+recentcontact+"");
    document.cookie = "recentcontact = "+recentcontact+"";
  });
}


function refreshchatbox(type, id){
  console.log("refreshchatbox");
  const messagebox = document.getElementById("messageboxID"+type+ id);
  const height = messagebox.scrollHeight;
  const limit = window.scrollMaxY? Math.max (window.scrollMaxY, messagebox.scrollHeight - messagebox.clientHeight): messagebox.scrollHeight - messagebox.clientHeight;
  messagebox.scrollTop = limit;
  ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&&(id = item.id)) {
      item.user_isscrollchatbox = false;
    }
  });
}

function auto_grow(element) {
  element.style.height = "20px";
  element.style.height = (element.scrollHeight-8)+"px";
}

function user_isscrollboxtrue(type, id){
  // scroll is max position
  const messagebox = document.getElementById("messageboxID"+type+ id);
  const limit = window.scrollMaxY? Math.max (window.scrollMaxY, messagebox.scrollHeight - messagebox.clientHeight): messagebox.scrollHeight - messagebox.clientHeight;
  ACTIVECHATBOX_LIST.chatboxStack.data.forEach((item, i) => {
    if ((type.localeCompare(item.type) == 0)&&(id = item.id)) {
      if (messagebox.scrollTop == limit) {
        item.user_isscrollchatbox = false;
        return;
      }
      item.user_isscrollchatbox = true;
    }
  });

}

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what))!== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function getDateString(d){
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  var hh = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
  const mm = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  const ss = new Intl.DateTimeFormat('en', { second: '2-digit' }).format(d);
  if (parseInt(hh)>23) {
    hh = "00";
  }
  return `${ye}-${mo}-${da} ${hh}:${mm}:${ss}`;
}
