<script setup>

import 'leaflet/dist/leaflet.js'
import '../plugins/AnimatedMarker';
import { onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import logo from '../assets/bus.png'
import electric from '../assets/elec.png'
// import 'leaflet/dist/leaflet.css'
const map = ref(null);

let interval = null;

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
const buses = ref([]);

const emits = defineEmits(["bus-details"]);

const updateBuses = async () => {

    let newBuses = await fetch(`${import.meta.env.VITE_APP_API_URL}/bus/now`).then(r => r.json())
    // TODO animate
    // for (let bus in this.newBuses){
    //     // remove all old markers
    //     bus.remove();
    // }
    for (let bus of newBuses) {
        // add new ones
        // if (bus.)
        if (buses.value[bus.bus]) {
            let prev = buses.value[bus.bus];
            let line = L.polyline([prev.getLatLng(), [bus.lat, bus.long]])
            prev.remove();
            let newMarker = L.animatedMarker(line.getLatLngs(), {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(map.value)
            newMarker.on("click", () => emits("bus-details", bus));
            buses.value[bus.bus] = newMarker;
        } else {
            let marker = L.marker([bus.lat, bus.long], {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(map.value)
            marker.on("click", () => emits("bus-details", bus))
            buses.value[bus.bus] = marker;
        }
    }
}

const createMap = () => {
    map.value = L.map('test', {
        center: [53.5150, -113.4757],
        zoom: 12
    });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}/?{accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'access_token=pk.eyJ1IjoibWF0dHNjaGxvc3NlciIsImEiOiJja21lM291b2kwbTZsMm5wMmttYzE4endnIn0.oOhD7Wo84XPpI2GAra3wHw'
    }).addTo(map.value)
}

const setUpInterval = () => {
    interval = setInterval(() => updateBuses(), 1000 * 60);
}

onMounted(() => {
    createMap();
    updateBuses();
    setUpInterval()
})

onBeforeUnmount(() => {
    clearInterval(interval)
})
</script>
<template>
  <div>
    <div id="test" class="map" />
  </div>
</template>
<style scoped>
.map {
    width: 100vw;
    height: 50vh;
}
</style>