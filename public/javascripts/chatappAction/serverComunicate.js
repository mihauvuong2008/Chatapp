let TOKEN =  {};
let STARTREFRESHCHATTOKEN = false;

function sendaddfriendRequest(friendid, userid){
  console.log("");
}

function findUsername (username){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/findUsername?username="+username, ""));
  });
}

async function getChatrefreshTOKEN(){
  return new Promise(function(resolve, reject) {
    document.cookie.split(";").forEach((item, i) => {
      const n = item.indexOf("chatrefreshtoken");
      if(n>=0){
        resolve(item.split("=")[1]);
      }
    });
    resolve ("");
  });
}

async function getChatTOKEN(){
  return new Promise(function(resolve, reject) {
    document.cookie.split(";").forEach((item, i) => {
      const n = item.indexOf("chattoken");
      if(n>=0){
        resolve(item.split("=")[1]);
      }
    });
    resolve ("");
  });
}

function saveChatTOKEN(token){
  new Promise(function(resolve, reject) {
    if(token){
      if (token.accessToken) {document.cookie = "chattoken="+token.accessToken; console.log("update access token");}
      if (token.refreshToken) {document.cookie = "chatrefreshtoken="+token.refreshToken; console.log("update refresh token");}
    }
    resolve();
  });
}

let checkTokenExpired = (resulttext)=>{
  if(resulttext.indexOf("jwt expired")<0)
  return resulttext;
  return refreshtoken();
}

async function refreshtoken(){
  if(STARTREFRESHCHATTOKEN) return ;
  STARTREFRESHCHATTOKEN = true;
  console.log("TOKEN: ", TOKEN);
  const chatrefreshToken = await getChatrefreshTOKEN();
  const tokenRevice = JSON.parse(await getnewChatTOKEN(chatrefreshToken));
  if (!tokenRevice.accessToken) return;
  if (tokenRevice.accessToken===undefined) return;
  console.log("save: ", tokenRevice.accessToken);
  await saveChatTOKEN({accessToken: tokenRevice.accessToken, "refreshToken": undefined});
  TOKEN = await getChatTOKEN();
  console.log("new TOKEN: ", TOKEN);
  STARTREFRESHCHATTOKEN = false;
}

function getnewChatTOKEN (refreshToken){
  return new Promise(function(resolve, reject) {
    const query = "/refresh_token";
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", query, false );
    xmlHttp.setRequestHeader("x-access-token", refreshToken);
    xmlHttp.send( "" );
    resolve(xmlHttp.responseText);
  });
}


function signout (){
  Get_XMLHttpRequest("/logout")
}

function getFriendConversation (friendid){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/friendchats_messagedata?friendID="+friendid, ""));
  });
}


function  getFriendInfomation(friendid){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest( "/friendchats_info?friendID="+friendid, ""));
  });
}

async function getfriendstillonline(userid){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest( "/friendstillonline?userid="+userid, ""));
  });
}

async function istillonline(){
  return Get_XMLHttpRequest( "/istillonline", "");
}


async function setitem_readedMessage_Friend(item, datetime_read){
  const formdata = new FormData();
  formdata.append( 'readerid', "token" );
  formdata.append( 'unhide_usermindid', item.unhide_usermindid );
  formdata.append( 'datetime_read', datetime_read);
  const res = await Post_XMLHttpRequest( '/postitemReadedmessageFriend', formdata);
  if (res.default) {
    item.success = true;
    item.resID = res.default.insertId;
    item.datetime_read = datetime_read;
  }else {
    item.success = false;
  }
}


async function setitem_readedMessage_Group(item, datetime_read){
  const formdata = new FormData();
  formdata.append( 'readerid', "token" );
  formdata.append( 'unhide_usermindid', item.unhide_usermindid );
  formdata.append( 'datetime_read', datetime_read);
  const res = await Post_XMLHttpRequest( '/postitemReadedmessageGroup', formdata);
  if (res.default) {
    item.success = true;
    item.resID = res.default.insertId;
    item.datetime_read = datetime_read;
  }else {
    item.success = false;
  }
}


async function getFriendNotify(){
  return Get_XMLHttpRequest( "/friendnotify", "");
}


async function getGroupNotify(){
  return Get_XMLHttpRequest("groupnotify", "");
}


function getGroupUnreadmessage(groupID){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/groupchats_unreadmessage?groupID="+groupID, ""));
  });
}


function getFriendUnreadmessage(friendID){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/friendchats_unreadmessage?friendID="+friendID, ""));
  });
}


async function sendMessagetoGroup(groupid, item){
  const formdata = new FormData();
  formdata.append( 'groupid',  groupid );
  formdata.append( 'message',item.message );
  formdata.append( 'datetime_send',item.datetimesend);
  const res = await Post_XMLHttpRequest('/postmessagetogroup', formdata);// postMessagetoGroup(data , token);
  if (res.default) {
    item.success = true;
    item.resID = res.default.insertId;
  }else {
    item.success = false;
  }
}

async function sendMessagetoFriend(chatboxStack_data_item_id, item){
  const formdata = new FormData();
  formdata.append( 'friendid', chatboxStack_data_item_id );
  formdata.append( 'message', item.message );
  formdata.append( 'datetime_send', item.datetimesend );
  const res = await Post_XMLHttpRequest('/postmessagetofriend', formdata);
  if (res.default) {
    item.success = true;
  }else {
    item.success = false;
  }
}


function getFriendlist(){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/friendLists", ""));
  });;
}

function getGrouplist(){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/groupLists", ""));
  });;
}

function getGroupConversation(groupID){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/groupchats_messagedata?groupID="+groupID, ""));
  });
}

function getGroupInfomation(groupID){
  return new Promise(function(resolve, reject) {
    resolve(Get_XMLHttpRequest("/groupchats_info?groupID="+groupID, ""));
  });;
}


function getCurrentUsersession(){
  return Get_XMLHttpRequest("/getuserSession", "");
}

function Get_XMLHttpRequest(path, sendData){
  const xmlHttp = new XMLHttpRequest();
  // myRequest.headers.get('Content-Type')
  xmlHttp.open( "GET", path, false ); // false for synchronous request
  xmlHttp.setRequestHeader("x-access-token", TOKEN);
  xmlHttp.send(sendData);
  return xmlHttp.responseText;
}


function Post_XMLHttpRequest(path, formdata){

  return new Promise(( resolve, reject ) => {
    const xhr = this.xhr = new XMLHttpRequest();
    xhr.open( 'POST', path, true );
    xhr.responseType = 'json';
    const loader = this.loader;
    const genericErrorText = "Couldn't upload data";
    // add listeners
    xhr.addEventListener( 'error', () => reject( genericErrorText ) );
    xhr.addEventListener( 'abort', () => reject() );
    xhr.addEventListener( 'load', () => {
      const response = xhr.response;
      if ( !response || response.error ) {
        return reject( response && response.error ? response.error.message : genericErrorText );
      }

      resolve( {
        default: response
      } );
      //  alert("upload: "+ response.status);
    } );

    // if ( xhr.upload ) {
    //   xhr.upload.addEventListener( 'progress', evt => {
    //     if ( evt.lengthComputable ) {
    //       var percentComplete = (evt.loaded / evt.total) * 100;
    //     }
    //     // console.log("evt percent: ", percentComplete);
    //   });
    // }
    // Send the request.
    this.xhr.setRequestHeader("x-access-token", TOKEN);
    this.xhr.send( formdata );
  });
}

// Aborts the upload process.
function abort() {
  if ( this.xhr ) {
    this.xhr.abort();
  }
}
