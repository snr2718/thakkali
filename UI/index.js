const startBtn = document.querySelector('#startBtn')
const resetBtn = document.querySelector('#resetBtn')
const timeDisplay = document.querySelector("#timeDisplay")
const port = 5051
const url = 'http://localhost:'+port+'/'

const route_to = (route)=>url+route;
(async()=>{
var currentState = 'reset';
var intervalID = null;
await init();
startBtn.addEventListener("click", startBtnHandle);
resetBtn.addEventListener("click", resetBtnHandle);
})()

async function startBtnHandle(){
  let res = await fetch(route_to('start'))
  let state = await res.text()
  if (state == 'running'){
    await startPollingTime()
  }
  if (state == 'paused' || state == 'reset'){
    await stopPollingTime()
  }
  set_button_state(state);
}

async function resetBtnHandle (){
  let res = await fetch( route_to('reset') )
  let state = await res.text()
  if (state == 'reset'){
    await stopPollingTime()
    set_button_state(state);
    timeDisplay.innerText = await getTime();
  }
}

async function init(){
  let state = await getState();
  if (state == 'running'){
    await startPollingTime()
    set_button_state(state);
  }
  timeDisplay.innerText = await getTime();
}

async function startPollingTime(){
  intervalID = setInterval(await fetchTime, 300)
}

async function fetchTime(){
  timeDisplay.innerText = await getTime();
  if (timeDisplay.innerText == '0:0'){
    await stopPollingTime();
    while(await getState() != 'reset');
    set_button_state(await getState());
  }
}

async function stopPollingTime(){
  clearInterval(intervalID);
}

async function getState(){
  let res = await fetch(route_to('state'));
  let state = await res.text()
  return state
}

function set_button_state(state){
  console.log('state', state)
  if (state == 'running'){
    startBtn.innerText = '||'
  }
  else {
    startBtn.innerText = '>'
  }
};

const getTime = async()=> await( await fetch(route_to('time')) ).text();


