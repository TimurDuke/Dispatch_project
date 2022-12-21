const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

let number = new Date().valueOf().toString().slice(2)*1;
let uniqueEmail = new Date().valueOf().toString().slice(9)*1;



describe('Testing \'drivers\' route', () => {

  let user = null;
  let driver = null;
  let carriers = null;
  let driversData = null;
  let driverByCarrier = null;
  let carrier = null;

  const getUser = (email, password) => {
    it('user should successfully login', async () => {
      const res = await request(app)
        .post('/users/sessions')
        .send({email, password});
      expect(res.statusCode).toBe(200);
      user = res.body;
    });
  };
  const getCarriers = async() => {
    it('should get array of all carriers', async () => {
      const res = await request(app)
        .get('/carriers')
        .set({Authorization: user.token});
      carriers = res.body;
    });
  };
  const getCarrier = async() => {
    it('should get carrier', async () => {
      const res = await request(app)
        .get('/carriers')
        .set({Authorization: user.token});
      carrier = res.body.find(carrier => carrier.mc === '1180196')
    });
  };
  const getDrivers = async() => {
    it('should get array of all drivers', async () => {
      const res = await request(app)
        .get('/drivers')
        .set({Authorization: user.token});
      driversData = res.body;
    });
  };
  const getDriver = async() => {
    it('should get array of all drivers', async () => {
      const res = await request(app)
        .get('/drivers')
        .set({Authorization: user.token});
      driver = res.body.find(driver => driver.email === 'umot@gmail.com');
    });
  };


  const createDriver = () => {
    if (user === null) getUser('admin@gmail.com', 'admin');
    getCarriers();

    it('driver should successfully create', async () => {
      const res = await request(app)
        .post('/drivers')
        .set({Authorization: user.token})
        .send({
          email: `user${uniqueEmail}@gmail.com`,
          name: 'Kusya',
          phoneNumber: `+3${number}`,
          companyId: carriers[1]._id.toString(),
          status: 'upcoming',
          description: JSON.stringify({
            address: 'US, LA, Avalon c., str. 1, h. 45',
            DOB: '10.01.1989',
            info: 'Lorem ipsum dolor sit amet',
            reference: 'good boy'
          })
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.phoneNumber).toBe(`+3${number}`);
      expect(res.body.name).toBe('Kusya');
      driver = res.body;
    });
  };

  describe('get all drivers', () => {
    getUser('admin@gmail.com', 'admin');

    it('should get array of all drivers', async () => {
      const res = await request(app)
        .get('/drivers')
        .set({Authorization: user.token});
      expect(res.statusCode).toBe(200);

    });
  });

  describe('create a new driver', () => {
    createDriver();
  });

  describe('get all drivers of carrier', () => {
    getUser('bahaway@gmail.com', 'bahaway');
    it('should get array of all drivers', async () => {
      const res = await request(app)
        .get('/drivers/carrier')
        .set({Authorization: user.token});
      expect(res.statusCode).toBe(200);
    });
  });


  describe('get driver by id', () => {
    getUser('admin@gmail.com', 'admin');
    getDrivers();
    it('should get driver data', async () => {
      const res = await request(app)
      .get('/drivers/' + driversData[1]._id.toString())
      .set({Authorization: user.token});
      expect(res.statusCode).toBe(200);
    });
  });

  describe('get all drivers of carrier', () => {
    if (user === null) getUser('bahaway@gmail.com', 'bahaway');
    getCarriers();

    it('getting all drivers of carrier', async () => {
      const res = await request(app)
        .get('/drivers/carrier')
        .set({Authorization: user.token})

      expect(res.statusCode).toBe(200);
    });
  });

  describe('changing driver data', () => {
    if (user === null) getUser('admin@gmail.com', 'admin');
    getDriver();
    getCarrier();
    it('should edit driver', async () => {
      const res = await request(app)
        .put('/drivers/' + driver._id.toString())
        .set({Authorization: user.token})
        .send({
          email: 'umot@gmail.com',
          name: 'Umot Test',
          phoneNumber: '+355973456778',
          companyId: carrier._id.toString(),
          currentStatus: 'n/a',
          status: 'upcoming',
          description: JSON.stringify({
            address: 'US, NY, Manhattan c., str. 1, h. 34',
            DOB: '15.12.1988',
            info: 'Lorem ipsum dolor sit amet',
            reference: 'reliable'
          })
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.phoneNumber).toBe('+355973456778');
      expect(res.body.name).toBe('Umot Test');
    });
  });

  describe('changing driver data by Carrier', () => {

    it('should edit driver by Carrier', async () => {
      const res2 = await request(app)
        .post('/users/sessions')
        .send({email: 'bahaway@gmail.com', password: 'bahaway'});
      expect(res2.statusCode).toBe(200);
      let carrier = res2.body;
      const res1 = await request(app)
        .get('/drivers/carrier')
        .set({Authorization: carrier.token});
      driverByCarrier = res1.body.find(driver => driver.email === 'umot@gmail.com');
      const res = await request(app)
        .put('/drivers/' + driverByCarrier._id.toString())
        .set({Authorization: carrier.token})
        .send({
          email: 'umot@gmail.com',
          name: 'Kevin',
          phoneNumber: '+355973459978',
          companyId: carrier.companyId,
          status: 'upcoming',
          currentStatus: 'n/a',
          description: JSON.stringify({
            address: 'US, NY, Manhattan c., str. 1, h. 34',
            DOB: '15.12.1988',
            info: 'Lorem ipsum dolor sit amet',
            reference: 'reliable'
          })
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Kevin');
      expect(res.body.phoneNumber).toBe('+355973459978');

    });
  });

});

afterAll(() => mongoose.disconnect());
