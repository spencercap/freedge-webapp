<template>
  <div class="food">

      <span>I'm a food + {{ food.time }}</span>

  </div>
</template>

<script>

  export default {
    name: 'food',
    data () {
      return {
        namer: 'test name'
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
    }
  }
</script>

<style scoped>


</style>
