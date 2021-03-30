let CHATROOMTYPE = {"TYPEFRIEND": "friend", "TYPEGROUP": "group"};
let CHATBOXSTATE = {"MAXIMIZE": 2, "MINIMIZE": 0, "NORMAL": 1};
Object.freeze(CHATROOMTYPE); //set Enum
Object.freeze(CHATBOXSTATE); //set Enum
let PUPLESTATE = { showpuplebox_toolbar: false, show_addfriend: true,show_newgroup: true, show_story: true };
let CHAT_ITEM_SELECTED = {type: "unset", id: -1};
let ACTIVECHATBOX_LIST = {"chatboxStack": {"maxWindows": 3, "data":[]}, "recentchatbox":{"maxRecent": parseInt(window.innerWidth/150), "data":[]} };
let USERDATA = {};
let Friendchat_list ;
let Groupchat_list;

async function inituserData() {
  Friendchat_list = JSON.parse(await getFriendlist());
  initFriendList();
  await sleep(10);
  Groupchat_list = JSON.parse(await getGrouplist());
  initGroupchatList();
  await sleep(10);
  initRecentcontact();
  await sleep(10);
  _chatService.startchatService(ACTIVECHATBOX_LIST, Groupchat_list, Friendchat_list);
}

function initPuplebox(){
  document.getElementById("logout_buttonID").style.display = "";
  document.getElementById("login_buttonID").style.display = "none";

  const puplebox = document.getElementById("pupleID");
  puplebox.addEventListener('click', () =>{
    if(MOUSESTATE.PRESSANDMOVE)return ;
    if(PUPLESTATE.SHOW_PUPLEBOX_TOOLBAR){
      document.getElementById("toolbarID").className = "toolbar";
    }else {
      document.getElementById("toolbarID").className = "hidetoolbar";
      close_newgroup();
      close_addfriend();
    }
    PUPLESTATE.SHOW_PUPLEBOX_TOOLBAR =!PUPLESTATE.SHOW_PUPLEBOX_TOOLBAR;
  });

  const addfriend = document.getElementById("addfriendID");
  addfriend.addEventListener('click', async () =>{
    if(MOUSESTATE.PRESSANDMOVE)return ;
    close_newgroup();
    await sleep(120);
    show_addfriend();
  });

  const newfriendtext = document.getElementById("newfriendtextID");
  newfriendtext.addEventListener('keypress', function(event) {
    if(event.keyCode !== 13 && newfriendtext.value.length<30) return;
    event.preventDefault();
  });

  const searchbutton = document.getElementById("searchbuttonID");
  searchbutton.addEventListener('click',async function(){
    const newfriendtext = document.getElementById("newfriendtextID");
    const pattern = newfriendtext.value;
    // console.log(pattern);
    if(pattern.localeCompare("")===0) return ;
    const friend =  JSON.parse(await findUsername (pattern));
    if(friend.length>0)
    {
      showfriendSreachresult(friend[0]);
    } else {
      showfriendSreachresult({username: "noresult for: "+ pattern});
    }
  });

  const newgroup = document.getElementById("newgroupID");
  newgroup.addEventListener('click',async () =>{
    if(MOUSESTATE.PRESSANDMOVE)return ;
    close_addfriend();
    await sleep(120);
    show_newgroup();
  });

  const openstory = document.getElementById("openstoryID");
  openstory.addEventListener('click', () =>{
    if(MOUSESTATE.PRESSANDMOVE)return ;
    if(PUPLESTATE.show_story){
      document.getElementById("liststoryID").className = "liststory";
    }else {
      document.getElementById("liststoryID").className = "hideliststory";
    }
    PUPLESTATE.show_story =!PUPLESTATE.show_story;
  });
  const logout = document.getElementById("logout_buttonID");
  logout.addEventListener('click', function(){
    // signout ();
    window.location.replace("/logout?token="+TOKEN);
  });
}

function show_newgroup() {
  if(PUPLESTATE.show_newgroup){
    document.getElementById("creategroupboxID").className = "creategroupbox";
    loadfriendlist(true);
  }else {
    document.getElementById("creategroupboxID").className = "hidecreategroupbox";
    loadfriendlist(false);
  }
  PUPLESTATE.show_newgroup =!PUPLESTATE.show_newgroup;
}
function loadfriendlist(show){
  const listfriend = document.getElementById("creategroup_friendlistID");
  if(!show) {listfriend.innerHTML=""; return;}
  Friendchat_list.forEach((item, i) => {
    const creategroup_friendlist_item = document.createElement("div");
    creategroup_friendlist_item.classList.add("creategroup_friendlist_item");
    const friendlist_item_name = document.createElement("div");
    friendlist_item_name.classList.add("friendlist_item_name");
    friendlist_item_name.innerHTML = item.username;
    const friendlist_item_checker = document.createElement("input");
    friendlist_item_checker.classList.add("friendlist_item_checker");
    friendlist_item_checker.setAttribute("type", "checkbox");
    friendlist_item_checker.id = "friendlist_item_checker" + item.userid;
    creategroup_friendlist_item.appendChild(friendlist_item_name);
    creategroup_friendlist_item.appendChild(friendlist_item_checker);
    listfriend.appendChild(creategroup_friendlist_item);
  });
}
function show_addfriend() {
  if(PUPLESTATE.show_addfriend){
    document.getElementById("addfriendboxID").className = "addfriendbox";
  }else {
    document.getElementById("addfriendboxID").className = "hideaddfriendbox";
  }
  PUPLESTATE.show_addfriend =!PUPLESTATE.show_addfriend;
}

async function close_newgroup(){
  if(!PUPLESTATE.show_newgroup){
    document.getElementById("creategroupboxID").className = "hidecreategroupbox";
    PUPLESTATE.show_newgroup =!PUPLESTATE.show_newgroup;
    loadfriendlist(false);
  }
}
function close_addfriend(){
  if(!PUPLESTATE.show_addfriend){
    document.getElementById("addfriendboxID").className = "hideaddfriendbox";
    PUPLESTATE.show_addfriend =!PUPLESTATE.show_addfriend;
  }
  clearsearch();
}

function clearsearch(){
  const addfriendsearchresult = document.getElementById("addfriendsearchresultID");
  addfriendsearchresult.innerHTML="";
  const newfriendtext = document.getElementById("newfriendtextID");
  newfriendtext.value="";
}

function showfriendSreachresult(friend){
  const addfriendsearchresult = document.getElementById("addfriendsearchresultID");
  addfriendsearchresult.innerHTML="";
  const addfriendqueryresult = document.createElement("div");
  addfriendqueryresult.classList.add("addfriendqueryresult");
  addfriendqueryresult.id = "addfriendqueryresultID";
  addfriendqueryresult.innerHTML="";
  const friendinfo = document.createElement("div");
  friendinfo.classList.add("friendinfo");
  friendinfo.id = "friendavatarID" + friend.userid;
  const friendavatar = document.createElement("div");
  friendavatar.classList.add("friendavatar");
  const friendname = document.createElement("div");
  friendname.classList.add("friendname");
  friendname.id = "friendnameID" + friend.userid;
  friendname.innerHTML = friend.username;
  const addfriendbutton = document.createElement("div");
  addfriendbutton.classList.add("addfriendbutton");
  addfriendbutton.id = "addfriendbuttonID" + friend.userid;
  addfriendbutton.innerHTML= "+ add friend";
  addfriendbutton.addEventListener('click', function(){
    const userid = this.id.substring(18);
    sendaddfriendRequest(friend.userid, USERDATA.userid);
  })
  const descript = document.createElement("div");
  descript.classList.add("descript");
  const userdescript = document.createElement("div");
  userdescript.classList.add("userdescript");
  descript.appendChild(userdescript);
  friendinfo.appendChild(friendavatar);
  friendinfo.appendChild(friendname);
  friendinfo.appendChild(addfriendbutton);
  addfriendqueryresult.appendChild(friendinfo);
  addfriendqueryresult.appendChild(descript);
  const addfriendbox = document.getElementById("addfriendboxID");
  addfriendsearchresult.appendChild(addfriendqueryresult);
  addfriendbox.appendChild(addfriendsearchresult);
}

function initFriendList(){
  if (!Friendchat_list) return ;
  const friendlist = document. getElementById("friendlistID");
  friendlist.addEventListener('wheel', (e) =>{
    if (event.deltaY<0) {
      friendlist.scrollTop -= 12;
    }else if (event.deltaY>0) {
      friendlist.scrollTop += 12;
    }
  });
  friendlist.innerHTML = "";
  Friendchat_list.forEach((item, i) => {
    const frienditem = document.createElement("div");
    frienditem.id = "frienditemID"+item.userid;
    frienditem.classList.add("frienditem");
    frienditem.addEventListener("mouseup", function (){CHAT_ITEM_SELECTED.id = this.id; CHAT_ITEM_SELECTED.type = CHATROOMTYPE.TYPEFRIEND});
    frienditem.addEventListener("mouseout", function (){
      if(CHAT_ITEM_SELECTED.type!= CHATROOMTYPE.TYPEFRIEND/* = group*/) return;
      if(this.id.localeCompare(CHAT_ITEM_SELECTED.id)!= 0){
        document.getElementById(this.id).style.backgroundColor = "";
      }
    });
    frienditem.addEventListener("mousemove", function (){
      if(CHAT_ITEM_SELECTED.type!= CHATROOMTYPE.TYPEFRIEND/* = group*/) return;
      if(this.id.localeCompare(CHAT_ITEM_SELECTED.id)!= 0){
        document.getElementById(this.id).style.backgroundColor = "#EDEDED";
      }
    });
    frienditem.addEventListener("mousedown", function (){
      document.getElementById(this.id).style.backgroundColor = "#DBDBDB";
    });
    frienditem.addEventListener("click", function (){
      friendChat_hightlight(this.id);
      // loadMember(id);
      const friendID = this.id.substring(12);
      const friendname = document.getElementById("friendnameID"+friendID).innerHTML;
      addChatbox(CHATROOMTYPE.TYPEFRIEND, friendID, friendname);
      loadFriendchatbox(friendID);
      loadFriendConversation(friendID);
    });
    const onlinestatus = document.createElement("div");
    onlinestatus.classList.add("onlinestatus");
    onlinestatus.id = "friendonlinestatusID" + item.userid;
    // console.log("is_Stillonline(item.lastdatetimelogin):", istillonline(item.lastdatetimelogin));
    onlinestatus.style.backgroundColor = (is_Stillonline(item.lastdatetimelogin)?"#06FF0B":"#cc0000");
    const icon = document.createElement("div");
    icon.classList.add("icon");
    const username = document.createElement("div");
    username.classList.add("username");
    username.id = "friendnameID" + item.userid;
    username.innerHTML = item.username;
    const notice = document.createElement("div");
    notice.classList.add("notice");
    notice.classList.add("hidenotice");
    notice.id = "friendnotice"+item.userid;
    const noticevalue = document.createElement("div");
    noticevalue.classList.add("noticevalue");
    noticevalue.id = "friendnoticevalue"+item.userid;
    noticevalue.innerHTML = 0;
    notice.appendChild(noticevalue);
    frienditem.appendChild(onlinestatus);
    frienditem.appendChild(icon);
    frienditem.appendChild(username);
    frienditem.appendChild(notice);
    friendlist.appendChild(frienditem);

  });
}


function initGroupchatList(){
  const yourgroup = document.getElementById("yourgroupID");
  yourgroup.addEventListener('wheel', (e) =>{
    if (event.deltaY<0) {
      yourgroup.scrollTop -= 12;
    }else if (event.deltaY>0) {
      yourgroup.scrollTop += 12;
    }
  });
  yourgroup.innerHTML = "";
  console.log("Groupchat_list");
  if(Groupchat_list)
  Groupchat_list.forEach( async (item, i) => {
    item.groupinfo = JSON.parse(await getGroupInfomation(item.groupid));
    var groupisonline = false;
    if(item.groupinfo)
    item.groupinfo.some((item_, i) => {
      // console.log(item_.lastdatetimelogin);
      if (item_.userid!= USERDATA.ID)
      if (item_.lastdatetimelogin)
      if(is_Stillonline(item_.lastdatetimelogin)){groupisonline = true; return ;}
    });
    // console.log("groupisonline:", groupisonline);
    const groupitem = document.createElement("div");
    groupitem.classList.add("groupitem");
    groupitem.id = "groupitemID"+item.groupid;
    groupitem.addEventListener("mouseup", function (){ CHAT_ITEM_SELECTED.id = this.id; CHAT_ITEM_SELECTED.type = CHATROOMTYPE.TYPEGROUP});
    groupitem.addEventListener("mouseout", function (){
      if(CHAT_ITEM_SELECTED.type!= CHATROOMTYPE.TYPEGROUP/* = group*/) return;
      if(this.id.localeCompare(CHAT_ITEM_SELECTED.id)!= 0){
        document.getElementById(this.id).style.backgroundColor = "";
      }
    });
    groupitem.addEventListener("mousemove", function (){
      if(CHAT_ITEM_SELECTED.type!= CHATROOMTYPE.TYPEGROUP/* = group*/) return;
      if(this.id.localeCompare(CHAT_ITEM_SELECTED.id)!= 0){
        document.getElementById(this.id).style.backgroundColor = "#EDEDED";
      }
    });
    groupitem.addEventListener("mousedown", function (){
      document.getElementById(this.id).style.backgroundColor = "#DBDBDB";
    });
    groupitem.addEventListener("click", function (){
      groupChat_hightlight(this.id);
      const groupID = this.id.substring(11);
      // loadMember(id);
      const groupname = document.getElementById("groupnameID"+groupID).innerHTML;
      addChatbox(CHATROOMTYPE.TYPEGROUP,groupID, groupname);
      loadGroupchatbox(groupID);
      loadGroupConversation(groupID);
    });
    const onlinestatus = document.createElement("div");
    onlinestatus.classList.add("onlinestatus");
    onlinestatus.id = "grouponlinestatusID"+item.groupid;
    onlinestatus.style.backgroundColor = (groupisonline?"#06FF0B":"#cc0000");
    const groupiconparent = document.createElement("div");
    groupiconparent.classList.add("groupicon");
    const groupicon1 = document.createElement("div");
    groupicon1.classList.add("groupicon");
    const groupicon2 = document.createElement("div");
    groupicon2.classList.add("groupicon");
    const groupicon3 = document.createElement("div");
    groupicon3.classList.add("groupicon");
    const groupitemname = document.createElement("div");
    groupitemname.classList.add("groupitemname");
    const groupname = document.createElement("div");
    groupname.classList.add("groupname");
    groupname.id = "groupnameID"+item.groupid;
    groupname.innerHTML = item.group_name;

    const notice = document.createElement("div");
    notice.classList.add("notice");
    notice.classList.add("hidenotice");
    notice.id = "groupnotice"+item.groupid;
    const noticevalue = document.createElement("div");
    noticevalue.classList.add("noticevalue");
    noticevalue.id = "groupnoticevalue"+item.groupid;
    noticevalue.innerHTML = 0;
    notice.appendChild(noticevalue);
    groupiconparent.appendChild(groupicon1);
    groupiconparent.appendChild(groupicon2);
    groupiconparent.appendChild(groupicon3);
    groupitemname.appendChild(groupname);
    groupitem.appendChild(onlinestatus);
    groupitem.appendChild(groupiconparent);
    groupitem.appendChild(groupitemname);
    groupitem.appendChild(notice);
    yourgroup.appendChild(groupitem);
  });
}

function getrecentcontacttocookie(){
  return new Promise(function(resolve, reject) {
    const cookie = document.cookie;
    cookie.split(";").forEach((item, i) => {
      const n = item.indexOf("recentcontact");
      if(n>= 0){
        console.log(item);
        resolve( item.split("=")[1]);
      }
    });
    resolve ("");
  });
}

async function initRecentcontact(){
  const recentcontactcookie = await getrecentcontacttocookie();
  // check user stay in converstation
  //
  //

  // console.log("recentcontactcookie",recentcontactcookie);
  const items = recentcontactcookie.split("-");
  if(!items) return ;
  if (items.length == 0) return ;
  items.some((item, i) => {
    // console.log(item);
    const item_ = item.split("+");
    const type = item_[0];
    const id = parseInt(item_[1]);
    const name = item_[2];
    if (!id) return ;
    if (!type) return ;
    if(!name) return ;
    const recentdata = {"id": id, "type":type, "name": name}
    // console.log("add data: ", recentdata);
    ACTIVECHATBOX_LIST.recentchatbox.data.push(recentdata);
  });
  drawrecentchatbox(ACTIVECHATBOX_LIST.recentchatbox);
}

async function drawrecentchatbox(recentdata){
  const body = document.getElementById("bodyID");

  const classlist = document.getElementsByClassName("recentchatbox");
  // console.log(classlist);
  for (var i = 0; i < classlist.length; i++) {
    body.removeChild(classlist[i] ); // remove all
  }
  for (var i = 0; i < recentdata.data.length; i++) {
    const type = recentdata.data[i].type;
    const id = recentdata.data[i].id;
    const name = recentdata.data[i].name;
    const existsRecentItem = document.getElementById("recentchatboxID" + type + id);
    // console.log("recent exists: ", "recentchatboxID" + type + id, existsRecentItem);
    if(existsRecentItem){
      body.removeChild(existsRecentItem);// .remove();
    }
    // continue;
    const recentchatbox = document.createElement("div");
    recentchatbox.classList.add("recentchatbox");
    recentchatbox.id = "recentchatboxID" + type + id;
    recentchatbox.addEventListener("click",function() {
      // recentchatboxIDgroup1 friend group
      const thisid = this.id;
      if(thisid.indexOf(CHATROOMTYPE.TYPEFRIEND)>0){
        const type = CHATROOMTYPE.TYPEFRIEND;
        const id = thisid.substring(21);
        const nameid = "recentchatboxnameID"+id;
        const label = document.getElementById(nameid);
        addChatbox(type,id, label.innerHTML );
        loadFriendchatbox(id);
        loadFriendConversation(id);
        // console.log("addChatbox(type, id)", type,id ,label, thisid.substring(21));
        return ;
      }

      if(thisid.indexOf(CHATROOMTYPE.TYPEGROUP)>0){
        const type = CHATROOMTYPE.TYPEGROUP;
        const id = thisid.substring(20);
        const nameid = "recentchatboxnameID"+id;
        const label = document.getElementById(nameid);
        addChatbox(type,id, label.innerHTML );
        loadGroupchatbox(id);
        loadGroupConversation(id);
        // console.log("addChatbox(type, id)", type,thisid.substring(24));
        return ;
      }
    });
    recentchatbox.addEventListener("mousemove",function() {
      const thisid = this.id;
      if(thisid.indexOf(CHATROOMTYPE.TYPEFRIEND)>0){
        const type = CHATROOMTYPE.TYPEFRIEND;
        const id = thisid.substring(21);
        const recentchatboxlabel = document.getElementById("recentchatboxlabelID"+type+id);
        recentchatboxlabel.className = "recentchatboxlabel"
        // const closeicon = document.getElementById("closeiconID"+type+id);
        // closeicon.classList.remove("hidecloseicon");
        // console.log("addChatbox(type, id)", type, thisid.substring(25));
        return ;
      }
      if(thisid.indexOf(CHATROOMTYPE.TYPEGROUP)>0){
        const type = CHATROOMTYPE.TYPEGROUP;
        const id = thisid.substring(20);
        const recentchatboxlabel = document.getElementById("recentchatboxlabelID"+type+id);
        recentchatboxlabel.className = "recentchatboxlabel";
        // const closeicon = document.getElementById("closeiconID"+type+id);
        // closeicon.classList.remove("hidecloseicon");
        // console.log("addChatbox(type, id)", type,thisid.substring(24));
        return ;
      }
    });

    recentchatbox.addEventListener("mouseout",function() {
      const thisid = this.id;
      if(thisid.indexOf(CHATROOMTYPE.TYPEFRIEND)>0){
        const type = CHATROOMTYPE.TYPEFRIEND;
        const id = thisid.substring(21);
        const recentchatboxlabel = document.getElementById("recentchatboxlabelID"+type+id);
        recentchatboxlabel.className = "hiderecentchatboxlabel"
        // const closeicon = document.getElementById("closeiconID"+type+id);
        // closeicon.classList.add("hidecloseicon");
        // console.log("addChatbox(type, id)", type, thisid.substring(25));
        return ;
      }
      if(thisid.indexOf(CHATROOMTYPE.TYPEGROUP)>0){
        const type = CHATROOMTYPE.TYPEGROUP;
        const id = thisid.substring(20);
        const recentchatboxlabel = document.getElementById("recentchatboxlabelID"+type+id);
        recentchatboxlabel.className = "hiderecentchatboxlabel";
        // const closeicon = document.getElementById("closeiconID"+type+id);
        // closeicon.classList.add("hidecloseicon");
        // console.log("addChatbox(type, id)", type,thisid.substring(24));
        return ;
      }
    });
    recentchatbox.style.right = (i * 50+3)+"px";
    recentchatbox.style.top = 3+"px";

    const recentchatboxlabel = document.createElement("div");
    recentchatboxlabel.classList.add("hiderecentchatboxlabel");
    recentchatboxlabel.id = "recentchatboxlabelID" + type + id;
    const pointer = document.createElement("div");
    pointer.classList.add("pointer");
    const recentchatboxname = document.createElement("div");
    recentchatboxname.classList.add("recentchatboxname");
    recentchatboxname.id = "recentchatboxnameID"+id;
    recentchatboxname.innerHTML = name;
    const onlinestatus = document.createElement("div");
    onlinestatus.classList.add("onlinestatus");
    onlinestatus.id = "recentonlinestatusID" + type + id;
    var online = false;
    if(ACTIVECHATBOX_LIST.recentchatbox.data[i].type.localeCompare(CHATROOMTYPE.TYPEFRIEND) == 0) {
      const rs = JSON.parse(await getfriendstillonline(id));
      if (rs.length>0) {
        if(rs.length>0)
        online = is_Stillonline(rs[0].lastdatetimelogin);
      }
    }else if(ACTIVECHATBOX_LIST.recentchatbox.data[i].type.localeCompare(CHATROOMTYPE.TYPEGROUP) == 0) {
      // console.log("groupInfomation",ACTIVECHATBOX_LIST.recentchatbox);
      const groupinfo = JSON.parse(await getGroupInfomation(id));
      if(groupinfo)
      groupinfo.some((item_, i) => {
        // console.log(item_.lastdatetimelogin);
        if (item_.userid!= USERDATA.ID)
        if (item_.lastdatetimelogin)
        if(is_Stillonline(item_.lastdatetimelogin)){online = true; return ;}
      });
      // console.log("group: ", online);
    }
    onlinestatus.style.backgroundColor = (online?"#06FF0B":"#cc0000");
    const recentchatboxicon = document.createElement("div");
    recentchatboxicon.classList.add("recentchatboxicon");
    if(type.localeCompare(CHATROOMTYPE.TYPEGROUP) == 0){
      const table = document.createElement("table");
      table.cellSpacing = "1px";
      table.cellPadding = "0";
      const tbody = document.createElement("tbody");
      const tr1 = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const tr2 = document.createElement("tr");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const recentmembericon1 = document.createElement("div");
      recentmembericon1.classList.add("recentmembericon");
      const recentmembericon2 = document.createElement("div");
      recentmembericon2.classList.add("recentmembericon");
      const recentmembericon3 = document.createElement("div");
      recentmembericon3.classList.add("recentmembericon");
      const recentmembericon4 = document.createElement("div");
      recentmembericon4.classList.add("recentmembericon");
      td1.appendChild(recentmembericon1);
      td2.appendChild(recentmembericon2);
      td3.appendChild(recentmembericon3);
      td4.appendChild(recentmembericon4);
      tr1.appendChild(td1);
      tr1.appendChild(td2);
      tr2.appendChild(td3);
      tr2.appendChild(td4);
      tbody.appendChild(tr1);
      tbody.appendChild(tr2);
      table.appendChild(tbody);
      recentchatboxicon.appendChild(table);
    }
    const noticebean = document.createElement("div");
    noticebean.classList.add("noticebean");
    const notice = document.createElement("div");
    notice.classList.add("notice");
    notice.classList.add("hidenotice");
    notice.id = "noticeID" + type + id;
    const noticevalue = document.createElement("div");
    noticevalue.classList.add("noticevalue");
    noticevalue.id = "noticevalueID" + type + id;
    noticevalue.innerHTML = "0";

    const closebean = document.createElement("div");
    closebean.classList.add("closebean");
    const close = document.createElement("div");
    close.classList.add("close");
    const closeicon = document.createElement("div");
    closeicon.id = "closeiconID" + type + id;
    closeicon.classList.add("closeicon");
    closeicon.classList.add("hidecloseicon");
    closeicon.innerHTML = "&times;";
    closeicon.addEventListener('click', () =>{
      // remove here
    });
    close.appendChild(closeicon);
    closebean.appendChild(close);

    notice.appendChild(noticevalue);
    noticebean.appendChild(notice);
    recentchatbox.appendChild(noticebean);
    recentchatbox.appendChild(onlinestatus);
    recentchatbox.appendChild(recentchatboxicon);
    recentchatboxlabel.appendChild(pointer);
    recentchatboxlabel.appendChild(recentchatboxname);
    recentchatbox.appendChild(recentchatboxlabel);
    // recentchatbox.appendChild(closebean);
    body.appendChild(recentchatbox);
  }
}

function groupChat_hightlight(groupID){
  const id = groupID.substring(11);
  if(Groupchat_list)
  Groupchat_list.forEach((item, i) => {
    if(item.groupid == parseInt(id)){
      document.getElementById(groupID).style.backgroundColor = "#daf2ef";
    }else {
      document.getElementById("groupitemID"+item.groupid).style.backgroundColor = "";
    }
  });
}

function friendChat_hightlight(frienditemID){
  const id = frienditemID.substring(12);
  if(Friendchat_list)
  Friendchat_list.forEach((item, i) => {
    if(item.userid == parseInt(id)){
      document.getElementById(frienditemID).style.backgroundColor = "#daf2ef";
    }else {
      document.getElementById("frienditemID"+item.userid).style.backgroundColor = "";
    }
  });
}
