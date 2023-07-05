<template>
  <div class="mt-3">
    Update Interval (ms): <input :value="speed" @change="reset">
  </div>
</template>
<script>
export default {
  props: {
    speed: {
      type: Number,
      default: 500
    }
  },
  emits: ["update:speed"],
  methods: {
    reset($event) {
      this.$emit('update:speed', Number($event.target.value))
    }
  }
}
</script>