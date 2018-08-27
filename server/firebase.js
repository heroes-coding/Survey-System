const admin = require('firebase-admin')
const config = {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId
    };

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const database = admin.database()

/*
admin.auth().createUser({
  email: "studentequitysr@gmail.com",
  emailVerified: true,
  password: "secret",
  displayName: "John Diez",
  disabled: false
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);

  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
  });
*/

const getUserByEmail = (email) => {
  admin.auth().getUserByEmail(email)
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully fetched user data:", userRecord.toJSON());
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
    })
}
getUserByEmail("jeremy@heroes.report")
