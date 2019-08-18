const express = require('express');
const app = express();
const {Clock} = require('./thakkali-core');
const cors = require('cors')
const debug = require('debug')('index');

app.use(cors())

var duration = 25
var clock = new Clock(duration)
const start_timer = (req,res)=>{
    clock.start()
    let state = clock.state
    res.send(state);
}
app.get('/start',start_timer)

const reset_timer = (req,res)=>{
    clock.reset()
    res.send(clock.state);
}
app.get('/reset', reset_timer)

const get_time = (req,res)=>{
  debug('getting time', clock.time)
  res.send(clock.time)
}
app.get('/time',get_time);

const get_clock_state = (req,res)=>{
  res.send(clock.state)
}
app.get('/state', get_clock_state);

app.listen(5051);
