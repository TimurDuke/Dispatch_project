const express = require('express');
const multer = require('multer');
const {nanoid} = require('nanoid');
const path = require('path');

const User = require('../models/User');
const config = require('../config');
const auth = require('../middleware/auth');
const permit = require("../middleware/permit");
const mailTransporter = require("../mailTransporter");

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
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
            return cb(new Error('Invalid file format'))
        }
        cb(null, true)
    }
});

router.get('/dispatchers', auth, permit('admin'), async (req, res) => {
  try {
    const dispatchers = await User.find({role: 'user'});
    res.send(dispatchers);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const {email, password, displayName, role, phoneNumber} = req.body;
    const userData = {
      email,
      password,
      displayName,
      phoneNumber,
      role,
      isWorking: 'active',
      avatar: req.file ? 'uploads/' + req.file.filename : null,
    };

    const mailOptions = {
      from: config.mailServerOptions.auth.user,
      to: email,
      subject: "new user",
      text: config.mailServerOptions.mailText(displayName, email, password),
      html: config.mailServerOptions.mailHtml(displayName, email, password),
    };

    const user = new User(userData);

    await mailTransporter(mailOptions);

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/dispatchers', auth, permit('admin'), upload.single('avatar'), async (req, res) => {
  try {
    const {email, password, displayName, phoneNumber} = req.body;
    const userData = {
      email,
      password,
      displayName,
      phoneNumber,
      isWorking: 'active',
      avatar: req.file ? 'uploads/' + req.file.filename : null,
    };
    const user = new User(userData);

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/user-carrier', auth, permit('admin'), upload.single('avatar'), async (req, res) => {
  try {
    const {email, password, displayName, role, companyId, phoneNumber} = req.body;

    const userCarrierData = {
      email,
      password,
      displayName,
      role,
      companyId,
      phoneNumber,
      isWorking: 'active',
      avatar: req.file ? 'uploads/' + req.file.filename : null,
    };

    const user = new User(userCarrierData);

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/sessions', async (req,  res) => {
  const {email, password} = req.body;
  
  if (!email || !password) {
    return res.status(400).send('Data not valid!');
  }
  
  const user = await User.findOne({email}).populate('companyId', 'title');
  
  if (!user) {
    return res.status(401).send('Credentials are wrong!');
  }
  
  const isMatch = await user.checkPassword(password);
  
  if (!isMatch) {
    return res.status(401).send('Credentials are wrong!');
  }
  
  if (user.isWorking === 'disabled') {
    return res.status(401).send('Credentials are wrong!');
  }
  
  try {
    user.generateToken();
    
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/', auth, upload.single('avatar'), async (req, res) => {
    try {

        if (req.query.isWorking) {
            const status = req.query.isWorking;

            if (req.user.role !== 'admin') {
                return res.status(403).send('You have no permission to make changes!');
            }
            const user = await User.findById(req.body._id);
            if (!user) {
                return res.status(404).send({message: 'User not found!'});
            }
            if (user.role === 'admin') {
                return res.status(403).send('You can make changes only for dispatchers or carriers!');
            }
            if(status === 'false') {
              user.isWorking = 'disabled';
            } else if (status === 'true') {
              user.isWorking = 'active';
            }

            await user.save();
            return res.send(user);
        }

        const {displayName, password, oldPassword, email} = req.body;
        const userData ={};

        if ((oldPassword && !password) || (!oldPassword && password)) {
            return res.status(400).send({message: 'To change the password, the old and new password are required'});
        }

        if (oldPassword) {
            const user = await User.findOne({_id: req.user._id});
            const isMatch = await user.checkPassword(oldPassword);
            const pattern = /^\S{4,}$/;
            const isValid = pattern.test(password);

            if (!isMatch) {
                return res.status(400).send({message: 'Old password is wrong!'});
            }
            if (!isValid) {
                return res.status(400).send({message: 'New password not valid!'});
            }
            userData.password = password;
        }
        if (displayName) {
            userData.displayName = displayName;
        }
        if (email) {
            userData.email = email;
        }
        if (req.file){
            userData.avatar = 'uploads/' + req.file.filename;
        }

        const updateUser = await User.findOneAndUpdate({_id: req.user._id}, userData, {
            new: true,
            runValidators: true
        });
        res.send(updateUser);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/change_dispatcher', auth, upload.single('avatar'), async (req, res) => {
  try {
    const {email, password, displayName, role, phoneNumber, id} = req.body;

    if (id && (email || password || displayName || phoneNumber)) {

      if (id === req.user._id.toString()) {
        let userData;

        if(password !== "") {
          userData = {
            email,
            password,
            displayName,
            role,
            phoneNumber,
            avatar: req.file ? 'uploads/' + req.file.filename : req.user.avatar,
          };
        } else {
          userData = {
            email,
            displayName,
            role,
            phoneNumber,
            avatar: req.file ? 'uploads/' + req.file.filename : req.user.avatar,
          };
        }
        const updateUser = await User.findOneAndUpdate({_id: id}, userData, {new: true});
        res.send(updateUser);
      } else {
        return res.status(401).send({message: 'Wrong user id'});
      }
    } else {
      return res.status(400).send({message: 'Data is not valid'});
    }

  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/sessions', auth, async (req, res) => {
  try {
    const user = req.user;
    user.generateToken();
    
    await user.save();
    return res.send(user);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;