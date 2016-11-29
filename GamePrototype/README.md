# Hospital Management Game

This repository showcases the front-end UI developed in AngularJS for a "Hospital Management Game".

##### Getting Started

This project uses [jspm.io](http://jspm.io), a package manager for SystemJS which is built on top
of the dynamic ES6 module loader. This allows developers to load any module format (ES6, CommonJS,
AMD, and globals).

###### Prerequisites

This project assumes that you have NodeJS and any relevant development tools (like XCode) already
installed.

###### Getting Started

Clone this repository and execute the following commands in a terminal:

* `git checkout master`
* `npm install`
* `npm run serve`

> **Note:** Open the dev console to see any warnings and browse the elements.

###### Layout

You will notice a few files/directories within this project:

 1. `app/src` - This is where all of your application files are stored.
 2. `app/assets` - This folder contains some images and icons which are used by
    the application.
 3. `index.html` - The entry point to your application. This uses System.js to load the
    `app/src/boot/boot.js` bootstrap file which in turn loads the `app/src/app.js` file that imports
     all of your dependencies and declares them as Angular modules, and configures the icons and
     theming for the application. The default screen is the "Game Configuration" screen.
 4.  `indexGame.html` - Rename this file to index.html to see the "Game" screen.

#### Troubleshooting

If you have issues getting the application to run or work as expected:

1. Make sure you have installed JSPM and run the `jspm update` command.
2. Reach out on our [Forum](https://groups.google.com/forum/#!forum/ngmaterial) to see if any other
   developers have had the same issue.
3. This project is based against the `master` branch of Angular Material, so it is always showing
   the latest and greatest. You may want to update the `package.json` to use Version 1.1.0 or
   another stable release to make sure it isn't because of something we changed recently.
4. Search for the issue here on [GitHub](https://github.com/angular/material-start/issues?q=is%3Aissue+is%3Aopen).
5. If you don't see an existing issue, please open a new one with the relevant information and the
   details of the problem you are facing.

#### References

[Angular Material-Start Repo](https://github.com/angular/material-start)
[Angular Material Docs](https://material.angularjs.org/latest/)
