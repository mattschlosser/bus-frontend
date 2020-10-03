<template>
  <div>
    <div class="center">
      <input type="date" v-model="date" />
      <input type="time" v-model="time" />
      <label>
        <input type="checkbox" v-model="electric" />Electric Buses Only
      </label>
      <v-btn @click="now()">Now</v-btn>
    </div>
  </div>
</template>
<script>
import configs from "../configs";
export default {
  props: {
    for: String,
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