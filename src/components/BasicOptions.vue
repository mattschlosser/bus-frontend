<template>
    <div class="mt-3">
      Update Interval (ms): <input v-model="speed" @change="reset"/>
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
  methods: {
    reset() {
      this.$emit('update:speed', this.speed)
    }
  }
}
</script>