<template>
  <v-app>
    <v-app-bar app> 
      Edmonton Bus Data
    </v-app-bar>
    <v-main app>
      <router-view/>
      <!-- <HelloWorld/> -->
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    // HelloWorld,
  },
};
</script>