<template>
  <div>
    <input type="file" v-on:change="onFileChange" class="form-control"/>
    <button class="btn btn-success btn-block" @click="upload">Upload</button>
    <p>{{ status }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      file: null,
      formData: null,
      status: 'not ok'
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
    }
  }
}
</script>

<style scoped>

</style>
