<template>
  <v-container>
    <div class='content'>
      <div class='header'>
        <img style="display:none;" id="map" src="/map"/>
        <h1>Edmonton Bus Data Visualizer</h1>
        <b>
        Interested in finding an electric bus? Visit the 
        <router-link to="/electric">Electric Bus Finder</router-link></b><br/><br/>
        This is a simple interface to show Edmonton bus data. 
        See <a href="https://github.com/mattschlosser/bus">https://github.com/mattschlosser/bus</a> for more info<br/>
        <basic-options :speed="speed" @update:speed="updateSpeed"/>
        <br/>
      </div>
      <div id="canvas-container" class='bus'>
        <div style="display: inline-block">
          <canvas id="canvas1" width="640" height="640"></canvas><br/>
          <interface-controls for="canvas1"></interface-controls>
        </div>
        <div style="display: inline-block">
          <canvas id="canvas2" width="640" height="640"></canvas><br/>
          <interface-controls for="canvas2"></interface-controls>
        </div>
      </div>  
    </div>
  </v-container>
</template>

<script>
import configs from '../configs';
import InterfaceControls from "./InterfaceControls";
import BasicOptions from "./BasicOptions";
  export default {
    components: {
      InterfaceControls,
      BasicOptions
    },
    data: () => ({
      speed: 500, 
      map: null,
      start: 0,
      interval: null,
      timeout: null
    }),
    mounted() {
      document.getElementById('map').onload = () => {
        this.map = document.getElementById("map");  
        this.setup();
      }
      let {adjustCanvas,timeout} = this;
      ['canvas1', 'canvas2'].forEach(adjustCanvas);
      window.onresize = () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => ['canvas1', 'canvas2'].forEach(adjustCanvas), 16) // 60 fps = 16 ms per frame
      }
    },
    destroyed() {
      clearTimeout(this.timeout);
      clearInterval(this.i);
    },
    methods: {
      updateSpeed(event) {
        // event
        clearInterval(this.i);
        this.speed = event
        this.i = setInterval(this.updater, event)
      },
      adjustCanvas(name) {
        let canvas = document.getElementById(name)
        let container = document.getElementById('app');
        let maxWidth = container.clientWidth - 30;
        if (canvas.width > maxWidth) {
            let ratio = maxWidth/canvas.width;
            canvas.width = maxWidth
            canvas.height = canvas.height*ratio;
        } else {
            let ratio = Math.min(maxWidth, 640)/canvas.width;
            canvas.width =  canvas.width*ratio;
            canvas.height = canvas.height*ratio;
        }
      },
      setup() {
        let {i, updater, speed} = this;
        clearInterval(i);
        this.i = setInterval(updater, speed)
      }, 
      draw(name, rows) {
        let {map} = this;
        let q = document.getElementById(name)
        let c = q.getContext('2d')
        map && c.drawImage(map, 0, 0, q.width, q.height)
        c.fillStyle ="#ffffffaa"
        c.fillRect(0,0,q.width, q.height);
        c.fillStyle = "#000000ff";
        c.fillText(new Date(rows[0].timestamp*1000).toLocaleString(), 0, q.height-20);
        let minY =  53.42103958129883, maxY = 53.69961929321289, maxX = -113.23108673095705, minX  = -113.68351745605467;
        c.fillStyle = "#000000ff";
        let drawDot = e => {
            let x = (e.long-minX)/(maxX-minX)*q.width;
            let y = (maxY-e.lat)/(maxY-minY)*q.height;
            c.fillRect(x-2,y-2,5,5);
        }
        rows.forEach(drawDot)
      },
      updater() {
        let {draw} = this;
        Object.keys(configs).forEach(key => {
          let time = `${configs[key].time.substr(0, 3)}${this.start.toLocaleString('en', {minimumIntegerDigits: 2})}`
          fetch(`/bus/${configs[key].date}/${time}/4`, {method: 'get'})
            .then(res => res.json())
            // not verified - but I think the new ETS electric fleet is numbered 8000+
            .then(rows => rows.filter(e => configs[key].electric ? e.bus >= 8000 : true))
            .then(e => draw(key, e))
        });
        this.start++;
        this.start = this.start % 60;
      }
    }
  }
</script>

<style scoped>
    .center {
        margin: 0 auto;
        display: inline-block;
        width: fit-content;
    }
    .content {
        margin: 0 auto;
    }
    .header {
        text-align: center;
    }
    .bus {
        box-sizing: border-box;
        width: 100%;
        padding: 15px;
        margin: 0 auto;
        text-align: center;
    }
    .mt-3 {
        margin-top: 30px;
    }
    @media only screen and (min-width: 914px) {
        .bus {
            width: 70%;
        }
    }
</style>