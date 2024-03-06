import { ref } from "vue";

import logo from '../assets/logo.png'
import electric from '../assets/elec.png'

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
export function useBuses() {
    const buses = ref([]);

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
                buses.value[bus.bus] = L.animatedMarker(line.getLatLngs(), {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(this.map)
            } else {
                let marker = L.marker([bus.lat, bus.long], {title: bus.bus, icon: bus.bus >= 8000 ? elec : icon}).addTo(this.map)
                buses.value[bus.bus] = marker;
            }
        }
    }
    return {
        buses,
        updateBuses
    }
}