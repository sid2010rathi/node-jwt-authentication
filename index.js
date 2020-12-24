const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

require('./utility/db')
const userCtrl = require('./controller/user');
const { JWT_SECRET } = require('./utility/utility');
const { nextTick } = require('process');

const app = express();

app.use('/', express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());

app.use((req, res, next) => {
    if(req && req.headers && req.headers.token) {
        jwt.verify(req.headers.token, JWT_SECRET, (err, decode) => {
            if(err) req.user = undefined;
            req.user = decode;
            next()
        })
    } else {
        req.user = undefined;
        next()
    }
})

app.get('/api', userCtrl.loginRequired, userCtrl.getUsers);

app.post('/api/register', userCtrl.registerUser);

app.post('/api/login', userCtrl.login);

app.post('/api/change-password', userCtrl.loginRequired, userCtrl.changePassword);

app.listen(9999, () => {
    console.log("Running on 9999");
})