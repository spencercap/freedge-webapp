<template>
  <div id="app">
    <div class="name">FREEdge</div>
    <div class="bio">NYU's Smart Community Sharing Fridge</div>
    <div class="actionContainer">
      <a href="#give" v-on:click="addingFood = !addingFood"><div class="actionButton giveButton">GIVE</div></a>
      <a href="#receive" v-smooth-scroll="{ duration: 1250 }"><div class="actionButton receiveButton">RECEIVE</div></a>
    </div>
    <a href="#receive" v-smooth-scroll="{ duration: 1250 }"><div class="arrow">&darr;</div></a>
    <div class="add-food-container" v-on:click="addingFood = !addingFood" v-bind:class="{ addingFood: addingFood }">
      <add-food></add-food>
    </div>
    <!-- make the above siblings to avoid click error w datepicker and background propogration --> 
    <foods-container id="receive"></foods-container>

  </div>
</template>

<script>
import AddFood from './components/add-food.vue'
import FoodsContainer from './components/foods-container.vue'
export default {
  name: 'app',
  components: {
    'add-food': AddFood,
    'foods-container': FoodsContainer
  },
  data () {
    return {
      addingFood: true
    }
  }
}
</script>

<style>

  html, body, .smooth-container {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  body {
    font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    color: #6d6d6d;
  }

  a {
    text-decoration: none;
    -webkit-user-select: none;
    user-select: none;
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  #app {
    text-align: center;
    margin-top: 60px;
  }

  .add-food-container {
    display: none;
  }

  .addingFood {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
  }

  .actionContainer {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }

  .actionButton {
    width: 80%;
    margin: 0.3em auto;
    text-align: center;
    font-weight: bold;
    color: #fff;
    font-size: 6rem;
    padding: 1.5rem;
    border-radius: 0.05rem;
    text-shadow: 0px 0px 6rem #888;
    border-radius: 10px;
    cursor: pointer;
    transition-duration: 250ms;
  }

  .actionButton:hover {
    opacity: 0.8;
  }

  .giveButton {
    background: #78FFFA;
  }

  .receiveButton {
    background: #AE78FF;
  }

  #receive {
    position: absolute;
    top: 100vh;
    height: 100vh;
  }

  .arrow {
    position: absolute;
    bottom: 20px;
    text-align: center;
    width: 100%;
    font-size: 15vh;
    color: #bbb;
    cursor: pointer;
    transition-duration: 750ms;
    animation: float 2s ease-in-out 0s infinite normal;
  }

  .hiddenArrow {
    transform: rotateZ(540deg) scale(0);
    opacity: 0;
    visibility: hidden;
  }

  @keyframes float {
    0% {
      bottom: 20px;
    }
    65% {
      bottom: 50px;
    }
    100% {
      bottom: 20px;
    }
  }

  .name {
    font-size: 3em;
    font-weight: bold;
  }


</style>
