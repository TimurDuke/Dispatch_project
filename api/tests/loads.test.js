const mongoose = require('mongoose');
const request = require('supertest');
const app = require("../index");

const TRIPS_STATUSES = ['upcoming', 'transit', 'finished', 'cancel'];

describe('Testing \'loads\' route', () => {
  let randomLoadCode = new Date().valueOf().toString().slice(2) * 1;
  let user = null;
  let admin = null;
  let drivers;
  let brokers;
  let load = null;

  const getUser = (email, password) => {
    it('user should successfully login', async () => {
      const res = await request(app)
        .post('/users/sessions')
        .send({email, password});

      expect(res.statusCode).toBe(200);

      email === 'admin@gmail.com' ? admin = res.body : user = res.body;
    });
  };

  const getDrivers = async () => {
    it('should get array of all drivers', async () => {
      const res = await request(app)
        .get('/drivers')
        .set({Authorization: user.token});
      drivers = res.body;
    });
  };

    const getBrokers = async () => {
        it('should get array of all brokers', async () => {
            const res = await request(app)
                .get('/brokers')
                .set({Authorization: user.token});
            brokers = res.body;
        });
    };

  const createLoad = () => {
    if (user === null) getUser('user@gmail.com', 'user');
    getDrivers();
    getBrokers();

    it('load should successfully create', async () => {
      const res = await request(app)
        .post('/loads')
        .set({Authorization: user.token})
        .send({
          loadCode: randomLoadCode,
          driverId: drivers[0]._id.toString(),
          dispatchId: user._id,
          price: 2400,
          miles: 800,
          rpm: 3,
          datePU: "12/10/2022",
          dateDEL: "12/18/2022",
          timeToPU: "10:30",
          timeToDel: "05:00",
          pu: "Pitasdtsburg, PA",
          del: "Bosadton, MA",
          comment: "test comment",
          brokerId: brokers[0]._id.toString(),
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(2400);
      expect(res.body.status).toBe('upcoming');
      load = res.body;
    });
  };

  describe('getting of all loads with statuses', () => {
    getUser('user@gmail.com', 'user');

    TRIPS_STATUSES.forEach(status => {
      it('should get array of all loads with all statuses', async () => {
        const res = await request(app)
          .get('/loads?status=' + status)
          .set({Authorization: user.token});
        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('getting of all personal loads of the company', () => {
    getUser('bahaway@gmail.com', 'bahaway');

    it('should get of all personal trips of the company', async () => {
      const res = await request(app)
        .get('/loads/carrier')
        .set({Authorization: user.token});
      expect(res.statusCode).toBe(200);
    });
  });

  describe('create a new load', () => {
    createLoad();
  });

  describe('change load', () => {
    getUser('admin@gmail.com', 'admin');
    getUser('user@gmail.com', 'user');

    it('load should successfully update', async () => {
      const res = await request(app)
        .put('/loads/' + load._id)
        .set({Authorization: admin.token})
        .send({
          loadCode: randomLoadCode,
          driverId: drivers[1]._id.toString(),
          dispatchId: user._id,
          price: 2800,
          miles: 1400,
          rpm: 2,
          datePU: "12/15/2022",
          dateDEL: "12/22/2022",
          timeToPU: "9:30",
          timeToDel: "04:00",
          pu: "Pitsburg, PA",
          del: "Boston, MA",
          comment: "updated test comment",
          status: "transit",
          brokerId: brokers[1]._id.toString(),
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(2800);
      expect(res.body.status).toBe('transit');
    });
  });

  describe('change status', () => {
    getUser('user@gmail.com', 'user');

    it('status should successfully change', async () => {
      const res = await request(app)
        .put('/loads/status/' + load._id)
        .set({Authorization: user.token});

      expect(res.statusCode).toBe(200);
      expect(res.body[0].status).toBe('transit');
    });
  });

  describe('cancel load', () => {
    getUser('user@gmail.com', 'user');

    it('load should successfully cancel', async () => {
      const res = await request(app)
        .put('/loads/cancel/' + load._id)
        .set({Authorization: user.token});

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('finished');
    });
  });

  describe('change load comment', () => {
    getUser('user@gmail.com', 'user');

    it('load should successfully change', async () => {
      const res = await request(app)
        .put('/loads/comment/' + load._id)
        .set({Authorization: user.token})
        .send({comment: "changed comment"});

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Comment added successfully');
    });
  });

  describe('change load attachment', () => {
    getUser('user@gmail.com', 'user');

    it('load attachment should successfully change', async () => {
      const res = await request(app)
        .put('/loads/attachment/' + load._id)
        .set({Authorization: user.token})
        .attach('BOL', 'public/fixtures/BOL1.pdf')
        .attach('RC', 'public/fixtures/RC1.pdf')

      expect(res.statusCode).toBe(200);
    });
  });

});

afterAll(() => mongoose.disconnect());
