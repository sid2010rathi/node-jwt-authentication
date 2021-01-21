const mongoose = require('mongoose');

const connString = 'mongodb+srv://assignmentUser:Wcxl30czqzp9isXl@assignmentcluster.wrepw.mongodb.net/learningDB?retryWrites=true&w=majority'
// mongoose.connect(connString);
mongoose.connect(connString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})