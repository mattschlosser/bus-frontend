<script setup>
import NewBusMap from '../components/NewBusMap.vue';
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getTrip } from '../api';

const showBottomSheet = ref(false);
/** @type {{bus: number, id: number, heading: number, speed: number}} */
const bus = ref(null);

const { data: trip } = useQuery({
  queryKey: ['buses', bus],
  queryFn: () => bus.value ? getTrip(bus.value.trip) : []
})

const viewBusDetails = (clickedBus) => {
    bus.value = clickedBus;
    showBottomSheet.value = true;
}
</script>
<template>
  <NewBusMap @bus-details="viewBusDetails($event)" />
  <VBottomSheet v-model="showBottomSheet">
    <VCard width="360" class="mx-auto rounded-t-lg">
      <VCardTitle>
        {{ bus.bus }}
      </VCardTitle>
      <VCardSubtitle>
        {{ trip?.trip_headsign }}
      </VCardSubtitle>
      <VCardText>
        On Time<br>
        <b>{{ Math.round(bus.speed * 3.6) }}</b> km/h
      </VCardText>
    </VCard>
  </VBottomSheet>
</template>