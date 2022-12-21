const mongoose = require('mongoose');
const request = require('supertest');
const app = require("../index");

describe('Testing \'brokers\' route', () => {
  let user;
  let broker;
  let carriers;
  let brokers;
  let number = new Date().valueOf().toString().slice(2)*1;

  const getUser = (email, password) => {
    it('should login user', async () => {
      const res = await request(app)
        .post('/users/sessions')
        .send({email, password});

      await expect(res.statusCode).toBe(200);
      user = res.body;
    });
  };

  const getCarriers = () => {
    it('should return an array of all carriers', async () => {
      const res = await request(app)
        .get('/carriers')
        .set({Authorization: user.token});
      carriers = res.body;
    });
  };

  const getBrokers = () => {
    it('should return an array of all brokers', async () => {
      const res = await request(app)
        .get('/brokers')
        .set({Authorization: user.token});
      brokers = res.body;
    });
  };

  const createBroker = () => {
    getUser('user@gmail.com', 'user');
    getCarriers();
    getBrokers();

    it('should create broker', async () => {
      const res = await request(app)
        .post('/brokers')
        .set({Authorization: user.token})
        .send({
          name: 'Test broker name',
          phoneNumber: '+99655555000',
          mc: number,
          description: 'Test broker description',
          companiesContract: carriers[0]._id.toString()
        });

      await expect(res.statusCode).toBe(200);
      await expect(res.body.name).toBe('Test broker name');
      await expect(res.body.phoneNumber).toEqual(['+99655555000']);
      await expect(res.body.mc).toBe(number.toString());
      await expect(res.body.description).toBe('Test broker description');
      await expect(res.body.companiesContract).toEqual([carriers[0]._id.toString()]);
      broker = res.body;
    });
  };

  describe('getting of all brokers', () => {

    getUser('user@gmail.com', 'user');

    it('should return an array of all brokers', async () => {
      const res = await request(app)
        .get('/brokers')
        .set({Authorization: user.token});
      await expect(res.statusCode).toBe(200);
    });
  });

  describe('create a new broker', () => {
    createBroker();
  });

  describe('edit broker', () => {
    getUser('user@gmail.com', 'user');
    getCarriers();
    getBrokers();

    it('should edit broker', async () => {
      const res = await request(app)
        .put('/brokers/' + brokers[0]._id.toString())
        .set({Authorization: user.token})
        .send({
          name: 'Changed test broker name',
          phoneNumber: '+99655555001',
          mc: 'Changed Test broker mc',
          description: 'Changed Test broker description',
          companiesContract: carriers[1]._id.toString()
        });

      await expect(res.statusCode).toBe(200);
      await expect(res.body.name).toBe('Changed test broker name');
      await expect(res.body.phoneNumber).toEqual(['+99655555001']);
      await expect(res.body.mc).toBe('Changed Test broker mc');
      await expect(res.body.description).toBe('Changed Test broker description');
      await expect(res.body.companiesContract).toEqual([carriers[1]._id.toString()]);
    });
  });

  describe('delete broker', () => {
    getUser('user@gmail.com', 'user');
    getCarriers();
    getBrokers();

    it('should delete broker', async () => {
      const res = await request(app)
        .delete('/brokers/' + brokers[0]._id.toString())
        .set({Authorization: user.token});

      await expect(res.statusCode).toBe(200);
    });
  });

});

afterAll(() => mongoose.disconnect());


