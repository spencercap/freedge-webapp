<template>
  <div>
    <form id="chat-form" v-on:submit="sendChat">
      <input type="text" placeholder="username" v-model="username">
      <input type="text" placeholder="message" v-model="message">

      <div class="photo">
        <label for="file-upload" class="customFileButton">
            <div>add photo</div>
            <img v-bind:src="this.image">
        </label>
        <!-- <input type="file" v-on:change="uploadFile"> -->
        <input id="file-upload" v-on:change="uploadFile" type="file" name="foodpic"></input>
      </div>

      <!-- <input type="file" v-on:change="uploadFile"> -->
      <!-- <img v-bind:src="this.image"> -->
      <input type="submit" value="Send">
    </form>

  </div>
</template>

<script>
// eslint-disable-next-line
// var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)

export default {
  name: 'hello',
  data () {
    return {
      username: '',
      message: 'test',
      image: '',
      chats: [],
      rotate: 0
    }
  },
  methods: {
    sendChat (event) {
      event.preventDefault()
      if (this.message && this.username) {
        var chat = {
          username: this.username,
          message: this.message,
          image: this.image
        }
        this.chats.push(chat)
        // socket.emit('message', chat)
        this.message = ''
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
        var chat = this.$el.querySelector('#chats')
        chat.scrollTop = chat.scrollHeight
      })
    },
    loadedImage (e) {
      console.log('the image loaded')
    }
  }
}

// socket.on('initialize', function (chats) {
//   this.chats = chats
//   console.log('recieved socket initialize from server')
//   // chatApp.scrollToBottom()
// })
//
// socket.on('message', function (chat) {
//   // chatApp.scrollToBottom()
//   this.chats.push(chat)
//   console.log('recieved socket message from server')
// })
</script>

<!-- <script>
  // eslint-disable-next-line
  var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)

  export default {
    name: 'hello',
    data () {
      return {
        username: '',
        message: 'test',
        image: '',
        chats: [],
        rotate: 0
      }
    },
    methods: {
      sendChat (event) {
        event.preventDefault()
        if (this.message && this.username) {
          var chat = {
            username: this.username,
            message: this.message,
            image: this.image
          }
          this.chats.push(chat)
          socket.emit('message', chat)
          this.message = ''
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
          var chat = this.$el.querySelector('#chats')
          chat.scrollTop = chat.scrollHeight
        })
      },
      loadedImage (e) {
        console.log('the image loaded')
      }
    }
  }

  socket.on('initialize', function (chats) {
    this.chats = chats
    console.log('recieved socket initialize from server')
    // chatApp.scrollToBottom()
  })

  socket.on('message', function (chat) {
    // chatApp.scrollToBottom()
    this.chats.push(chat)
    console.log('recieved socket message from server')
  })

</script> -->

<style scoped>

  .customFileButton {
    position: absolute;
    width: 100px;
    height: 100px;
    background: red;
  }

  .customFileButton > img {
    width: 100%;
    height: 100%;
  }

  input[type="file"] {
    display: none;
  }

</style>
