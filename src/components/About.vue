<template>
  <div class="about">
    <div class="content">
      <h1>Hello, this is Chattanosy</h1>
      <p>If you're like me, you can't help but wonder what that new construction project is down the street. This is a place for the community to come together and share their knowledge and insights about their surroundings. Feel free to add your information to the map!</p>
      <p>This site is very much in a beta state - but please send me any feedback you may have <a href="mailto:ashton@ashtonlance.com">here.</a></p>
      <ul>
        <h1>Todo List:</h1>
        <li><del>Add ability for users to reply to orginal post</del></li>
        <li><del>Add ability to use current location</del></li>
        <li><del>Add logo/branding</del></li>
        <li>Add new posts/reply email notifications</li>
        <li>Add catergories/filtering</li>
      </ul>
    </div>
  </div>
</template>

<script>
// import miniToastr from 'mini-toastr'

export default {
  name: 'about',
  data () {
    return {
    }
  },
  methods: {

  },
  mounted: function () {

  }
}
</script>

<style scoped>
.about {
  padding-top: 25px;
  margin-bottom: 50px;
}
p {
  max-width: 75%;
  margin: auto;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none !important;
  padding: 0;
}

a {
  color: #42b983;
}
</style>
