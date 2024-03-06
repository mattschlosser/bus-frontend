<script setup>
import { VBottomSheet } from 'vuetify/lib/labs/components.mjs';
import NewBusMap from '../components/NewBusMap.vue';
import { ref } from 'vue';
import { VCard, VCardSubtitle, VCardText, VCardTitle } from 'vuetify/lib/components/index.mjs';

const showBottomSheet = ref(false);
/** @type {{bus: number, id: number, heading: number, speed: number}} */
const bus = ref(null);

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
        Bus
      </VCardSubtitle>
      <VCardText>
        On Time<br>
        <b>{{ Math.round(bus.speed * 3.6) }}</b> km/h
      </VCardText>
    </VCard>
  </VBottomSheet>
</template>