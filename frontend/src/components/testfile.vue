<template>
  <div>
    <input type="file" v-on:change="onFileChange" class="form-control"/>
    <button class="btn btn-success btn-block" @click="upload">Upload</button>
    <p>{{ status }}</p>
    <div>
      <p>the middle one</p>
      <input v-el="avatar" type="file" name="avatar" id="avatar" v-on:change="upload3">
    </div>
    <form id="chat-form" v-on:submit="sendChat">
      <input type="range" min=0 max=360 v-model="rotate" v-on:change="updateRotation">
      <input type="text" placeholder="username" v-model="username">
      <input type="text" placeholder="message" v-model="message">
      <input type="file" v-on:change="uploadFile">
      <!-- <input type="text" v-model="image"> -->
      <input type="submit" value="Send">
    </form>
    <!-- v-on:submit.prevent="upload4" -->
    <!-- Use the reset() method to reset the form. -->
    <!-- onsubmit="{upload4(this);return false;}" -->
    <form id="theform" v-on:submit.prevent="upload4" action="/testing" method="post" enctype="multipart/form-data">

      <div class="photo">
        <label for="file-upload" class="customFileButton">
            <div>add photo</div>
        </label>
        <input name="foodpic" id="file-upload" type="file"/>
      </div>

      <input type="text" name="name" placeholder="name"/>
      <input type="text" name="description" placeholder="description" />
      <button class="" type="submit">submit</button>

    </form>
    <!-- <form v-on:submit.prevent="upload2" method="post" enctype="multipart/form-data">

      <div class="photo">
        <label for="file-upload" class="customFileButton">
            <div>add photo</div>
        </label>
        <input v-el="avatar" name="avatar" id="file-upload" type="file"/>
      </div>

      <input type="text" name="name" placeholder="name"/>
      <input type="text" name="description" placeholder="description" />
      <button class="" type="submit">submit</button>

    </form> -->
  </div>
</template>

<script>
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
        // var image = new Image() // do i need this?
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

</script>
<!--
<script>
import axios from 'axios'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      file: null,
      formData: null,
      status: 'not ok',
      avatar: null,
      $avatar: null,
      image: null
    }
  },
  methods: {
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.file = files[0]
      this.createImageTest(files[0])
    },
    createImage (file) {
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.image = e.target.result
        console.log(vm.image)
      }
      reader.readAsDataURL(file)
    },
    createImageTest (file) {
      console.log(file)
      // console.log(this.file)
      let formData = new FormData()
      formData.append('file', file)
      formData.append('message', 'testmessage')
      // add all the normal fields key, values in the formData
      this.formData = formData
      console.log(this.formData)
    },
    upload () {
      // axios.post('https://graph.facebook.com/v2.9/1409936622361910/photos?access_token=EAAfvwZCToPzQBAFcisHDlBP4y9Pme3QI9ijevAZByTUVYfaDwLyqBcURDTIEQyyFV4Xk8uFtZCq6gOa62WKMObukztzrV2qzJcEkL6iLFqGXggZC6uuDKqItrQv2npAWMb8MUTNDOK8sG2ZAPe7FZCMyLR7CZAtA93Cpf7nSJVOHAZDZD', {source: this.formData}).then(response => {} // NOT LIKE THIS, put in formData alone
      axios.post('/uploadImage', this.formData).then(response => {
        // console.log(response)
        // let FBID = response.data.id
        // console.log(FBID)
        this.status = response.data.status
        console.log(response)
      })
      // axios.post('https://graph.facebook.com/v2.9/1409936622361910/photos?access_token=EAAfvwZCToPzQBAFcisHDlBP4y9Pme3QI9ijevAZByTUVYfaDwLyqBcURDTIEQyyFV4Xk8uFtZCq6gOa62WKMObukztzrV2qzJcEkL6iLFqGXggZC6uuDKqItrQv2npAWMb8MUTNDOK8sG2ZAPe7FZCMyLR7CZAtA93Cpf7nSJVOHAZDZD', this.formData).then(response => {
    },
    upload2 (e) {
      console.log(this)
      // var files = this.$$.avatar.files
      var data = new FormData()
      // for single file
      // data.append('avatar', files[0])
      // Or for multiple files you can also do
      //  _.each(files, function(v, k){
      //    data.append('avatars['+k+']', v);
      // });
      axios.post('/uploadImage', data).then(response => {
        // console.log(this)
        // console.log(response)
        // let FBID = response.data.id
        // console.log(FBID)
        this.status = response.data.status
        console.log(response)
      })
    },
    upload3: function (e) {
      e.preventDefault()
      // console.log(e.target.files)
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.image = e.target.result
        console.log(vm.image)
      }
      reader.readAsDataURL(e.target.files[0])
      // var files = this.$$.avatar.files
      var data = new FormData()
      // for single file
      // data.append('avatar', e.target.files[0])
      data.append('source', vm.image)
      // console.log(data)
      axios.post('/uploadImage', data).then(response => {
        this.status = response.data.status
        console.log(response)
      })
     // Or for multiple files you can also do
      //  _.each(files, function(v, k){
      //    data.append('avatars['+k+']', v);
     // });

      // this.$http.post('/avatars/upload', data, function (data, status, request) {
      //       // handling
      // }).error(function (data, status, request) {
      //      // handling
      // })
    },
    upload4 (e) {
      console.log(e.target[0].files[0])
      console.log(e)
      console.log(e.target.getElementsByTagName('foodpic'))
      // e.preventDefault()
      // window.document.querySelector('#theform').submit()
      // var theformer = window.document.querySelector('#theform').serialize()
      axios.post('/testing', e.target[0].files[0]).then(response => {
        this.status = response.data.status
        console.log(response)
      })
      return false
    }
  }
}

</script> -->

<style scoped>

</style>
