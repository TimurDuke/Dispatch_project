const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exitHook = require('async-exit-hook');
const users = require('./app/users');
const carriers = require('./app/carriers');
const drivers = require('./app/drivers');
const loads = require('./app/loads');
const learnings = require('./app/learnings');
const learningCategories = require('./app/learningCategories');
const brokers = require('./app/brokers');
const config = require('./config');
const bot = require("./telegramBotSD");

const app = express();


app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', users);
app.use('/carriers', carriers);
app.use('/drivers', drivers);
app.use('/loads', loads);
app.use('/learnings', learnings);
app.use('/learningCategories', learningCategories);
app.use('/brokers', brokers);


const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);

    if(process.env.NODE_ENV !== 'test') {
        app.listen(config.port, () => {
            console.log(`Server started on ${config.port} port!`);
        });
    }

    exitHook(() => {
        mongoose.disconnect();
        console.log('MongoDb disconnect');
    });
};

bot();

run().catch(e => console.log(e));

module.exports = app;
