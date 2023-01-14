const express = require('express');
const multer = require('multer');
const Carrier = require('../models/Carrier');

const auth = require('../middleware/auth');
const permit = require("../middleware/permit");
const config = require("../config");
const {nanoid} = require("nanoid");
const path = require("path");

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

router.get('/', auth, async (req, res) => {
  try {
    const carriers = await Carrier.find();
    res.send(carriers);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get('/:id', auth, permit('user', 'admin'), async (req, res) => {
  try {
    const carrier = await Carrier.findById(req.params.id);
    res.send(carrier);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post('/', auth, permit('user', 'admin'), upload.single('document'), async (req, res) => {
  try {
    const {title, mc, dot, fedid, description, phoneNumber} = req.body;
    const carrierData = {title, mc, dot, fedid, description, phoneNumber};

    if (req.file){
      carrierData.document = 'uploads/' + req.file.filename;
    }
    const carrier = new Carrier(carrierData);
    await carrier.save();

    res.send(carrier);

  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id', auth, permit('user', 'admin'), upload.single('document'), async (req, res) => {
  try {
    const {title, mc, dot, fedid, description, phoneNumber} = req.body;

    const carrier = await Carrier.findById(req.params.id);

    carrier.title = title;
    carrier.mc = mc;
    carrier.dot = dot;
    carrier.fedid = fedid;
    carrier.description = description;
    carrier.phoneNumber = phoneNumber;

    if (req.file){
      carrier.document = 'uploads/' + req.file.filename;
    }
    await carrier.save();
    
    res.send(carrier);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;