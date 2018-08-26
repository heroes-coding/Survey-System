This is a survey system designed for Santa Rosa Junior College.  

## Features
- [Basic Setup](#basic-setup)
  - [Development](#development)
  - [Building and Deploying](#building-and-deploying)

- [Admin Panel](#admin-panel)
  - [Create or Modify Survey](#create-or-modify-survey)
  - [View Reports](#view-reports)
- [Survey](#survey)

## Basic Setup

This is an overview both as documentation and an explanation to those who paid for this to be made.

This app has several parts.  It is more or less a MVC (Model, View, Controller) based set up.  The View portion was created in Create React App with the Bootstrap 4 Beta, Redux, and SASS, and is built to a static site.  It is located in /app.  

The Controller is an Express server setup that the static site proxies to and which serves the static site when receiving requests outside of its known endpoints.  The known endpoints are user authentication as well as an API for getting or adding data to the Model.  It is located in /server.

The Model is Google Firebase and the internals of /server/firebase.js.  If the server goes down or is redeployed elsewhere, nothing should be lost as all data should be saved to the model.  In accordance with this, some parts of the data are allowed to be overwritten / modified, and some parts are not (see more details in the [Admin-Panel](#admin-panel) section below).  Whether in production or development, environmental variables for Google Firebase must be set for all of the following process environment values:

```js
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})
```

### Development

This project uses Yarn as its package manager.  To run it for development, you should run `yarn start` from the app subfolder.  

This launches both the express server and the create react app development server, and watches and applies changes (including SASS) in the app portion.  To see changes in the server (The Controller / Express server) you'll need to `ctrl-c`, confirm, `ctrl-c`, and run `yarn start` again.

When viewing the app in development (at localhost:app-port, ie localhost:5300), make sure to go to the port the app uses and not the server, as the server one will work with the previous static build (if there is one) and not the current development state.  It is configured in the following line of /app/package.json:

```js
"scripts": {
  "client": "set PORT=5300 && yarn dev",
  ...
}
```

See the above note about environmental variables as well.

### Building and Deploying

The


### Configuration and Building

This project was built to save all essential data separate from the app server itself.  It is set up to work with

## Admin Panel

### Create or Modify Survey

### View Reports
