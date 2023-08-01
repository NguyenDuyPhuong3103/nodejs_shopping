const mongoose = require('mongoose');

async function connect() {

    try {
        //Look at the top left corner to know the URL
        await mongoose.connect('mongodb://127.0.0.1/project', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect to mongoDB successfully');
    } catch (error) {
        console.log('Connect to mongoDB failure');
        
    }

}

module.exports = { connect };
