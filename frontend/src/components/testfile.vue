<template>
  <div>
    <form id="chat-form" v-on:submit="sendChat">
      <input type="text" placeholder="name" v-model="name">
      <input type="text" placeholder="description" v-model="description">

      <div class="photo">
        <label for="file-upload" class="customFileButton">
            <div v-if="!this.image">add photo</div>
            <img v-if="this.image" v-bind:src="this.image">
        </label>
        <input id="file-upload" v-on:change="uploadFile" type="file" name="foodpic"></input>
      </div>

      <input type="submit" value="Send">
    </form>

  </div>
</template>

<!-- <script>
  // eslint-disable-next-line
  // var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)

  export default {
    name: 'hello',
    data () {
      return {
        name: '',
        description: 'test',
        image: '',
        foods: [],
        rotate: 0
      }
    },
    methods: {
      sendChat (event) {
        event.preventDefault()
        if (this.description && this.name) {
          var chat = {
            name: this.name,
            description: this.description,
            image: this.image
          }
          this.foods.push(chat)
          // socket.emit('message', chat)
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
    }
  }

  // socket.on('initialize', function (foods) {
  //   this.foods = foods
  //   console.log('recieved socket initialize from server')
  //   // chatApp.scrollToBottom()
  // })
  //
  // socket.on('message', function (chat) {
  //   // chatApp.scrollToBottom()
  //   this.foods.push(chat)
  //   console.log('recieved socket message from server')
  // })
</script> -->

<script>
  // eslint-disable-next-line
  var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)

  export default {
    name: 'hello',
    data () {
      return {
        name: '',
        description: 'test',
        date: '',
        time: '',
        image: '',
        foods: [],
        rotate: 0
      }
    },
    methods: {
      sendChat (event) {
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
    }
  }

  socket.on('initialize', function (foods) {
    this.foods = foods
    console.log('recieved socket initialize from server')
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
