<template>
  <div class="hello">
    <div id="main-wrapper">
      <h1 class="has-text-left title" style="padding-left: 25px;">What's new in Chattanooga?</h1>
      <gmap-map :center="center" :zoom="12" style="width: 90%; height: 450px">
        <gmap-marker :key="index" v-for="(location, index) in filteredLocations" :position="{lat: Number(location.lat), lng: Number(location.lng)}" :clickable="true" :draggable="false" @mousedown="location.visible=true">
          <gmap-info-window :opened="location.visible" @closeclick="location.visible=false">
            <b>{{location.name}}</b>
            <br> {{location.address}}
            <br> {{location.notes}}
            <br>
            <b>Replies: </b>{{location.reply}}
            <br>
          </gmap-info-window>
        </gmap-marker>
      </gmap-map>
      <div id="table-header">
        <h1 class="subtitle is-pulled-left">Chattanoogans are nosy about:</h1>
        <b-field class="is-pulled-right" id="controls" style="margin-bottom:1.5rem;">
          <b-input id="search" placeholder="Type to search" type="input" v-model="search"></b-input>
          <p class="control">
            <a id="add-button" class="button is-primary" v-on:click="show = true">Add an Entry</a>
          </p>
        </b-field>
        <transition name="fade">
          <pulse-loader id="loader" :color="color" :size="size"></pulse-loader>
        </transition>
      </div>
  
      <table class="table is-narrow" id="location-table">
        <tr>
          <th>Name</th>
          <th>Address/Info</th>
        </tr>
        <tbody>
          <tr v-for="location in filteredLocations" @mousedown="location.visible=true">
            <td>{{location.name}}
              <br>
              <div style="font-size:.75rem;">Added: {{location.created}}</div>
            </td>
            <td>
              <b>{{location.address}}</b>
              <br>{{location.notes}}
              <br>
              <span class="message">Replies: {{location.reply}}</span>
              <a class="is-pulled-right" v-on:click="replyToLocation(location)"> REPLY</a>
            </td>
          </tr>
        </tbody>
      </table>
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
                  <input type="text" placeholder="123 Main St" id="locationAddress" class="input" v-model="newLocation.address">
                </p>
                <p class="control">
                  <label class="label" for="locationNotes">Notes</label>
                  <b-input type="textarea" maxlength="100" placeholder="Notes about this location" id="locationNotes" v-model="newLocation.notes"></b-input>
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
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div id="modal2" class="modal is-active" v-if="showReply">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">CHATTANOSY</p>
            <button id="closeModal" class="delete" v-on:click="showReply = false"></button>
          </header>
          <section class="modal-card-body">
            <div class="content">
              <form id="form" class="field" v-on:submit.prevent="submitReply">
                <p class="control">
                  <label class="label" for="locationReply">Reply</label>
                  <b-input type="textarea" placeholder="Reply" id="locationReply" maxlength="75" v-model="reply"></b-input>
                </p>
                <p class="control">
                  <button type="submit" v-on:click="showReply = false" class="button is-primary">Submit</button>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import db from '../db'
import axios from 'axios'
import miniToastr from 'mini-toastr'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
let locationsRef = db.ref('locations/')
let placeToUpdate
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
        errors: '',
        reply: '',
        visible: false,
        created: ''
      },
      show: false,
      showReply: false,
      bkClass: 'bk',
      blurClass: 'blur',
      reply: '',
      visible: false,
      search: '',
      color: '#42b983',
      size: '30px'
    }
  },
  components: {
    PulseLoader
  },
  methods: {
    addLocation: function () {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=` + this.newLocation.address + ',+Chattanooga,+TN&key=AIzaSyDni8xEY3eGI6q0ewpUjxYfQyvjJeDbbQo')
        .then(response => {
          this.newLocation.lat = response.data.results[0].geometry.location.lat
          this.newLocation.lng = response.data.results[0].geometry.location.lng

          var today = new Date()
          var dd = today.getDate()
          var mm = today.getMonth() + 1
          var yyyy = today.getFullYear()

          if (dd < 10) {
            dd = '0' + dd
          }

          if (mm < 10) {
            mm = '0' + mm
          }

          today = mm + '/' + dd + '/' + yyyy
          this.newLocation.created = today
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
    replyToLocation: function (location) {
      this.showReply = true
      placeToUpdate = location['.key'].toString()
    },
    submitReply: function () {
      let replyTo = locationsRef.child(placeToUpdate)
      replyTo.update({
        'reply': this.reply
      })
      miniToastr.success('Reply submitted!')
      this.reply = ''
    }
  },
  mounted: function () {
    miniToastr.init()
  },
  computed: {
    filteredLocations: function () {
      var self = this
      return self.locations.filter(function (location) {
        return location.name.toLowerCase().indexOf(self.search.toLowerCase()) > -1 || location.notes.toLowerCase().indexOf(self.search.toLowerCase()) > -1 ||
          location.reply.toLowerCase().indexOf(self.search.toLowerCase()) > -1 ||
          location.address.toLowerCase().indexOf(self.search.toLowerCase()) > -1
      })
    }
  },
  updated: function () {
    var x = document.getElementById('location-table').rows.length - 1
    if (x === this.locations.length) {
      let loader = document.getElementById('loader')
      loader.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.hello {
  padding-top: 25px;
}

#main-wrapper {
  margin-bottom: 50px;
}

.vue-map-container {
  margin: auto;
}

#add-button {
  margin: 0 5px;
}

table {
  width: 90%;
  margin: auto;
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
  width: 95%;
}

#table-header {
  width: auto;
  margin: 50px auto;
  padding-left: 10%;
  padding-right: 10%;
}
</style>
