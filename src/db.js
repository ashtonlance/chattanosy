import Firebase from 'firebase/app'
require('firebase/database')

const firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyB4RC9Pw6yfqJjnd6k13fK4w5vX1YnPXq4',
  authDomain: 'chattanosy.firebaseapp.com',
  databaseURL: 'https://chattanosy.firebaseio.com',
  projectId: 'chattanosy',
  storageBucket: 'chattanosy.appspot.com',
  messagingSenderId: '92293683537'
})

const db = firebaseApp.database()
export default db
