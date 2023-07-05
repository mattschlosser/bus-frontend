<template>
  <div>
    <div id="test" class="map" />
    <v-btn @click="deets">
      Click me To get dets
    </v-btn>
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.js'
import logo from '../assets/logo.png'
import electric from '../assets/elec.png'
import '../plugins/AnimatedMarker';
// import 'leaflet/dist/leaflet.css'

const LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [25, 25],
    }
})
const icon = new LeafIcon({
    iconUrl: logo
});
const elec = new LeafIcon({
    iconUrl: electric
})
export default {
    data() {
        return {
            map: null,
            interval: null,
            buses: {}
        }
    },
    mounted() {
        this.map = L.map('test', {
            center: [53.5150, -113.4757],
            zoom: 12
        })
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}/?{accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'access_token=pk.eyJ1IjoibWF0dHNjaGxvc3NlciIsImEiOiJja21lM291b2kwbTZsMm5wMmttYzE4endnIn0.oOhD7Wo84XPpI2GAra3wHw'
        }).addTo(this.map)
        this.updateBuses();
        this.setupInterval();
    },
    beforeUnmount() {
        clearInterval(this.interval)
    },
    methods: {
        deets() {
            console.log(this.map.getCenter(), this.map.getZoom())
        },
        async updateBuses() {
            let buses = await fetch(`${import.meta.env.VITE_APP_API_URL}/bus/now`).then(r => r.json())
            // TODO animate
            // for (let bus in this.buses){
            //     // remove all old markers
            //     bus.remove();
            // }
            for (let bus of buses) {
                // add new ones
                // if (bus.)
                if (this.buses[bus.bus]) {
                    let prev = this.buses[bus.bus];
                    let line = L.polyline([prev.getLatLng(), [bus.lat, bus.long]])
                    prev.remove();
                    this.buses[bus.bus] = L.animatedMarker(line.getLatLngs(), {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(this.map)
                } else {
                    let marker = L.marker([bus.lat, bus.long], {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(this.map)
                    this.buses[bus.bus] = marker;
                }
            }
        },
        async setupInterval() {
            this.interval = setInterval( () => {
                this.updateBuses();
            }, 1000 * 60);
        }
    }
}
</script>
<style scoped>
.map {
    width: 100vw;
    height: 80vh;
}
</style>