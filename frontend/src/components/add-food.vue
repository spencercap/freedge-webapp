<template>
  <div id="add-food" v-on:click.stop>
    <form v-on:submit="addFood">
      <div class="title">ADD FOOD</div>

      <div class="photo">
        <label for="file-upload" class="customFileButton">
            <div v-if="!this.image"><i class="fa fa-camera" aria-hidden="true"></i></div>
            <img v-if="this.image" v-bind:src="this.image">
        </label>
        <input id="file-upload" v-on:change="uploadFile" type="file" name="foodpic"></input>
      </div>

      <div class="row2">
        <input type="text" placeholder="name" v-model="name">
        <input type="text" placeholder="description" v-model="description">
      </div>

      <div class="row2">
        <datepicker input-class="betterCalStyle" v-model="date" name="uniquename"></datepicker>
        <vue-timepicker :format="timeFormat"
                        :minute-interval="15"
                        hide-clear-button
                        v-model="timeValue">
        </vue-timepicker>
      </div>



      <input class="submitButton" type="submit" value="GIVE">
    </form>

  </div>
</template>

<script>
  // eslint-disable-next-line
  var socket = io.connect(window.location.origin) // grabs socket io automatically from server instance? (ignored by linter.)
  // var comp
  import Datepicker from 'vuejs-datepicker'
  import VueTimepicker from 'vue2-timepicker'

  var vueFood = {
    name: 'add-food',
    components: {
      Datepicker,
      VueTimepicker
    },
    data () {
      return {
        foods: [],
        name: '',
        description: '',
        date: new Date(),
        time: '',
        timeFormat: 'h:mm a',
        timeValue: {
          h: (new Date().getHours() % 12 || 12).toString(),
          mm: new Date().getMinutes(),
          a: (new Date().getHours() > 12) ? 'pm' : 'am'
        },
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

      socket.on('initialize', (foods) => {
        console.log('recieved socket initialize from server')
        this.foods = foods
        // console.log
        // console.log(comp)
        // chatApp.scrollToBottom()
      })

      // PUT SOCKETS IN THE VUE OBJ
      socket.on('message', (food) => {
        // chatApp.scrollToBottom()
        // this.foods.push(food)
        console.log('recieved new food from server')
        console.log(food)
        console.log(vueFood)
        this.foods.push(food)
      })
    }
  }
  export default vueFood

</script>

<style>

  * {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  #add-food {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 50%;
    background: #fff;
    box-shadow: 0px 4px 16px 2px rgba(0,0,0,0.5);
    border-radius: 6px;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 1.5em;
    text-decoration: underline;
    padding: 0.6em;
  }

  .photo {
    box-shadow: inset 0 0 8px 0 rgba(0,0,0,.5);
    background: #fff;
    border: 3px solid #78fffa;
    border-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .customFileButton {
    /*position: absolute;*/
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    font-size: 40px;
    /*box-shadow: inset 0px 0px 8px 0px rgba(0,0,0,0.5);
    background: #fff;
    border: 3px solid #78fffa;
    border-radius: 6px;
    box-sizing: border-box;*/
  }

  .customFileButton > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fa-camera {
    color: #78fffa;
  }

  .submitButton {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 42px;
    background: #78FFFA;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 0 4px #888;
    border: 0;
    border-radius: 0 0 6px 6px;
    -webkit-appearance: none;
  }

  .selected {
    background: #78fffa !important;
  }

  .vdp-datepicker__calendar .cell.selected, .vdp-datepicker__calendar .cell.selected.highlighted, .vdp-datepicker__calendar .cell.selected:hover {
    background: #78fffa !important;
  }

  input[type="text"] {
    padding: 10px;
    font-size: 14px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
    outline: none;
    border-radius: 0;
    width: 160px;
  }
  input[type="text"]:focus,
  input[type="text"].focus {
    border-bottom: solid 2px #78FFFA;
  }

  /*.betterCalStyle {
    padding: 10px;
    font-size: 14px;
    border: none;
    border-bottom: solid 2px #c9c9c9;
    transition: border 0.3s;
    outline: none;
    border-radius: 0;
    width: 160px;
  }

  .betterCalStyle > input[type="text"]:focus,
  .betterCalStyle > input[type="text"].focus {
    border-bottom: solid 2px #78FFFA;
  }*/

  #file-upload {
    display: none;
  }

  .row2 {
    display: flex;
  }

  .row2 > * {
    margin: 1em;
  }

  .time-picker input.display-time {
    padding: 10px !important;
    font-size: 14px !important;
    border: none !important;
    height: 39px !important;
    border-bottom: solid 2px #c9c9c9 !important;
    transition: border 0.3s !important;
    outline: none !important;
    border-radius: 0 !important;
    width: 160px !important;
  }
  .time-picker > input[type="text"]:focus,
  .time-picker > input[type="text"].focus {
    border-bottom: solid 2px #78FFFA;
  }
  .time-picker .dropdown ul li.active, .time-picker .dropdown ul li.active:hover {
    background: #78FFFA !important;
  }
  .time-picker > * {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

</style>
