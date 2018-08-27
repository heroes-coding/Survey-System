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

This app has several parts.  It is more or less a MVC (Model, View, Controller) based set up.  The View portion was created in Create React App with the Bootstrap 4 Beta, Redux, and SASS, and is built to a static site.  It is located in /app.  It is not ejected, so can be updated if desired.

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

This project uses Yarn as its package manager.  To run it for development, you should run `yarn start` from the /app subfolder.  

> Make sure to run all `yarn add` commands for adding modules in the proper folder!  Modules for the server should be added at the top level, and modules for the app should be added in the app subfolder.

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

This can be set up as a normal server setup with the create react app build directory as a static and normal web server permissions directory, but it is configured to work with Heroku.  Just use the default node build package for Heroku, and the server and static site should both work correctly.  You'll need to add the top level survey directory to a Heroku private git, and then after you are ready to commit development changes to production, it is as simple as the normal build command for Heroku:

```
git push heroku master
```

The server should be serving up any defined endpoints in /server/index.js and the static site should be working from the Create React App setup.

The static site is built because of this part of /package.json:

```js
"heroku-postbuild": "cd app/ && yarn install && yarn build && yarn build-css",
```

## Admin Panel

The admin panel will be composed of three main parts: a user

accessible by two groups of users: administrators and coaches.  Administrators will have (somewhat limited for safety) creation and update privileges for surveys, as well as the ability to add new students, coaches, and admins.

When adding students or coaches, a student group can be assigned to the students so that coaches are able to easily filter for the students they are supposed to help.

Coaches will have the ability to view reports for previous surveys, filter based on survey or group, and modify (not delete) student names or ids (in case of mistakes on submission).


### Create or Modify Survey

Admins are the only ones that can create or modify a survey.

Creating a survey exposes the following fields:
* Survey name
* Description
* Category based multiple choice questions - can create as many categories and questions within as necessary
* Single multiple choice questions
* Info fields - can be marked required or not

Modifying a Survey allows:
* Adding new categories / questions / fields
* Changing description or name (but internal id will stay the same)
* Does not allow deleting of survey


### View Reports

Viewing reports will allow selecting individual student or summary data by survey.  

Summary data will show the following:

Average / mean / median / score / Mini distribution plot (histogram as all questions are discrete) for each question and category.  

Student data will show all past scores on the selected survey


## Survey

Surveys themselves are located at (website base)/{survey_name}.  All required questions must be answered.

After a submission attempt, required fields that are not filled out are highlighted.  If all of the fields are valid, the survey is submitted, and information boxes are revealed for categories of questions that average at or below a certain score.
