const express = require('express');
const cors = require('cors');


const appMiddleware = express();

appMiddleware.use(cors()); 
appMiddleware.use(express.json());
appMiddleware.use(express.urlencoded({ extended: true }));


module.exports = appMiddleware;
