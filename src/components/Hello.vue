<template>
  <div class="hello">
    <div id="main-wrapper">
      <h1 class="has-text-left title" style="padding-left: 25px;">What's new in Chattanooga?</h1>
      <gmap-map id="map" :options="options" :center="center" :zoom="13" style="width: 90%; height: 450px">
        <gmap-marker :key="index" v-for="(location, index) in filteredLocations" :position="{lat: Number(location.lat), lng: Number(location.lng)}" :clickable="true" :draggable="false" @mousedown="location.visible=true">
          <gmap-info-window :opened="location.visible" @closeclick="location.visible=false">
            <b>{{location.name}}</b>
            <br> {{location.address}}
            <br> {{location.notes}}
            <br>
            <div v-for="replies in location.replies">
              <span class="message">Reply: {{replies.reply}}</span>
            </div>
            <br>
          </gmap-info-window>
        </gmap-marker>
      </gmap-map>
      <div class="box" id="table-header">
        <h1 class="subtitle is-4 is-pulled-left">Chattanoogans are nosy about:</h1>
        <b-field class="is-pulled-right" id="controls" style="margin-bottom:1.5rem;">
          <b-input id="search" placeholder="Type to search" type="input" v-model="search"></b-input>
          <p class="control">
            <a id="add-button" class="button is-primary" v-on:click="show = true">Add an Entry</a>
          </p>
        </b-field>
        <br>
        <transition name="fade">
          <pulse-loader id="loader" :color="color" :size="size"></pulse-loader>
        </transition>
        <br>
        <paginate-links for="rows" :async="true"></paginate-links>
        <br>
        <div id="results-info" v-if="$refs.paginator">
          Viewing {{$refs.paginator.pageItemsCount}} results
        </div>
      </div>
      <br>
      <paginate name="rows" :list="filteredLocations" :per="10" ref="paginator">
        <table class="table is-narrow" id="location-table">
          <tr>
          </tr>
          <tbody>
            <tr v-for="location in paginated('rows')" @mousedown="location.visible=true">
              <td>                
                <div v-if="location.image" style="font-size:.75rem;">
                  <b-tooltip label="Tap to enlarge image" position="is-right">
                  <figure class="image is-96x96">
                    <img v-on:click="showImageLarge(location)" class="location-image" :src="location.image">
                  </figure>
                  </b-tooltip>
                </div>
                <div v-if="!location.image" style="font-size:.75rem;">
                  <b-tooltip label="Tap to upload an image" position="is-right">
                  <figure class="image is-96x96">
                    <img v-on:click="replyWithImage(location)" src="../assets/placeholder.png">
                  </figure>
                  </b-tooltip>
                </div>
              </td>
              <td>
                {{location.name}}
                <div style="font-size:.75rem;">Added: {{location.created}}</div>
                {{location.address}}
                <br>{{location.notes}}
                <br>
                <div v-for="replies in location.replies">
                  <span class="message">Reply: {{replies.reply}}</span>
                </div>
                <a class="is-pulled-right" v-on:click="replyToLocation(location)"> + Reply</a>
              </td>
            </tr>
          </tbody>
        </table>
      </paginate>
      <div class="subtitle is-5">Tip: clicking a row opens the location details on the map</div>
    </div>
    <transition name="fade">
      <span v-if="scrolled" id="scroll-top" class="tag is-dark" href="#" v-scroll-to="'#map'">Scroll to map</span>
    </transition>
    <transition name="fade">
      <div id="modal" class="modal is-active" v-if="show">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">CHATTANOSY</p>
            <button id="closeModal" class="delete" v-on:click="show = false, usingCurrentLocation = false"></button>
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
                  <a v-bind:class="{ 'is-loading': isLoading }" v-on:click="getLocation()" class="button is-primary">Use Current Location</a>
                </p>
                <div class="field is-horizontal">
                  <div class="field-body">
                    <p style="display:none" class="control">
                      <label class="label" for="locationLatitude">Latitude</label>
                      <input type="text" id="locationLatitude" class="input" v-model="newLocation.lat">
                    </p>
                    <p style="display:none" class="control">
                      <label class="label" for="locationLongitude">Longitude</label>
                      <input type="text" id="locationLongitude" class="input" v-model="newLocation.lng">
                    </p>
                  </div>
                </div>
                <p class="control">
                  <label class="label" for="locationNotes">Notes</label>
                  <b-input type="textarea" maxlength="125" placeholder="Notes about this location" id="locationNotes" v-model="newLocation.notes"></b-input>
                </p>
                <p class="control">
                  <label class="label" for="locationImage">Upload an image:</label>
                  <input type="file" name="image" id="locationImage" accept="image/*" capture="camera" @change="previewImage">
                </p>
                <p>
                  If you're posting a URL, please use a shortened link from:
                  <a href="https://bitly.com" target="_blank">bitly.com</a>
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
                  <b-input type="textarea" placeholder="Reply" id="locationReply" maxlength="100" v-model="reply"></b-input>
                </p>
                <p>
                  If you're posting a URL, please use a shortened link from:
                  <a href="https://bitly.com" target="_blank">bitly.com</a>
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
    <transition name="fade">
      <div id="modal2" class="modal is-active" v-if="showUpload">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">CHATTANOSY</p>
            <button id="closeModal" class="delete" v-on:click="showUpload = false"></button>
          </header>
          <section class="modal-card-body">
            <div class="content">
              <form id="form" class="field" v-on:submit.prevent="addImage">
                <p class="control">
                  <label class="label" for="locationImage">Upload an image:</label>
                  <input type="file" class="input" name="image" capture="camera" id="locationImage" accept="image/*" @change="addImage">
                </p>
                <p class="control">
                  <button type="submit" v-on:click="showUpload = false" class="button is-primary">Submit</button>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div id="modal2" class="modal is-active" v-if="showImage">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">CHATTANOSY</p>
            <button id="closeModal" class="delete" v-on:click="showImage = false"></button>
          </header>
          <section class="modal-card-body">
            <div class="content">
              <img id="big-image">
            </div>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { db, storage } from '../db'
import axios from 'axios'
import miniToastr from 'mini-toastr'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
let locationsRef = db.ref('locations/')
let storageRef = storage.ref()
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
        replies: '',
        visible: false,
        created: '',
        image: ''
      },
      show: false,
      showReply: false,
      showUpload: false,
      showImage: false,
      reply: '',
      replies: '',
      visible: false,
      search: '',
      color: '#42b983',
      size: '30px',
      scrolled: false,
      options: { scrollwheel: false },
      isLoading: false,
      usingCurrentLocation: false,
      paginate: ['rows']
    }
  },
  components: {
    PulseLoader
  },
  methods: {
    addLocation: function () {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=` + this.newLocation.address + ',+Chattanooga,+TN&key=AIzaSyDni8xEY3eGI6q0ewpUjxYfQyvjJeDbbQo')
        .then(response => {
          if (this.newLocation.name === '') {
            this.show = true
            miniToastr.error('A name is required when submitting a new location!')
            return
          }

          if (this.newLocation.address === '') {
            this.show = true
            miniToastr.error('An address is required when submitting a new location!')
            return
          }

          if (this.newLocation.lat === '') {
            this.newLocation.lat = response.data.results[0].geometry.location.lat
            this.newLocation.lng = response.data.results[0].geometry.location.lng
          }

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
          this.usingCurrentLocation = false
          miniToastr.success('Location successfully added!')
        })
        .catch(e => {
          this.errors.push(e)
          miniToastr.error('Something went wrong!')
        })
    },
    previewImage: function (event) {
      var input = event.target
      if (input.files && input.files[0]) {
        let image = input.files[0]
        let random = Math.floor(Math.random() * 2001)
        let imageRef = storageRef.child('images/' + random + image.name)
        let that = this
        imageRef.put(image).then(function (snapshot) {
          console.log('Uploaded!')
          that.newLocation.image = snapshot.metadata.downloadURLs[0]
        })
      }
    },
    replyWithImage: function (location) {
      this.showUpload = true
      placeToUpdate = location['.key'].toString()
    },
    addImage: function (event) {
      var input = event.target
      if (input.files && input.files[0]) {
        let image = input.files[0]
        let random = Math.floor(Math.random() * 2001)
        let imageRef = storageRef.child('images/' + random + image.name)
        let that = this
        imageRef.put(image).then(function (snapshot) {
          console.log('Uploaded!')
          that.newLocation.image = snapshot.metadata.downloadURLs[0]
          let imageReply = locationsRef.child(placeToUpdate).child('image')
          imageReply.set(that.newLocation.image)
        })
      }
    },
    showImageLarge: function (location) {
      this.showImage = true
      setTimeout(function () {
        let imageToShow = document.getElementById('big-image')
        imageToShow.src = location.image
      }, 0)
    },
    replyToLocation: function (location) {
      this.showReply = true
      placeToUpdate = location['.key'].toString()
    },
    submitReply: function () {
      let replyTo = locationsRef.child(placeToUpdate).child('replies').push()
      replyTo.set({
        'reply': this.reply
      })
      miniToastr.success('Reply submitted!')
      this.reply = ''
    },
    handleScroll: function () {
      this.scrolled = window.scrollY > 600
    },
    getLocation: function () {
      let that = this
      this.isLoading = true
      this.usingCurrentLocation = true
      navigator.geolocation.getCurrentPosition(function (position) {
        that.newLocation.lat = position.coords.latitude
        that.newLocation.lng = position.coords.longitude
        that.isLoading = false
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=` + that.newLocation.lat + ', ' + that.newLocation.lng + '&key=AIzaSyDni8xEY3eGI6q0ewpUjxYfQyvjJeDbbQo')
          .then(response => {
            that.newLocation.address = response.data.results[0].formatted_address
          })
      })
    }
  },
  mounted: function () {
    miniToastr.init()
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    filteredLocations: function () {
      var self = this
      return self.locations.filter(function (location) {
        return location.name.toLowerCase().indexOf(self.search.toLowerCase()) > -1 || location.notes.toLowerCase().indexOf(self.search.toLowerCase()) > -1 ||
          location.address.toLowerCase().indexOf(self.search.toLowerCase()) > -1
      }).reverse()
    }
  },
  updated: function () {
    var x = document.getElementById('location-table').rows.length - 1
    if (x !== 0) {
      if (x === 10) {
        let loader = document.getElementById('loader')
        loader.style.display = 'none'
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
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
  margin-bottom: 15px;
  padding-left: 7%;
  padding-right: 7%;
}

#scroll-top {
  position: fixed;
  bottom: 25px;
  right: 20px;
  font-size: 1rem;
  background: rgba(1, 1, 1, 0.80);
}

#table-header>ul {
  display: inline-block;
}

#results-info {
  margin-top: 15px;
  margin-bottom: 0;
}

@media (max-width: 375px) {
  .subtitle {
    font-size: 1.25rem !important;
  }
}
</style>
