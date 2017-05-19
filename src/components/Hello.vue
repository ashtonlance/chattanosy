<template>
  <div class="hello">
    <div id="main-wrapper">
      <gmap-map :center="center" :zoom="14" style="width: 90%; height: 500px">
        <gmap-marker :key="index" v-for="(location, index) in locations" :position="{lat: Number(location.lat), lng: Number(location.lng)}" :clickable="true" :draggable="false"></gmap-marker>
      </gmap-map>
      <table class="table is-narrow">
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
            <!--<td>
              <span class="" aria-hidden="true" v-on:click="removeLocation(location)">Delete</span>
            </td>-->
          </tr>
        </tbody>
      </table>
      <a class="button is-primary" v-on:click="show = true">Add Location</a>
    </div>
    <transition name="fade">
      <div id="modal" class="modal is-active" v-if="show">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">CHATTANOSY</p>
            <button id="closeModal" class="delete" v-on:click="show = false"></button>
          </header>
          <section class="modal-card-body">
            <div class="content">
              <form id="form" class="field" v-on:submit.prevent="addLocation">
                <p class="control">
                  <label class="label" for="locationName">Name</label>
                  <input type="text" placeholder="Name of this location" id="locationName" class="input" v-model="newLocation.name">
                </p>
                <p class="control">
                  <label class="label" for="locationAddress">Address</label>
                  <input type="text" placeholder="Street number and street name only" id="locationAddress" class="input" v-model="newLocation.address">
                </p>
                <p class="control">
                  <label class="label" for="locationNotes">Notes</label>
                  <textarea type="text" placeholder="Notes about this location" id="locationNotes" class="textarea" v-model="newLocation.notes"></textarea>
                </p>
                <p style="display:none" class="control">
                  <label class="label" for="locationLatitude">Latitude</label>
                  <input type="text" id="locationLatitude" class="input" v-model="newLocation.lat">
                </p>
                <p style="display:none" class="control">
                  <label class="label" for="locationLongitude">Longitude</label>
                  <input type="text" id="locationLongitude" class="input" v-model="newLocation.lng">
                </p>
                <p class="control">
                  <button type="submit" v-on:click="show = false" class="button is-primary">Submit</button>
                </p>
              </form>
            </div>
          </section>
          <footer class="modal-card-foot is-centered">
            <a style="margin:auto" class="button is-dark" href="mailto:ashton@ashtonlance.com">contact the dev</a>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import db from '../db'
import axios from 'axios'
import miniToastr from 'mini-toastr'
let locationsRef = db.ref('locations/')

export default {
  name: 'app',
  firebase: {
    locations: locationsRef
  },
  data () {
    return {
      center: { lat: 35.0456, lng: -85.3097 },
      newLocation: {
        name: '',
        address: '',
        notes: '',
        lat: '',
        lng: '',
        errors: ''
      },
      show: false,
      bkClass: 'bk',
      blurClass: 'blur'
    }
  },
  methods: {
    addLocation: function () {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=` + this.newLocation.address + ',+Chattanooga,+TN&key=AIzaSyDni8xEY3eGI6q0ewpUjxYfQyvjJeDbbQo')
        .then(response => {
          this.newLocation.lat = response.data.results[0].geometry.location.lat
          this.newLocation.lng = response.data.results[0].geometry.location.lng
          locationsRef.push(this.newLocation)
          this.newLocation.name = ''
          this.newLocation.address = ''
          this.newLocation.notes = ''
          this.newLocation.lat = ''
          this.newLocation.lng = ''
          miniToastr.success('Location successfully added!')
        })
        .catch(e => {
          this.errors.push(e)
          miniToastr.error('Something went wrong!')
        })
    },
    removeLocation: function (location) {
      if (confirm('Are you sure you want to delete?') === true) {
        miniToastr.error(location.name + ' has been removed')
        locationsRef.child(location['.key']).remove()
      } else {
      }
    }
  },
  mounted: function () {
    miniToastr.init()
  }
}
</script>

<style scoped>
.hello {
  padding-top: 50px;
}

#main-wrapper {
  margin-bottom: 50px;
}

.vue-map-container {
  margin: auto;
}

table {
  width: 90%;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
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

form {
  margin: auto;
  margin-bottom: 50px;
  margin-top: 20px;
  width: 75%;
}
</style>
