<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-title>
        Edmonton Bus Data
      </v-app-bar-title>
    </v-app-bar>
    <v-main app>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
};
</script>