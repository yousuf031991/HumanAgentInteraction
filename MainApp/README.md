# Hospital Management Game

#### Getting Started

Clone this repository and execute the following commands in a terminal:

* `git checkout master`
* `npm install`
* 'start mongoDB on the default port'

How to run this app?

* Dev? `npm run start`
* Staging or Production? `npm run build` and `npm run serve`
* Make sure you do `npm run test` before building the app.


> **Note:** Everything is built using [this tutorial](https://www.youtube.com/watch?v=-gd73iczlS8&list=PL3vQyqzqjZ637sWpKvniMCxdqZhnMJC1d)

#### Project Structure

You will notice a few files/directories within this project:

 1. `app` - Server side (backend) stuff.
 2. `public` - Front end stuff
 3. `public/assets` - Where libraries for angular, bootstrap and jquery are located.
 4. [`public/app`](public/app/README.md) - Where the angular controllers, views, routes are located.
 4. [`lib/index.js`](lib/index.js) - the primary configuration file for the server

#### Components

The major components of the application are the following:

 1. [Game](#game) 
 2. [Questionnaire](#questionnaire)
 3. [Admin](#admin)
 
##### Game

The files relating to the game component are as follows:
 - [`public/app/views/pages/game/game.html`](public/app/views/pages/game/game.html) - Template of the game view.
 - [`public/app/controllers/gamePageCtrl.js`](public/app/controllers/gamePageCtrl.js) - Used for rendering data in the game view.
 - [`public/app/services/gamePageServices.js`](public/app/services/gamePageServices.js) - Contains the necessary functions like patient queueing algorithm, 
    assigning patients to room, maintaining room timers and other utility functions needed
    for playing the game.
 - [`public/app/services/gameStateServices.js`](public/app/services/gameStateServices.js) - Contains structure of game state. 
 - [`public/app/services/roomServices.js`](public/app/services/roomServices.js) - Contains structure for a room.
 - [`public/app/services/userStatsService.js`](public/app/services/userStatsService.js) - Provides structure for maintaining user statistics like moves and 
    utility functions
 - [`public/app/services/circleService.js`](public/app/services/circleService.js) - Provides structure for circle object.
 
##### Questionnaire

The questionnaire component has two major sub-components, namely
 - Pre-Game Questionnaire
 - Post-Game Questionnaire
 
The files relating to the pre-game and post-game questionnaires are as follows:
 - [`public/app/views/game/demographics.html`](public/app/views/game/demographics.html) - Template of the pre-game demographics questionnaire.
 - [`public/app/controllers/preGameQuestionnaireCtrl.js`](public/app/controllers/preGameQuestionnaireCtrl.js) - Used for rendering data in the pre-game questionnaire view.
 - [`public/app/views/game/trustTaskQuestionnaire.html`](public/app/views/game/trustTaskQuestionnaire.html) - Template of the post-game trust and task questionnaire.
 - [`public/app/controllers/postGameQuestionnaireCtrl.js`](public/app/controllers/postGameQuestionnaireCtrl.js) - Used for rendering data in the post-game questionnaire view.
 - [`public/app/services/questionnaireServices.js`](public/app/services/questionnaireServices.js) - Contains functions for updating user statistics with 
    questionnaire data.

##### Admin

The admin module consists of four major sub-components, namely
 - [Report Generation](report-generation)
 - [Admin Management](admin-management)
 - [Game Configuration Management](game-configuration-management)


###### Report Generation

The reporting component consists of two major sub-components, namely
 - Admin reports
 - Game reports
 
The files relating to reporting component are as follows:
 - [`public/app/views/reporting.html`](public/app/views/reporting.html) - Template to pick date range.
 - [`public/app/controllers/reportCtrl.js`](public/app/controllers/reportCtrl.js) - Controller associated with reporting
   view.
 - [`public/app/services/reportServices.js`](public/app/services/reportServices.js) - Contains functions to get and set 
   log data.

###### Admin Management

The admin management component is used to add or delete admins. The files associated with the admin
management module are as follows:
- [`public/app/views/admin/manageAdmin.html`](public/app/views/admin/manageAdmin.html) - Template used for managing admins
- [`public/app/controllers/manageAdminCtrl.js`](public/app/controllers/manageAdminCtrl.js) - Contains functions for
  adding, deleting and listing admins in the manage admin view.
- [`public/app/services/manageAdminServices.js`](public/app/services/manageAdminServices.js) _ Contains functions for 
   adding, deleting admins from the collection.

###### Game Configuration Management

The admin management component is used to create and maintain game configurations.