<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- <router-view></router-view> -->
    <!-- ADD FOOD CONTAINER MODULE -->
    <add-food></add-food>
  </div>
</template>

<script>
import AddFood from './components/add-food.vue'
// import FoodContainer from './components/food-container.vue'

export default {
  name: 'app',
  components: {
    'add-food': AddFood
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
