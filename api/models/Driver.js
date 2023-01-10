const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const idValidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const validateEmail = value => {
  const pattern = /^\w+(\.?\w+)*@\w+(\.?\w+)*(\.\w{2,3})+$/;
  
  if (!pattern.test(value)) return false;
};

const validatePhoneNumber = value => {
  const pattern = /^\+(?:[0-9]●?){6,14}[0-9]$/;
  
  if (!pattern.test(value)) return false;
};


const DescriptionSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  DOB: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
});

const DriverSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {validator: validateEmail, message: 'Email is not valid!'},
    ]
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {validator: validatePhoneNumber, message: 'Phone number is not valid!'}
    ],
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Carrier',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['in transit', 'upcoming', 'ready', 'in tr/upc', 'off'],
    default: 'off',
  },
  currentStatus: {
    type: String,
    required: true,
    enum: ['driving', 'rest', 'emergency', 'n/a'],
    default: 'n/a',
  },
  telegramId: Number,
  description: DescriptionSchema,
  pickUp: String,
  delivery: String,
  ETA: String,
  readyTime: String,
  notes: String,
  license: String,
});

DriverSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
DriverSchema.plugin(idValidator, {message : 'Bad ID value for {PATH}',});



const Driver = mongoose.model('Driver', DriverSchema);
module.exports = Driver;