<script setup>
import 'leaflet/dist/leaflet';
import 'leaflet';
import '../plugins/AnimatedMarker';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import logo from '../assets/bus.png'
import electric from '../assets/elec.png'
import { useQuery } from '@tanstack/vue-query';
import { getTrip } from '../api';
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
const selectedBus = ref(null);

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
            newMarker.on("click", () => handleBusClick(bus));
            buses.value[bus.bus] = newMarker;
        } else {
            let marker = L.marker([bus.lat, bus.long], {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(map.value)
            marker.on("click", () => handleBusClick(bus))
            buses.value[bus.bus] = marker;
        }
    }
}

const { data: trip } = useQuery({
    queryKey: ['bus', selectedBus],
    queryFn: () => selectedBus.value ?  getTrip(selectedBus.value.trip) : null
});



const handleBusClick = (bus) => {
    emits("bus-details", bus);
    selectedBus.value = bus;
}

/** @type {import('leaflet').Polyline | null} */
let previousPolyline = null;

watch(trip, () => {
    if (!trip) {
        return;
    }
    previousPolyline?.remove();
    previousPolyline = L.polyline(trip.value.geometry_line.coordinates.map(e => e.map(([a, b]) => [b, a]))).addTo(map.value);
    map.value.fitBounds(previousPolyline.getBounds());
})

const createMap = () => {
    map.value = L.map('test', {
        center: [53.5150, -113.4757],
        zoom: 12,
    });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}/?{accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: `access_token=${import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN}`
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