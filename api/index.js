const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exitHook = require('async-exit-hook');
const users = require('./app/users');
const carriers = require('./app/carriers');
const drivers = require('./app/drivers');
const loads = require('./app/loads');
const learnings = require('./app/learnings');

const config = require('./config');

const app = express();
const PORT = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', users);
app.use('/carriers', carriers);
app.use('/drivers', drivers);
app.use('/loads', loads);
app.use('/learnings', learnings);

const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);

    app.listen(PORT, () => {
        console.log(`Server started on ${PORT} port!`);
    });

    exitHook(() => {
        mongoose.disconnect();
        console.log('MongoDb disconnect');
    });
};

const TelegramApi = require('node-telegram-bot-api');
const Load = require("./models/Load");
const Driver = require("./models/Driver");

const token = "5488385805:AAGNvotjoClkC-YtvW92CfmeWTjVlvByvdc";

const bot = new TelegramApi(token, {polling: true});

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        const htmlStart = `<b>Supreme Dispatch welcomes you</b> ${msg.from.first_name}
<b>For continuation, enter your email</b>
Example => <b>dispatch@gmail.com</b>`
        return await bot.sendMessage(chatId, htmlStart, {
            parse_mode: 'HTML'
        });
    }

    if (text.match(/(@)/g)) {
        try {
            const driver = await Driver.findOne({email: text});
            if (driver) {
                await Driver.findByIdAndUpdate({_id: driver.id}, {telegramId: msg.from.id});
                return await bot.sendMessage(chatId, 'Your telegram connect to your loads with bot\nNow u can see which load u have by using command /load');
            } else {
                return await bot.sendMessage(chatId, 'You are not registered');
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (text === '/load') {
        const driver = await Driver.findOne({telegramId: msg.from.id})
        const load = await Load.find({driverId: driver.id});
        const upcomingLoad = load[0];
        if (upcomingLoad.status === 'upcoming') {
            const htmlLoad =
                `<b>Load\'s Code</b>: ${upcomingLoad.loadCode}
<b>Price</b>: ${upcomingLoad.price}
<b>Miles</b>: ${upcomingLoad.miles}
<b>Date Pick Up</b>: ${upcomingLoad.datePU}
<b>Date Delivery</b>: ${upcomingLoad.dateDEL}
<b>Location Pick Up from</b>: ${upcomingLoad.pu} => <b>Location Delivery to</b>: ${upcomingLoad.del}`
            return await bot.sendMessage(driver.telegramId, htmlLoad, {
                parse_mode: 'HTML'
            });
        } else {
            return await bot.sendMessage(chatId, 'You don\'t have load');
        }
    }
});

run().catch(e => console.log(e));