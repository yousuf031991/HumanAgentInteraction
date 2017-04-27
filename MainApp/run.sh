#!/usr/bin/env bash
pm2 delete hospgame && git pull origin master &&
mongod --dbpath=/media/hospmanagement/My\ Book/MachineLearning/HumanAgentInteraction/MainApp/database> /dev/null &
npm run build && NODE_ENV=production pm2 start dist/index.js --name hospgame
