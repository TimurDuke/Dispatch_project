const mongoose = require('mongoose');
const {nanoid} = require('nanoid');
const config = require('./config');

const User = require('./models/User');
const Carrier = require('./models/Carrier');
const Driver = require("./models/Driver");
const Load = require("./models/Load");
const Learning = require("./models/Learning");
const LearningCategory = require("./models/LearningCategory");
const Broker = require("./models/Broker");

const run = async () => {
  await mongoose.connect(config.mongo.db);

  const collections = await mongoose.connection.db.listCollections().toArray();

  for (const coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name);
  }

  const [bahawayCarrier, safewayCargoCarrier, turanExpressCarrier, tumarExpressCarrier] = await Carrier.create({
    title: 'BAHAWAY',
    phoneNumber: '+611234567890',
    mc: '1180196',
    dot: '3537967',
    fedid: '83-3826233',
    description: 'test company #1',
    document: 'fixtures/bahaway.pdf'
  }, {
    title: 'SAFEWAY CARGO',
    phoneNumber: '+431234567890',
    mc: '1296697',
    dot: '3703312',
    fedid: '87-113019',
    description: 'test company #2'
  }, {
    title: 'TURAN EXPRESS',
    phoneNumber: '+994123456789',
    mc: '1256775',
    dot: '3648632',
    fedid: '84-2388341',
    description: 'test company #3',
    document: 'fixtures/turan.pdf'
  }, {
    title: 'TUMAR EXPRESS',
    phoneNumber: '+355123456789',
    mc: '918995',
    dot: '2638087',
    fedid: '47-4067936',
    description: 'test company #4',
    document: 'fixtures/tumar.pdf'
  });

  const [admin, user, user2, bahCarrier] = await User.create({
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'admin',
    token: nanoid(),
    displayName: 'Admin',
    avatar: 'fixtures/admin.png',
    phoneNumber: '+267●5350811',
    isWorking: 'active',
  }, {
    email: 'user@gmail.com',
    password: 'user',
    role: 'user',
    token: nanoid(),
    displayName: 'User',
    avatar: 'fixtures/user.png',
    phoneNumber: '+267●5350801',
    isWorking: 'active',
  }, {
    email: 'user2@gmail.com',
    password: 'user2',
    role: 'user',
    token: nanoid(),
    displayName: 'User2',
    phoneNumber: '+267●5350802',
    isWorking: 'disabled',
  }, {
    email: 'bahaway@gmail.com',
    password: 'bahaway',
    role: 'carrier',
    token: nanoid(),
    displayName: 'BAHAWAY',
    companyId: bahawayCarrier._id,
    phoneNumber: '+267●5350812',
    isWorking: 'active',
  }, {
    email: 'safeway@gmail.com',
    password: 'safeway',
    role: 'carrier',
    token: nanoid(),
    displayName: 'SAFEWAY CARGO',
    companyId: safewayCargoCarrier._id,
    phoneNumber: '+267●5350803',
    isWorking: 'active',
  });

  const [umotDriver, kubaDriver, timurDriver, keldibekDriver, bakdoolotDriver, askhatDriver,
    mirbekDriver, bekmuratDriver, makenDriver] = await Driver.create({
    email: 'umot@gmail.com',
    name: 'Umot',
    phoneNumber: '+2675350808',
    companyId: bahawayCarrier._id,
    status: 'in transit',
    currentStatus: 'driving',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, LA, Avalon c., str. 1, h. 45',
      DOB: '15.12.1980',
      info: 'Lorem ipsum dolor sit amet',
      reference: 'Punctual, decent'
    },
    pickUp: 'Shepherd, KY',
    delivery: 'Pittsburg, PA',
    ETA: '10:00',
    readyTime: '11/09/2022',
    notes: 'bla bla',
  }, {
    email: 'kuba@gmail.com',
    name: 'Kuba',
    phoneNumber: '+9293774446',
    companyId: bahawayCarrier._id,
    status: 'off',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, LA, Downey c., str. 1, h. 4',
      DOB: '5.04.1990',
      info: 'lorem',
      reference: 'Honest, communicative'
    }
  }, {
    email: 'timur@gmail.com',
    name: 'Timur',
    phoneNumber: '+3237454492',
    companyId: safewayCargoCarrier._id,
    status: 'upcoming',
    currentStatus: 'driving',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, IL, Chicago c., str. 1, h. 4',
      DOB: '12.06.1988',
      info: 'lorem',
      reference: 'Communicative'
    }
  }, {
    email: 'keldibek@gmail.com',
    name: 'Keldibek',
    phoneNumber: '+5138081130',
    companyId: safewayCargoCarrier._id,
    status: 'ready',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, IL, Chicago c., str. 1, h. 48',
      DOB: '30.08.1995',
      info: 'Lorem ipsum dolor sit amet',
      reference: 'Good driver'
    }
  }, {
    email: 'bakdoolot@gmail.com',
    name: 'Bakdoolot',
    phoneNumber: '+6306702075',
    companyId: safewayCargoCarrier._id,
    status: 'in tr/upc',
    currentStatus: 'rest',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, IL, Chicago c., str. 10, h. 48',
      DOB: '25.07.1993',
      info: 'lorem',
      reference: 'Professional with all required skills'
    },
    pickUp: 'New-York, NY',
    delivery: 'Chicago, IL',
    ETA: '10:00',
    readyTime: '11/09/2022',
    notes: 'bla bla',
  }, {
    email: 'askhat@gmail.com',
    name: 'Askhat',
    phoneNumber: '+3126840690',
    companyId: turanExpressCarrier._id,
    status: 'off',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, NY, New-York c., 5 Avenue, h. 48',
      DOB: '18.12.2005',
      info: 'Lorem ipsum dolor sit amet',
      reference: 'Needs to gain more experience'
    },
  }, {
    email: 'mirbek@gmail.com',
    name: 'Mirbek',
    phoneNumber: '+7736913604',
    companyId: turanExpressCarrier._id,
    status: 'in tr/upc',
    currentStatus: 'driving',
    description: {
      address: 'US, NY, New-York c., str. 56, h. 48',
      DOB: '3.01.1996',
      info: 'lorem',
      reference: 'Positive guy'
    },
    pickUp: 'Tulsa, OK',
    delivery: 'Chicago, IL',
    ETA: '10:00',
    readyTime: '11/09/2022',
    notes: 'bla bla',
  }, {
    email: 'bekmurat@gmail.com',
    name: 'Bekmurat',
    phoneNumber: '+7739466304',
    companyId: tumarExpressCarrier._id,
    status: 'ready',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, MS, Gulfport c., str. 4, h. 75, ap. 7',
      DOB: '22.02.1992',
      info: 'Lorem ipsum dolor sit amet',
      reference: 'Reliable guy'
    }
  }, {
    email: 'maken@gmail.com',
    name: 'Maken',
    phoneNumber: '+3474941314',
    companyId: tumarExpressCarrier._id,
    status: 'in transit',
    currentStatus: 'rest',
    license: 'fixtures/license.pdf',
    description: {
      address: 'US, TX, Houston c., str. 45, h. 12, ap. 12',
      DOB: '5.05.1995',
      info: 'lorem',
      reference: 'Responsible guy'
    },
    pickUp: 'Houston, TX',
    delivery: 'New Orleans, LA',
    ETA: '10:00',
    readyTime: '11/10/2022',
    notes: 'bla bla',
  });
  
  const [azamatBroker, aibekBroker, nurbekBroker, adiletBroker] = await Broker.create(
    {
      name: 'Azamat',
      phoneNumber: ['+9963592261', '+2678480704'],
      mc: '225863',
      description: 'Lorem ipsum dolor sit amet',
      companiesContract: [bahawayCarrier._id, safewayCargoCarrier._id, turanExpressCarrier._id]
    }, {
      name: 'Aibek',
      phoneNumber: ['+3478548314'],
      mc: '238164',
      description: 'Consectetur adipiscing elit',
      companiesContract: [bahawayCarrier._id],
    }, {
      name: 'Nurbek',
      phoneNumber: ['+1293525578', '+1294884446'],
      mc: '216579',
      companiesContract: [bahawayCarrier._id, tumarExpressCarrier._id],
    }, {
      name: 'Adilet',
      phoneNumber: ['+9965995232', '+7678480704', '+3232523146'],
      mc: '953268',
      description: 'Convallis convallis tellus id interdum velit laoreet id donec ultrices',
      companiesContract: [bahawayCarrier._id],
    }
  );
  
  await Load.create({
    loadCode: 'T-114K1J2M7',
    driverId: umotDriver._id,
    dispatchId: user2._id,
    price: 1335.6,
    miles: 445.2,
    rpm: 3,
    datePU: '11/5/2022',
    dateDEL: '11/9/2022',
    timeToPU: '22:16',
    timeToDel: '11:16',
    pu: 'Shepherd, KY',
    del: 'Pittsburg, PA',
    status: 'upcoming',
    BOL: 'fixtures/BOL1.pdf',
    RC: 'fixtures/RC1.pdf',
    brokerId: azamatBroker._id,
    comment: [{
      authorId: user2._id,
      text: 'Lorem ipsum'
    }]
  }, {
    loadCode: 'T-151F5454FEG',
    driverId: kubaDriver._id,
    dispatchId: user._id,
    price: 800,
    miles: 200,
    rpm: 4,
    datePU: '11/15/2022',
    dateDEL: '11/16/2022',
    timeToPU: '10:16',
    timeToDel: '15:16',
    pu: 'Pittsburg, PA',
    del: 'Boston, MA',
    status: 'upcoming',
    brokerId: aibekBroker._id,
    comment: [{
      authorId: user._id,
      text: 'Dolor sit amet, consectetur adipiscing elit'
    }, {
      authorId: user2._id,
      text: 'Ipsum'
    }]
  }, {
    loadCode: 'T-454GRG45R4G',
    driverId: timurDriver._id,
    dispatchId: user._id,
    price: 1750,
    miles: 700,
    rpm: 2.5,
    datePU: '11/5/2022',
    dateDEL: '11/8/2022',
    timeToPU: '3:16',
    timeToDel: '19:16',
    pu: 'New-York, NY',
    del: 'Chicago, IL',
    status: 'upcoming',
    BOL: 'fixtures/BOL2.pdf',
    RC: 'fixtures/RC2.pdf',
    brokerId: nurbekBroker._id,
    comment: [{
      authorId: user._id,
      text: 'Dolor sit amet, consectetur adipiscing elit'
    }, {
      authorId: user2._id,
      text: 'Ipsum'
    }, {
      authorId: user._id,
      text: 'Labore et dolore magna aliqua. Rhoncus dolor purus non'
    }]
  }, {
    loadCode: 'T-1285KK458',
    driverId: bakdoolotDriver._id,
    dispatchId: user._id,
    price: 1750,
    miles: 700,
    rpm: 2.5,
    datePU: '11/5/2022',
    dateDEL: '11/8/2022',
    timeToPU: '3:16',
    timeToDel: '19:16',
    pu: 'New-York, NY',
    del: 'Chicago, IL',
    status: 'transit',
    BOL: 'fixtures/BOL2.pdf',
    RC: 'fixtures/RC2.pdf',
    brokerId: nurbekBroker._id,
    comment: [{
      authorId: user._id,
      text: 'Dolor sit amet, consectetur adipiscing elit'
    }, {
      authorId: user2._id,
      text: 'Ipsum'
    }, {
      authorId: user._id,
      text: 'Labore et dolore magna aliqua. Rhoncus dolor purus non'
    }]
  }, {
    loadCode: 'T-128HSTB88',
    driverId: bakdoolotDriver._id,
    dispatchId: user._id,
    price: 1750,
    miles: 700,
    rpm: 2.5,
    datePU: '11/9/2022',
    dateDEL: '11/11/2022',
    timeToPU: '3:16',
    timeToDel: '19:16',
    pu: 'Chicago, IL',
    del: 'Boston, MS',
    status: 'upcoming',
    brokerId: nurbekBroker._id,
  },{
    loadCode: 'T-1285781258',
    driverId: mirbekDriver._id,
    dispatchId: user._id,
    price: 1750,
    miles: 700,
    rpm: 2.5,
    datePU: '11/8/2022',
    dateDEL: '11/9/2022',
    timeToPU: '3:16',
    timeToDel: '19:16',
    pu: 'Tulsa, OK',
    del: 'Chicago, IL',
    status: 'transit',
    BOL: 'fixtures/BOL2.pdf',
    RC: 'fixtures/RC2.pdf',
    brokerId: nurbekBroker._id,
    comment: [{
      authorId: user._id,
      text: 'Dolor sit amet, consectetur adipiscing elit'
    }, {
      authorId: user2._id,
      text: 'Ipsum'
    }, {
      authorId: user._id,
      text: 'Labore et dolore magna aliqua. Rhoncus dolor purus non'
    }]
  }, {
    loadCode: 'T-128HSCB84',
    driverId: mirbekDriver._id,
    dispatchId: user._id,
    price: 1750,
    miles: 700,
    rpm: 2.5,
    datePU: '11/9/2022',
    dateDEL: '11/11/2022',
    timeToPU: '3:16',
    timeToDel: '19:16',
    pu: 'Chicago, IL',
    del: 'Boston, MS',
    status: 'upcoming',
    brokerId: nurbekBroker._id,
  }, {
    loadCode: 'T-12FEF4E5F',
    dispatchId: user2._id,
    price: 2500,
    miles: 500,
    rpm: 5,
    datePU: '11/20/2022',
    dateDEL: '11/22/2022',
    timeToPU: '22:0',
    timeToDel: '11:05',
    pu: 'Chicago, IL',
    del: 'Lafayette, LA',
    status: 'upcoming',
    brokerId: adiletBroker._id,
    comment: [{
      authorId: user2._id,
      text: 'Et dolor sit amet, consectetur adipiscing elit'
    }, {
      authorId: admin._id,
      text: 'Adipiscing elit'
    }, {
      authorId: user._id,
      text: 'Rhoncus dolor purus non'
    }]
  }, {
    loadCode: 'T-1FEFS12S',
    driverId: makenDriver._id,
    dispatchId: user2._id,
    price: 750,
    miles: 250,
    rpm: 3,
    datePU: '11/9/2022',
    dateDEL: '11/10/2022',
    timeToPU: '11:0',
    timeToDel: '12:10',
    pu: 'Houston, TX',
    del: 'New Orleans, LA',
    status: 'transit',
    BOL: 'fixtures/BOL1.pdf',
    RC: 'fixtures/RC1.pdf',
  }, {
    loadCode: 'T-D1EF45SD1C',
    driverId: askhatDriver._id,
    dispatchId: user2._id,
    price: 1500,
    miles: 500,
    rpm: 3,
    datePU: '11/1/2022',
    dateDEL: '11/3/2022',
    timeToPU: '1:0',
    timeToDel: '18:0',
    pu: 'New-York, NY',
    del: 'Seattle, WS',
    status: 'finished',
    finishConfirmed: true,
    BOL: 'fixtures/BOL2.pdf',
    RC: 'fixtures/RC2.pdf',
  },{
    loadCode: 'T-D1EF78SD1C',
    dispatchId: user2._id,
    price: 1500,
    miles: 500,
    rpm: 3,
    datePU: '11/1/2022',
    dateDEL: '11/3/2022',
    timeToPU: '1:0',
    timeToDel: '25:0',
    pu: 'Bronx, NY',
    del: 'Gulfport, MS',
    status: 'cancel',
  });

  const [trucksCategory, dispatchersMistakesCategory] = await LearningCategory.create(
    {
    title: 'Trucks'
    }, {
      title: 'Dispatchers Common Mistakes'
    },
  );

  await Learning.create(
    {
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit purus non',
      author: admin._id,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non',
      learningCategory: trucksCategory._id,
      comment: [{
        authorId: user._id,
        text: 'Lorem ipsum'
      }, {
        authorId: user2._id,
        text: 'consectetur!!'
      },]
    }, {
      title: 'Convallis convallis',
      description: 'Convallis convallis tellus id interdum velit laoreet id donec ultrices.',
      author: admin._id,
      text: 'Lorem ipsum dolor sit amet, tellus id interdum velit laoreet id donec  elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non',
      learningCategory: dispatchersMistakesCategory._id,
      comment: [{
        authorId: user._id,
        text: 'Convallis convallis'
      }, {
        authorId: user2._id,
        text: 'tellus id?!'
      },]
    }, {
      title: 'Metus',
      description: 'Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.',
      author: admin._id,
      text: 'Metus vulputate eu scelerisqu Lorem ipsum dolor sit amet, tellus id interdum velit laoreet id donec  elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non',
      learningCategory: dispatchersMistakesCategory._id,
      comment: [{
        authorId: user._id,
        text: 'imperdiet proin'
      }]
    },
  );

  await mongoose.connection.close();
};

run().catch(console.error);

