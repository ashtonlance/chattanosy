<template>
  <div id="app">
    <nav class="nav has-shadow">
      <div class="nav-left">
        <router-link to="/" class="nav-item">
          <h1>CHATTANOSY</h1>
        </router-link>
        
      </div>
      <div class="nav-center">
        <pulse-loader id="loader" :color="color" :size="size"></pulse-loader>
      </div>
  
      <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
      <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
      <span class="nav-toggle" onclick="document.querySelector('.nav-menu').classList.toggle('is-active');">
        <span></span>
        <span></span>
        <span></span>
      </span>
  
      <!-- This "nav-menu" is hidden on mobile -->
      <!-- Add the modifier "is-active" to display it on mobile -->
      <div class="nav-right nav-menu" onclick="document.querySelector('.nav-menu').classList.toggle('is-active');">
        <router-link to="/" class="nav-item">
          Home
        </router-link>
        <router-link to="/about" class="nav-item">
          About
        </router-link>
      </div>
    </nav>
    <transition name="fade" mode="out-in" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'app',
  data () {
    return {
      color: '#42b983',
      size: '15px'
    }
  },
  components: {
    PulseLoader
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#loader {
  margin-top: 2vh;
}
</style>
