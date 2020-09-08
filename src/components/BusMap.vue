<template>
  <div>
    <canvas :id="name" width="640" height="640"></canvas>
  </div>
</template>
<script>
import map from '../assets/map.png'
export default {
  props: {
    name: String,
    buses: Array,
  },
  data() {
    return {
      map,
      timeout: null,
    };
  },
  watch: {
    buses() {
      this.draw();
    },
  },
  mounted() {
    this.adjustCanvas();

    let { timeout } = this;
    window.onresize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(this.adjustCanvas, 16); // 60 fps = 16 ms per frame
    };
  },
  destroyed() {
    clearTimeout(this.timeout);
  },
  methods: {
    adjustCanvas() {
      let canvas = document.getElementById(this.name);
      let container = document.getElementById("app");
      let maxWidth = container.clientWidth - 30;
      if (canvas.width > maxWidth) {
        let ratio = maxWidth / canvas.width;
        canvas.width = maxWidth;
        canvas.height = canvas.height * ratio;
      } else {
        let ratio = Math.min(maxWidth, 640) / canvas.width;
        canvas.width = canvas.width * ratio;
        canvas.height = canvas.height * ratio;
      }
    },
    draw() {
      let { buses: rows } = this;
      let q = document.getElementById(this.name);
      let c = q.getContext("2d");


      let map = document.createElement('img')
      map.src = this.map
      map && c.drawImage(map, 0, 0, q.width, q.height);
      

      c.fillStyle = "#ffffffaa";
      c.fillRect(0, 0, q.width, q.height);
      c.fillStyle = "#000000ff";
      c.fillText(
        new Date(rows[0].timestamp * 1000).toLocaleString(),
        0,
        q.height - 20
      );
      let minY = 53.42103958129883,
        maxY = 53.69961929321289,
        maxX = -113.23108673095705,
        minX = -113.68351745605467;
      c.fillStyle = "#000000ff";
      let drawDot = (e) => {
        let x = ((e.long - minX) / (maxX - minX)) * q.width;
        let y = ((maxY - e.lat) / (maxY - minY)) * q.height;
        c.fillRect(x - 2, y - 2, 5, 5);
      };
      rows.forEach(drawDot);
    },
  },
};
</script>