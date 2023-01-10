const mongoose = require('mongoose');
const request = require('supertest');
const app  = require("../index");

let uniqueEmail = new Date().valueOf().toString().slice(9)*1;
let uniquePhoneNumber = new Date().valueOf().toString().slice(2)*1;

describe('Testing \'users\' route', () => {
  let admin = null;
  let dispatcher = null;

  const getUser = (email, password) => {
    it('user should successfully login', async () => {
      const res = await request(app)
        .post('/users/sessions')
        .send({email, password});
      expect(res.statusCode).toBe(200);
      admin = res.body;
    });
  };

  const getDispatchers = () => {
    getUser('admin@gmail.com', 'admin');
    it('user should successfully login', async () => {
      const res = await request(app)
        .get('/users')
        .set({Authorization: admin.token});
      expect(res.statusCode).toBe(200);
      dispatcher= res.body.find(dispatcher => dispatcher.email === 'user@gmail.com');
    });
  };


  describe('test of user login', () => {
    it('user should successfully login', async () => {
      const res = await request(app)
        .post('/users/sessions')
        .send({
          email: 'admin@gmail.com',
          password: 'admin',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.displayName).toBe('Admin');
      admin = res.body;
    });
  });

  describe('getting of all users', () => {
    getUser('admin@gmail.com', 'admin');
    it('should get array of all users', async () => {
      const res = await request(app)
        .get('/users')
        .set({Authorization: admin.token});
      expect(res.statusCode).toBe(200);
    })
  });

  describe('getting of all dispatchers', () => {
    getUser('admin@gmail.com', 'admin');
    it('should get array of all dispatchers', async () => {
      const res = await request(app)
        .get('/users/dispatchers')
        .set({Authorization: admin.token});
      expect(res.statusCode).toBe(200);
      res.body.forEach(dispatcher => {
        expect(dispatcher.role).toBe("user");
      });
      dispatcher = res.body.find(user => user.displayName === "User");
    })
  });

  describe('save new user', () => {
    it('should save new user on db', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          email: `user${uniqueEmail}@gmail.com`,
          password: "test",
          displayName: "NewUser",
          phoneNumber: `+3${uniquePhoneNumber}`,
          role: "user",
          isWorking: "true",
          telegramId: 11
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.displayName).toBe("NewUser");
    });
  });

  describe('change dispatcher status', () => {
    getDispatchers();
    it('should change \'isWorking\' to false', async () => {
      const res = await request(app)
        .put('/users/?isWorking=false')
        .send(dispatcher)
        .set({Authorization: admin.token});
      expect(res.statusCode).toBe(200);
      expect(res.body.isWorking).toBe('disabled');
    });
  });

});

afterAll(() => mongoose.disconnect());
