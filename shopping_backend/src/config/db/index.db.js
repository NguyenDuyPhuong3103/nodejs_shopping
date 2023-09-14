const mongoose = require('mongoose');

async function connect() {

    try {
        //Look at the top left corner to know the URL
        await mongoose.connect(process.env.URI_MONGODB_PROJECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect to mongoDB successfully');
    } catch (error) {
        console.log('Connect to mongoDB failure');
    }

}

async function disconnect() {
    try {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error while disconnecting from MongoDB:', error);
    }
}

process.on('SIGINT', () => {
    disconnect();
});

module.exports = { connect, disconnect };
