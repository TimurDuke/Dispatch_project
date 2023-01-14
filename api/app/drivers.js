const express = require('express');
const multer = require('multer');
const {nanoid} = require('nanoid');
const path = require('path');
const mongoose = require('mongoose');

const Driver = require('../models/Driver');
const Carrier = require('../models/Carrier');
const User = require("../models/User");
const auth = require('../middleware/auth');
const config = require('../config');
const permit = require("../middleware/permit");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
            return cb(new Error('Invalid file format'))
        }
        cb(null, true)
    }
});

router.get('/carrier', auth, permit('carrier'), async (req, res) => {
  try {
    const drivers = await Driver
      .find({companyId: req.user.companyId}).populate('companyId', 'title');

    res.send(drivers);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (req.query.status) {
      const params = req.query;
      const array = params.carrier ? params.carrier.map(item => (
        mongoose.Types.ObjectId(item)
      )) : null;
      
      let filter;
      if (!Boolean(params.carrier)) {
        filter = {'status': params.status};
      } else if (params.status === 'Status') {
        filter = {'companyId': { $in: array }};
      } else {
        filter = {'companyId': { $in: array }, 'status': params.status};
      }
  
      const load = await Driver.find(filter).populate('companyId', 'title');
      res.send(load);
    } else if (req.query.carrier) {
      const driversByCarrier = await Driver
        .find({companyId: req.query.carrier}).populate('companyId', 'title');

      res.send(driversByCarrier);
    } else {
      const order = {"$project" : {
          "_id" : 1,
          "telegramId" : 1,
          "email" : 1,
          "name" : 1,
          "phoneNumber" : 1,
          "companyId" : 1,
          "status" : 1,
          "currentStatus" : 1,
          "description" : 1,
          "pickUp" : 1,
          "delivery" : 1,
          "ETA" : 1,
          "readyTime" : 1,
          "notes" : 1,
          "license" : 1,
          "driversCount" : {"$size": "$drivers"},
          "order" : {
            "$cond" : {
              if : {"$eq" : ["$status", "ready"]}, then: 0,
              else : {"$cond" : {
                  if : {"$eq" : ["$status", "in transit"]}, then: 1,
                  else: {"$cond" : {
                      if : {"$eq" : ["$status", "upcoming"]}, then: 3,
                      else: {"$cond" : {
                          if : {"$eq" : ["$status", "in tr/upc"]}, then: 2,
                          else: 4
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      const sort = {"$sort" : {"driversCount" : -1, "companyId": 1, "order" : 1}};
      const project = {"$project" : {
          "_id": 1,
          "telegramId" : 1,
          "email" : 1,
          "name" : 1,
          "phoneNumber" : 1,
          "companyId" : 1,
          "status" : 1,
          "currentStatus" : 1,
          "description" : 1,
          "pickUp" : 1,
          "delivery" : 1,
          "ETA" : 1,
          "readyTime" : 1,
          "notes" : 1,
          "license" : 1,
        }};
      const lookup = {"$lookup":
          {
            from: "drivers",
            localField: "companyId",
            foreignField: "companyId",
            as: "drivers"
          }
      };

      const drivers = await Driver.aggregate([lookup, order, sort, project]);

      await Carrier.populate(drivers, {
        path: "companyId",
        select: {
          _id: 1,
          title: 1
        }
      });

      res.send(drivers);
    }

  } catch (e) {
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('companyId', 'title');

    res.send(driver);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post('/', auth, upload.single('license'), async (req, res) => {
  try {
    const {email, name, phoneNumber, companyId, description} = req.body;

    const duplicatedEmail = await User.findOne({email});

    if (duplicatedEmail) {
      const error = new Error();
      error.errors = {
        email: {
          "name": "ValidatorError",
          "message": "Error, expected email to be unique."
        }
      }
      throw error;
    }

    const driverData = {
      email,
      name,
      phoneNumber,
      companyId,
      description: JSON.parse(description),
      license: req.file ? 'uploads/' + req.file.filename : null,
    };


    if (driverData.status === 'off') {
      driverData.currentStatus = 'n/a';
    }

    const driver = new Driver(driverData);


    await driver.save();
    res.send(driver);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id', auth, upload.single('license'), async (req, res) => {
  try {
    const {email, name, phoneNumber, companyId, status, description, pickUp,
      delivery, ETA, readyTime, notes, currentStatus, telegramId} = req.body;

    const duplicatedEmail = await User.findOne({email});

    if (duplicatedEmail) {
      const error = new Error();
      error.errors = {
        email: {
          "name": "ValidatorError",
          "message": "Error, expected email to be unique."
        }
      }
      throw error;
    }

    const driver = await Driver.findById(req.params.id);

    driver.email = email;
    driver.name = name;
    driver.phoneNumber = phoneNumber;
    driver.companyId = companyId;
    driver.description = JSON.parse(description);
    driver.pickUp = pickUp;
    driver.delivery = delivery;
    driver.ETA = ETA;
    driver.readyTime = readyTime;
    driver.notes = notes;
    driver.license = req.file ? 'uploads/' + req.file.filename : null;

    if (status) {
        driver.status = status;
    }

    if (currentStatus){
        driver.currentStatus = currentStatus;
    }

    if(telegramId) {
        driver.telegramId = telegramId;
    }

    if (status !== 'in transit' && status !== 'in tr/upc') {
      driver.currentStatus = 'n/a';
    }

    await driver.save();
    res.send(driver);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/status/:id', auth, async (req, res) => {
  try {
    const {status, ETA, readyTime, notes, currentStatus} = req.body;

    const driver = await Driver.findById(req.params.id);

    driver.ETA = ETA;
    driver.readyTime = readyTime;
    driver.notes = notes;
    driver.status = status;
    driver.currentStatus = currentStatus;

    if (status !== 'in transit' && status !== 'in tr/upc') {
      driver.currentStatus = 'n/a';
    }

    await driver.save();
    res.send(driver);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;