const mongoose = require('mongoose');

const connString = 'mongodb+srv://durga_db:Y5xzIcr3Yy1esosC@cluster0.gkq2r.mongodb.net/learning?retryWrites=true&w=majority'
// mongoose.connect(connString);
mongoose.connect(connString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})