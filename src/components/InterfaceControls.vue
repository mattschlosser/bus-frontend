<template>
  <div>
    <div class="center">
      <input v-model="date" type="date">
      <input v-model="time" type="time">
      <label>
        <input v-model="electric" type="checkbox">
        Electric Buses Only
      </label>
      <v-btn @click="now()">
        Now
      </v-btn>
    </div>
  </div>
</template>
<script>
import configs from "../configs";
export default {
  props: {
    for: {
      type: String,
      required: true
    }
  },
  data() {
    return configs[this.for];
  },
  methods: {
    now() {
      let date = new Date();
      this.date = new Date().toLocaleDateString();
      this.time = `${date.getHours()}:${date.getMinutes()}`;
    },
  },
};
</script>