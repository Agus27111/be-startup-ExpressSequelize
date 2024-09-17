const express = require('express');
require('dotenv').config();
const appMiddleware = require('./middleware');

const userRouther = require('./routes/index');

const app = express();

app.use(appMiddleware);

app.use('/api', userRouther);

const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
