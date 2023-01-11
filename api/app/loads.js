const express = require('express');
const multer = require('multer');
const {nanoid} = require('nanoid');
const path = require('path');
const fs = require("fs");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");
const config = require('../config');
const Load = require("../models/Load");
const Driver = require("../models/Driver");
const User = require("../models/User");
const Broker = require("../models/Broker");

const TelegramApi = require('node-telegram-bot-api');
const token = "936426396:AAEwbo64h7Nf3lEJ56bW1ZoA3plMlyPl9VQ";
const bot = new TelegramApi(token, {polling: true});

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    },
});

const statusDriver = {
    ready: 'ready',
    transit: 'in transit',
    upcoming: 'upcoming',
    trUpc: 'in tr/upc',
    off: 'off',
};

const upload = multer({storage});

const cpUpload = upload.fields([{name: 'BOL', maxCount: 1}, {name: 'RC', maxCount: 1}])

router.get('/', auth, async (req, res) => {
    try {
        const start = req.query.start;
        const end = req.query.end;
        if (req.query.status === 'finished' || req.query.status === 'cancel') {
            let loads;
            if (!start && !end) {
                loads = await Load.find({status: {$in: ['finished', 'cancel']}})
                  .populate('driverId', ['name', 'status'])
                  .populate('dispatchId', 'displayName')
                  .populate('brokerId', 'name')
                  .populate({
                      path: 'comment',
                      populate: {
                          path: 'authorId',
                          select: 'displayName'
                      }
                  });
            } else {
                const startDay = new Date(start);
                const endDay = new Date(end);


                loads = await Load
                  .aggregate([
                      {
                          $project : {
                              loadCode: 1,
                              driverId: 1,
                              dispatchId: 1,
                              price: 1,
                              miles: 1,
                              rpm: 1,
                              datePU: 1,
                              dateDEL: 1,
                              timeToPU: 1,
                              timeToDel: 1,
                              pu: 1,
                              del: 1,
                              status: 1,
                              finishConfirmed: 1,
                              BOL: 1,
                              RC: 1,
                              brokerId: 1,
                              comment: 1,
                              date: {
                                  $dateFromString: {
                                      dateString: '$dateDEL',
                                      onError: null
                                  }
                              }
                          }
                      },
                      {
                          $match: {
                              status: {$in: ['finished', 'cancel']},
                              date: {
                                  $gte: startDay,
                                  $lte: endDay
                              }
                          }
                      },
                      {
                          $project : {
                              loadCode: 1,
                              driverId: 1,
                              dispatchId: 1,
                              price: 1,
                              miles: 1,
                              rpm: 1,
                              datePU: 1,
                              dateDEL: 1,
                              timeToPU: 1,
                              timeToDel: 1,
                              pu: 1,
                              del: 1,
                              status: 1,
                              finishConfirmed: 1,
                              BOL: 1,
                              RC: 1,
                              brokerId: 1,
                              comment: 1,
                          }
                      },
                  ]);

                await Driver.populate(loads, {
                    path: "driverId",
                    select: {
                        _id: 1,
                        name: 1,
                        status: 1
                    }
                });

                await User.populate(loads, {
                    path: "dispatcherId",
                    select: {
                        _id: 1,
                        displayName: 1
                    }
                });

                await Broker.populate(loads, {
                    path: "brokerId",
                    select: {
                        _id: 1,
                        name: 1
                    }
                });

                await User.populate(loads, {
                    path: "comments",
                    populate: {
                        path: "authorId",
                        select: {
                            _id: 1,
                            displayName: 1
                        }
                    }
                });
            }



            res.send(loads);
        } else {
            const loads = await Load.find(req.query)
                .populate('driverId', ['name', 'status'])
                .populate('dispatchId', 'displayName')
                .populate('brokerId', 'name')
                .populate({
                    path: 'comment',
                    populate: {
                        path: 'authorId',
                        select: 'displayName'
                    }
                });
            res.send(loads);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/carrier', auth, permit('carrier'), async (req, res) => {
    try {
        const drivers = await Driver.find({companyId: req.user.companyId});
        const loads = await Load
            .find({status: {$in: ['finished', 'cancel']}, driverId: {$in: drivers}})
            .populate('driverId', 'name')
            .populate('dispatchId', 'displayName')
            .populate('brokerId', 'name');
        res.send(loads);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const load = await Load.findById(req.params.id)
            .populate('driverId', 'name')
            .populate('dispatchId', 'displayName')
            .populate('brokerId', 'name')
            .populate({
                path: 'comment',
                populate: {
                    path: 'authorId',
                    select: 'displayName'
                }
            });
        res.send(load);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', auth, cpUpload, async (req, res) => {
    try {
        const {
            loadCode,
            driverId,
            dispatchId,
            price,
            miles,
            rpm,
            datePU,
            dateDEL,
            pu,
            del,
            comment,
            timeToPU,
            timeToDel,
            brokerId
        } = req.body;

        const loadData = {
            loadCode,
            driverId: driverId || null,
            dispatchId,
            price,
            miles,
            rpm,
            datePU: new Date(datePU).toLocaleDateString('en-Us'),
            dateDEL: new Date(dateDEL).toLocaleDateString('en-Us'),
            timeToDel,
            timeToPU,
            pu,
            del,
            BOL: null,
            RC: null,
            brokerId: brokerId || null,
            comment: comment.trim() !== '' ? {
                authorId: req.user._id,
                text: comment
            } : [],
        };

        if (new Date(loadData.datePU) > new Date(loadData.dateDEL)) {
            return res.status(400).send({message: 'DEL date cannot be earlier than PU date!'});
        }

        if (req.files?.BOL) {
            loadData.BOL = 'public/uploads/' + req.files['BOL'][0].filename;
        }
        if (req.files?.RC) {
            loadData.RC = 'public/uploads/' + req.files['RC'][0].filename;
        }
        if (driverId) {
            const driver = await Driver.findById({_id: driverId})

            if(driver.status !== 'ready') {

            }
            if (driver.telegramId) {
                await bot.sendMessage(driver.telegramId, `У вас есть новый груз ${loadCode}У вас есть новый груз ${loadCode}\nНапишите команду /load чтобы получить полную информацию по грузу`);
            }
            if (driver.status === 'off') {
                return res.status(403).send({message: 'The driver is not ready!'});
            } else if (driver.status === 'in tr/upc') {
                return res.status(403).send({message: 'The driver is in transit and has upcoming trip!'});
            } else if (driver.status === 'in transit') {
                await Driver.findByIdAndUpdate(driverId, {status: 'in tr/upc'});
            } else {
                await Driver.findByIdAndUpdate(driverId, {status: 'upcoming'});
            }
        }

        const load = new Load(loadData);
        await load.save();

        res.send(load);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/:id', auth, cpUpload, async (req, res) => {
    try {
        const roles = ['admin'];
        const load = await Load.findOne({_id: req.params.id});

        if (!load) {
            return res.status(404).send({message: 'Load not found!'});
        }

        if (load.status === 'finished' || load.status === 'cancel') {
            if (!roles.includes(req.user.role)) {
                return res.status(403).send({message: 'You do not have permission to edit!'});
            }
        }

        const {
            loadCode,
            driverId,
            dispatchId,
            price,
            miles,
            rpm,
            datePU,
            dateDEL,
            pu,
            del,
            status,
            comment,
            timeToPU,
            timeToDel,
            brokerId
        } = req.body;

        if (!driverId && (status === 'transit' || status === 'finished')) {
            return res.status(401).send('The status of the load without driver cannot be changed!');
        }


        let loadComment = [...load.comment];
        loadComment.push({
            authorId: req.user._id,
            text: comment
        });

        const loadData = {
            loadCode,
            driverId: driverId || null,
            dispatchId,
            price,
            miles,
            rpm,
            datePU: new Date(datePU).toLocaleDateString('en-Us'),
            dateDEL: new Date(dateDEL).toLocaleDateString('en-Us'),
            timeToPU,
            timeToDel,
            pu,
            del,
            status,
            brokerId: brokerId || null,
            comment: comment.trim() !== '' ? loadComment : load.comment,
        };

        if (new Date(loadData.datePU) > new Date(loadData.dateDEL)) {
            return res.status(400).send({message: 'DEL date cannot be earlier than PU date!'});
        }

        if (req.files?.BOL) {
            if (load.BOL) {
                fs.unlinkSync(load.BOL)
            }
            loadData.BOL = 'public/uploads/' + req.files['BOL'][0].filename;
        }
        if (req.files?.RC) {
            if (load.RC) {
                fs.unlinkSync(load.RC)
            }
            loadData.RC = 'public/uploads/' + req.files['RC'][0].filename;
        }
        if (driverId) {
            const driver = await Driver.findById({_id: driverId});
            if(driver.status === statusDriver.ready) {
                if (driver.telegramId) {
                    await bot.sendMessage(driver.telegramId, `У вас есть новый груз ${loadCode}\nНапишите команду /load чтобы получить полную информацию по грузу`);
                }
            } else {
                return res.status(400).send({message: 'Driver already have load!'});
            }
            if (driverId !== load.driverId) {
                const prevDriver = await Driver.findById({_id: load.driverId});
                if (prevDriver.status === 'in tr/upc') {
                    await Driver.findByIdAndUpdate(load.driverId, {status: 'in transit'});
                } else if (prevDriver.status === 'upcoming') {
                    await Driver.findByIdAndUpdate(load.driverId, {status: 'ready'});
                }
            }
            if (driver.status === 'off') {
                return res.status(403).send({message: 'The driver is not ready!'});
            } else if (driver.status === 'in tr/upc') {
                return res.status(403).send({message: 'The driver is in transit and has upcoming trip!'});
            } else if (driver.status === 'in transit') {
                await Driver.findByIdAndUpdate(driverId, {status: 'in tr/upc'});
            } else {
                await Driver.findByIdAndUpdate(driverId, {status: 'upcoming'});
            }
        }

        const updateLoad = await Load.findByIdAndUpdate(req.params.id, loadData, {new: true, runValidators: true});

        res.send(updateLoad);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/status/:id', auth, async (req, res) => {
    try {
        const load = await Load.findOne({_id: req.params.id});

        if (!load) {
            return res.status(404).send({message: 'Load not found!'});
        }

        if (!load.driverId) {
            return res.status(403).send({message: 'The status of the load without driver cannot be changed!'});
        }

        let driver = await Driver.findById({_id: load.driverId});

        if (load.status === 'upcoming' && driver.status === 'in tr/upc') {
            return res.status(403).send({message: 'The driver has not finished previous load yet!'});
        }

        if (load.status === 'upcoming') {
            await Load.findByIdAndUpdate(req.params.id, {status: 'transit'});
            const loads = await Load.find({status: 'upcoming'}).populate('driverId', 'name').populate('dispatchId', 'displayName').populate('brokerId', 'name');
            if (driver.status === 'upcoming') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'in transit', pickUp: load.pu, delivery: load.del, currentStatus: 'driving'});
            }
            res.send(loads);
        }

        if (load.status === 'transit') {
            if (driver.status === 'in tr/upc') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'upcoming', pickUp: '', delivery: '', currentStatus: 'n/a', ETA: ''});
            } else if (driver.status === 'in transit') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'ready', pickUp: '', delivery: '', currentStatus: 'n/a'});
            }
            await Load.findByIdAndUpdate(req.params.id, {status: 'finished'});
            const loads = await Load.find({status: 'transit'}).populate('driverId', 'name').populate('dispatchId', 'displayName').populate('brokerId', 'name');

            res.send(loads);
        }

    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/cancel/:id', auth, async (req, res) => {
    try {
        const load = await Load.findOne({_id: req.params.id});

        if (!load) {
            return res.status(404).send({message: 'Load not found!'});
        }

        const canceledLoad = await Load.findByIdAndUpdate(req.params.id, {status: 'cancel'});

        if (load.driverId) {
            const driver = await Driver.findById({_id: load.driverId})
            if (driver.telegramId) {
                await bot.sendMessage(driver.telegramId, `Ваш груз был отменен ${load.loadCode}`);
            }
            if (driver.status === 'in tr/upc' && load.status === 'upcoming') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'in transit'});
            } else if (driver.status === 'in tr/upc' && load.status === 'transit') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'upcoming', pickUp: '', delivery: '', currentStatus: 'n/a'});
            } else if (driver.status === 'in transit' && load.status === 'transit') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'ready', pickUp: '', delivery: '', currentStatus: 'n/a', ETA: ''});
            } else if (driver.status === 'upcoming' && load.status === 'upcoming') {
                await Driver.findByIdAndUpdate(load.driverId, {status: 'ready', ETA: ''});
            }
        }

        res.send(canceledLoad);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/comment/:id', auth, async (req, res) => {
    try {
        const {comment} = req.body;
        const load = await Load.findOne({_id: req.params.id});

        if (!load) {
            return res.status(404).send({message: 'Load not found!'});
        }
        let loadComment = [...load.comment];
        loadComment.push({
            authorId: req.user._id,
            text: comment
        });
        const loadData = comment.trim() !== '' ? loadComment : load.comment;
        await Load.findByIdAndUpdate(req.params.id, {comment: loadData});
        res.send('Comment added successfully');
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/attachment/:id', auth, cpUpload, async (req, res) => {
    try {
        const load = await Load.findOne({_id: req.params.id});

        if (!load) {
            return res.status(404).send({message: 'Load not found!'});
        }

        const loadData = {RC: '', BOL: ''};

        if (req.files?.BOL) {
            if (load.BOL) {
                fs.unlinkSync(load.BOL)
            }
            loadData.BOL = 'public/uploads/' + req.files['BOL'][0].filename;
        }
        if (req.files?.RC) {
            if (load.RC) {
                fs.unlinkSync(load.RC)
            }
            loadData.RC = 'public/uploads/' + req.files['RC'][0].filename;
        }

        const updatedLoad = await Load.findByIdAndUpdate(req.params.id, loadData, {new: true});

        res.send(updatedLoad);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/confirm/:id', auth, permit('admin', 'user'), async (req, res) => {
    try {
        const load = await Load.findOne({_id: req.params.id});

        if (!load) {
            return res.status(404).send({message: 'Load not found!'});
        }

        if (!(load.status === 'finished') || load.finishConfirmed) {
            return res.status(403).send({message: 'Only finished and unconfirmed trips can be confirmed!'});
        }

        await Load.findByIdAndUpdate(req.params.id, {finishConfirmed: true});
        res.send('Trip confirmed!');
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;