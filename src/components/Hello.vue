<template>
  <div class="hello">
    <gmap-map :center="center" :zoom="10" style="width: 90%; height: 500px">
      <!--<gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>-->
    </gmap-map>
    <table class="table">
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Notes</th>
      </tr>
      <tbody>
        <tr v-for="location in locations">
          <td>{{location.name}}</td>
          <td>{{location.address}}</td>
          <td>{{location.notes}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import db from '../db'

let locationsRef = db.ref('locations/')

export default {
  name: 'app',
  firebase: {
    locations: locationsRef
  },
  data () {
    return {
      center: { lat: 35.0456, lng: -85.3097 },
      markers: [{
        position: { lat: 10.0, lng: 10.0 }
      }, {
        position: { lat: 11.0, lng: 11.0 }
      }]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  margin-top: 50px;
}
.vue-map-container {
  margin: auto;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
