<template>
  <v-container>
    <div class="content">
      <div class="header">
        <h1>Edmonton Bus Data Visualizer</h1>
        <b>
          Interested in finding an electric bus? Visit the
          <router-link to="/electric">Electric Bus Finder</router-link>
        </b>
        <br />
        <br />This is a simple interface to show Edmonton bus data.
        See
        <a
          href="https://github.com/mattschlosser/bus"
        >https://github.com/mattschlosser/bus</a> for more info
        <br />
        <basic-options :speed="speed" @update:speed="speed = $event" />
        <br />
      </div>
      <div id="canvas-container" class="bus">
        <template v-for="canvas in ['canvas1', 'canvas2']">
          <div style="display: inline-block" :key="canvas">
            <bus-map :buses="buses[canvas]" :name="canvas" />
            <br />
            <interface-controls :for="canvas"></interface-controls>
          </div>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script>
import configs from "../configs";
import InterfaceControls from "./InterfaceControls";
import BasicOptions from "./BasicOptions";
import BusMap from "./BusMap";
export default {
  components: {
    InterfaceControls,
    BusMap,
    BasicOptions,
  },
  data: () => ({
    speed: 500,
    map: null,
    start: 0,
    interval: null,
    timeout: null,
    buses: {
      canvas1: [],
      canvas2: [],
    },
  }),
  computed: {
    visibleBuses() {
      return [];
    },
  },
  watch: {
    speed: {
      handler(val) {
        clearInterval(this.i);
        this.i = setInterval(this.updater, val);
      },
      immediate: true,
    },
  },
  destroyed() {
    clearInterval(this.i);
  },
  methods: {
    updater() {
      Object.keys(configs).forEach((key) => {
        let time = `${configs[key].time.substr(
          0,
          3
        )}${this.start.toLocaleString("en", { minimumIntegerDigits: 2 })}`;
        fetch(`/bus/${configs[key].date}/${time}/4`, { method: "get" })
          .then((res) => res.json())
          .then((rows) =>
            rows.filter((e) => (configs[key].electric ? e.bus >= 8000 : true))
          )
          .then((buses) => (this.buses[key] = buses));
      });
      this.start = ++this.start % 60;
    },
  },
};
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