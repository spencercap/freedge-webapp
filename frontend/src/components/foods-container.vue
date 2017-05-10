<template>
  <div id="foods-container">
    <p class="title" v-if="foods.length">ALL FOOD</p>
    <div class="foodFlexbox" v-if="foods.length">
      <food v-for="food in foods"
            class="food"
            :name="food.name"
            :description="food.description"
            :date="food.date"
            :time="food.time"
            :fb-post-id="food.FB_POST_ID"
            :fb-img-url="food.FB_IMG_URL"
            :mongo-id="food._id">
      </food>
    </div>
    <p v-else>No items currently in the FREEdge.</p>

  </div>
</template>

<script>
  // eslint-disable-next-line
  var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)
  import Food from '../components/food.vue'

  export default {
    name: 'foods-container',
    components: {
      'food': Food
    },
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
    font-size: 2em;
    font-weight: bold;
    text-decoration: none;
    margin: 0;
  }


</style>
