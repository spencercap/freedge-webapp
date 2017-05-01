<template>
  <div id="add-food">
    <form v-on:submit="addFood">
      <input type="text" placeholder="name" v-model="name">
      <input type="text" placeholder="description" v-model="description">

      <div class="photo">
        <label for="file-upload" class="customFileButton">
            <div v-if="!this.image">add photo</div>
            <img v-if="this.image" v-bind:src="this.image">
        </label>
        <input id="file-upload" v-on:change="uploadFile" type="file" name="foodpic"></input>
      </div>

      <input type="submit" value="GIVE">
    </form>

  </div>
</template>

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

<script>
  // eslint-disable-next-line
  var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)
  var comp

  export default {
    name: 'add-food',
    data () {
      return {
        foods: [],
        name: '',
        description: '',
        date: '',
        time: '',
        image: ''
      }
    },
    methods: {
      addFood (event) {
        event.preventDefault()
        if (this.description && this.name) {
          var chat = {
            name: this.name,
            description: this.description,
            date: this.date,
            time: this.time,
            image: this.image
          }
          this.foods.push(chat)
          socket.emit('message', chat)
          this.description = ''
          // this.scrollToBottom();
        }
      },
      uploadFile (e) {
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.createImage(files[0])
      },
      createImage (file) {
        var reader = new FileReader()
        var vm = this

        reader.onload = (e) => {
          vm.image = e.target.result
        }
        reader.readAsDataURL(file)
      },
      scrollToBottom () {
        this.$nextTick(function () {
          var chat = this.$el.querySelector('#foods')
          chat.scrollTop = chat.scrollHeight
        })
      },
      loadedImage (e) {
        console.log('the image loaded')
      }
    },
    mounted () {
      console.log('mounted')
      comp = this
      // console.log(foods)
    }
  }

  socket.on('initialize', function (foods) {
    console.log('recieved socket initialize from server')
    comp.foods = foods
    console.log(comp)
    // chatApp.scrollToBottom()
  })

  socket.on('message', function (food) {
    // chatApp.scrollToBottom()
    this.foods.push(food)
    console.log('recieved new food from server')
  })

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
