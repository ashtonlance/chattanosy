<template>
  <div class="hello">
    <div id="main-wrapper">
      <gmap-map :center="center" :zoom="12" style="width: 90%; height: 450px">
        <gmap-marker :key="index" v-for="(location, index) in locations" :position="{lat: Number(location.lat), lng: Number(location.lng)}" :clickable="true" :draggable="false" @mousedown="location.visible=true">
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
      <a id="add-button" class="button is-primary" v-on:click="show = true">Add Entry</a>
      <b-input id="search" placeholder="Type to search" type="input" v-model="search"></b-input>
      <table class="table is-narrow">
        <tr>
          <th>Name</th>
          <th>Address/Info</th>
        </tr>
        <tbody>
          <tr v-for="place in filteredLocations">
            <td>{{place.name}}</td>
            <td>
              <b>{{place.address}}</b>
              <br>{{place.notes}}
              <br><span class="message">Replies: {{place.reply}}</span>
              <a class="is-pulled-right" v-on:click="replyToLocation(place)"> REPLY</a>
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
                  <input type="text" placeholder="Street number and street name only" id="locationAddress" class="input" v-model="newLocation.address">
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
          <footer class="modal-card-foot is-centered">
            <a style="margin:auto" class="button is-dark" href="mailto:ashton@ashtonlance.com">contact the dev</a>
          </footer>
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
        visible: false
      },
      show: false,
      showReply: false,
      bkClass: 'bk',
      blurClass: 'blur',
      reply: '',
      visible: false,
      search: ''
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
    replyToLocation: function (place) {
      this.showReply = true
      placeToUpdate = place['.key'].toString()
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
      return self.locations.filter(function (place) {
        return place.name.toLowerCase().indexOf(self.search.toLowerCase()) > -1 || place.notes.toLowerCase().indexOf(self.search.toLowerCase()) > -1 ||
        place.reply.toLowerCase().indexOf(self.search.toLowerCase()) > -1
      })
    }
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

#add-button {
  margin: 25px 25px;
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
  width: 75%;
}
#search {
  max-width: 80%;
  margin: auto;
  margin-bottom: 5px;
}
</style>
