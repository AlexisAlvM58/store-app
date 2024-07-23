<template>
  <v-app>
    <v-app-bar
      app
      color="Green"
      dark
    >
      <div class="d-flex align-center">
       <h3>
         STORE-APP
       </h3>
      </div>
      <v-spacer></v-spacer>
      Alexis Alvarado
    </v-app-bar>

    <v-main>
      <StoreApp/>
    </v-main>
  </v-app>
</template>

<script>
import StoreApp from './components/StoreApp';

export default {
  name: 'App',

  components: {
    StoreApp,
  },

  data: () => ({
    //
  }),
};
</script>
