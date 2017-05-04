<template>
  <div id="foods-container">
    <span>ALL FOODS</span>
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

      socket.on('message', (food) => {
        // chatApp.scrollToBottom()
        this.foods.push(food)
        console.log('recieved new food from server')
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

</style>
