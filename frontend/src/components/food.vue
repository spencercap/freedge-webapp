<template>
  <div class="food">
      <p>Name: {{name}}</p>
      <p>Description: {{description}}</p>
      <p>Given: {{ date | moment("from", "now") }}<br>{{ date | moment("ddd, MMM Do") }} at {{time}}</p>
      <div class="foodPic" :style="{ backgroundImage: 'url(' + fbImgUrl + ')' }"></div>

      <button class="takeButton" type="button" name="take" @click="takeFood">TAKE</button>

  </div>
</template>

<script>
  export default {
    name: 'food',
    props: {
      name: String,
      description: String,
      date: String,
      time: String,
      fbPostId: String,
      fbImgUrl: String,
      mongoId: String
    },
    data () {
      return {
        var: 'variables here'
      }
    },
    methods: {
      takeFood () {
        console.log(this.fbPostId)
      },
      scrollToBottom () {
        this.$nextTick(function () {
          var chat = this.$el.querySelector('#foods')
          chat.scrollTop = chat.scrollHeight
        })
      }
    },
    mounted () {
      console.log('mounted')
    }
  }
</script>

<style scoped>

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

  .takeButton {
    background: #ff0000;
    width: 100%;
    color: #fff;
    font-weight: bold;
    border: none;
    font-size: 1.5em;
    padding: 0.35em;
  }

</style>
