<template>
  <div id="foods-container">
    <div class="title">ALL FOOD</div>

    <div class="foodFlexbox" v-if="foods.length">
      <food class="food" v-for="food in foods" :key="food.id">
        <p>Name: {{food.name}}</p>
        <p>Description: {{food.description}}</p>
        <p>Given: {{food.date}} at {{food.time}}</p>
        <div class="foodPic" v-bind:style="{ backgroundImage: 'url(' + food.FB_IMG_URL + ')' }"></div>
        <!-- <p class="deleteButton" @click="deleteFood(food)">TAKE</p> -->

        <!-- <a class="deleteButton" v-bind:href="'food/' + food._id + '/delete?FBID=' + food.FB_ID">TAKE</a> -->
      </food>
    </div>
    <!-- <template>
      <div class="list-container">
        <ul v-if="items.length">
          <li v-for="item in items" :key="item.id">
            {{ item.name }}
          </li>
        </ul>
        <p v-else>No items found.</p>
      </div>
    </template> -->

  </div>
</template>

<script>
  // eslint-disable-next-line
  var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)

  export default {
    name: 'foods-container',
    data () {
      return {
        foods: []
      }
    },
    methods: {
      scrollToBottom () {
        this.$nextTick(function () {
          var chat = this.$el.querySelector('#foods')
          chat.scrollTop = chat.scrollHeight
        })
      }
    },
    mounted () {
      console.log('mounted')
      // console.log(foods)

      socket.on('initialize', (foods) => {
        console.log('recieved socket initialize from server')
        this.foods = foods
        // chatApp.scrollToBottom()
      })

      socket.on('addedFood', (food) => {
        // chatApp.scrollToBottom()
        this.foods.push(food)
        console.log('worked')
        console.log('added food', food)
      })
    }
  }
</script>

<style scoped>

  .customFileButton {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background: red;
  }

  .customFileButton > img {
    width: 100%;
  }

  #file-upload {
    display: none;
  }

  .foodFlexbox {
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 4em 0;
  }

  .food {
    flex-basis: 330px;

    display: flex;
    flex-direction: column;
    /*background: #fff;*/
    /*border-radius: 10px;*/
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 20px;
  }

  .foodPic {
    height: 300px;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
  }

  .title {
    text-align: left;
    position: absolute;
    left: 1.5em;
    font-size: 2em;
    font-weight: bold;
    text-decoration: none;
  }


</style>
