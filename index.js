const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('./utility/db')
const userCtrl = require('./controller/user');

const app = express();

app.use('/', express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());

app.post('/api/register', userCtrl.registerUser);

app.post('/api/login', userCtrl.login);

app.post('/api/change-password', userCtrl.changePassword);

app.listen(9999, () => {
    console.log("Running on 9999");
})