const notifier = require('node-notifier');
const player = require('play-sound')(opts={});
const fs = require('fs');

const wait = (ms) => new Promise((resolve)=> setTimeout(resolve,ms));
const formatTime = (time)=> Math.floor(time/60) + ':' + time%60

const conf = JSON.parse( fs.readFileSync('conf.json') );

class Clock {
  constructor(duration= conf.duration){
    this.duration = duration * 60 *1000
      this.pulse_period = conf.period
      this.startTime =0
      this.currentTime= this.startTime
      this.endTime =0

      this.RESET = true
      this.PAUSE = false

  }

  start(){
    if (this.PAUSE){
      this.PAUSE = false
    }
    else if (this.RESET){
      this.startTime = Date.now()
        this.endTime = this.startTime + this.duration - 50
        this.RESET = false
        this.run()
    }
    else{
      this.PAUSE = true
    }

  }
  async run(){
    for(this.currentTime = this.startTime;this.currentTime<this.endTime;await this.tick());
    !this.RESET && this.complete();
    this.reset()
  }
  async tick(){
    await wait(this.pulse_period);
    !this.PAUSE && (this.currentTime = this.currentTime+ this.pulse_period)
  }
  complete(){
    player.play(conf.notification_sound,(err)=>{ if (err) throw err});
    notifier.notify( conf.notification_msg)
  }
  reset(){
    this.currentTime =this.endTime;
    this.RESET = true
    this.PAUSE = false
  }
  get time(){
    return formatTime( Math.max( Math.floor( (this.endTime - this.currentTime )/1000 ), 0) );
  }
  get state() {
    if (this.RESET){
      return 'reset'
    }
    if (this.PAUSE){
      return 'paused'
    }
    return 'running'
  }
  set dur(duration){
    this.reset()
    this.duration = duration
  }
}


module.exports = {
  'Clock': Clock
}

