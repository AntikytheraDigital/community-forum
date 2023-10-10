const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mockDatabase, dbUrl = null;

const connectDatabase = async () => {
    try {
        if (process.env.NODE_ENV === 'test') {
            if (!process.env.SESSION_KEY) {
                process.env.SESSION_KEY = 'test';
            }

            // Use in-memory database for testing
            // this can fail on UBUNTU 22.04, fix by adding environment variable: MONGOMS_VERSION=6.0.4
            mockDatabase = await MongoMemoryServer.create();
            dbUrl = mockDatabase.getUri();
        } else if (process.env.ATLAS_URI) {
            // Use production database
            dbUrl = process.env.ATLAS_URI;
        } else {
            // environment variable not set
            throw ('Environment variable ATLAS_URI must be set');
        }

        const db = await mongoose.connect(dbUrl);

        console.log(`MongoDB connected: ${db.connection.host}`);
    }
    catch(err) {
        console.log(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
}
const disconnectDatabase = async () => {
    try {
        await mongoose.connection.close();
        if (mockDatabase) {
            await mockDatabase.stop();
        }
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = {connectDatabase, disconnectDatabase};