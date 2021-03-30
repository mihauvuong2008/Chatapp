let MOUSESTATE = {LEFTMOUSEBUTTONONLYDOWN: false, PRESSANDMOVE: false};


function setLeftButtonState_onmousemove(e) {
  MOUSESTATE.LEFTMOUSEBUTTONONLYDOWN = e.buttons === undefined
  ? e.which === 1
  : e.buttons === 1;
  MOUSESTATE.PRESSANDMOVE = true;
}

function setLeftButtonState_onmousedown(e) {
  MOUSESTATE.LEFTMOUSEBUTTONONLYDOWN = e.buttons === undefined
  ? e.which === 1
  : e.buttons === 1;
  MOUSESTATE.PRESSANDMOVE = false;
}

function setLeftButtonState_onmouseup(e) {
  MOUSESTATE.LEFTMOUSEBUTTONONLYDOWN = e.buttons === undefined
  ? e.which === 1
  : e.buttons === 1;
  move = false;
}


const boxsize=50;
const boxcenter = boxsize/2;
var move = false;
var moving = false;
var posX = 0, posY = 0;

document.addEventListener('mousemove', async function(e) {
  if (MOUSESTATE.LEFTMOUSEBUTTONONLYDOWN) {
    const x = e.clientX, y = e.clientY,
    elementMouseIsOver = document.elementFromPoint(x, y);
    if (elementMouseIsOver)
    if(elementMouseIsOver.id.localeCompare('pupleID')==0){// catch puplebox
      move = true;
    }
    if(move){
      posX = x-boxcenter, posY = y-boxcenter;
      if(x-boxcenter<0){ // duong vien cua viewport...
        posX = 0 ;
      }else if(x+boxcenter>document.documentElement.clientWidth){
        posX = (document.documentElement.clientWidth-boxsize);
      }
      if(y-boxcenter <0){
        posY = 0 ;
      } else if(y +boxcenter>document.documentElement.clientHeight){
        posY = (document.documentElement.clientHeight-boxsize) ;
      }

      if(!moving){
        moveTo();
      }
      else {
        while (moving) {
          await sleep(100);
        }
      }
    }
  }
});

async function moveTo() {
  const box = document.getElementById("pupleboxID");
  const currX = box.getBoundingClientRect().x;
  const currY = box.getBoundingClientRect().y;
  const Dx =  posX - currX;
  const Dy =  posY - currY;
  const basicHandSpeed = 3;
  var Dx_ = 0, Dy_= 0;
  const stepx = Dx /basicHandSpeed, stepy = Dy /basicHandSpeed;
  for (var i = 0; i < basicHandSpeed; i++) {
    moving = true;
    Dx_ += stepx;
    Dy_ += stepy;
    box.style.left = (currX+Dx_)+"px";
    box.style.top = (currY+Dy_)+"px";
    await sleep(5);
  }
  moving = false;
}

// script mouse layout
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
