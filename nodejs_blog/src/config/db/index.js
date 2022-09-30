const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/education_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect ok!');
    } catch (error) {
        console.log('Connect fail!');
    }
}

module.exports = {connect};