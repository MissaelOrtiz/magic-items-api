require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { getTypeIdByName } = require('../lib/utils.js');

describe('post put and delete routes', () => {
  describe('routes', () => {
    let token;
    let types;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });
      
    test('/POST magic-items creates a single magic item', async() => {
      const typeId = getTypeIdByName(types, 'Sword');

      const data = await fakeRequest(app)
        .post('/magicItems')
        .send({
          name: 'New Sword',
          type_id: typeId,
          level: 2,
          cursed: true,
          effect: 'does stuff'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const dataMagicItems = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);

      const postedMagicItem = {
        'name': 'New Sword',
        'type_id': typeId,
        'level': 2, 
        'id': 9,
        'cursed': true, 
        'effect': 'does stuff', 
        'owner_id': 1,
      };

      const newMagicItem = { 
        'name': 'New Sword',
        'type': 'Sword', 
        'level': 2, 
        'id': 9,
        'cursed': true, 
        'effect': 'does stuff', 
        'owner_id': 1,
      };
      
      // check that the post request responds with the new board game
      expect(data.body).toEqual(postedMagicItem);
      // check that the get request contians the new board game
      expect(dataMagicItems.body).toContainEqual(newMagicItem);
    });

    test('/PUT magicItems updates a single magic item', async() => {

      const typeId = getTypeIdByName(types, 'Sword');

      const data = await fakeRequest(app)
        .put('/magicItems/9')
        .send({
          name: 'New New Sword',
          type_id: typeId,
          level: 2,
          cursed: true,
          effect: 'does more stuff',
        })
        .expect('Content-Type', /json/)
        .expect(200);
  
      const dataMagicItems = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);

      const putMagicItem = {
        'name': 'New New Sword',
        'type_id': typeId, 
        'level': 2, 
        'id': 9,
        'cursed': true, 
        'effect': 'does more stuff', 
        'owner_id': 1,
      };

      const newMagicItem = { 
        'name': 'New New Sword',
        'type': 'Sword', 
        'level': 2, 
        'id': 9,
        'cursed': true, 
        'effect': 'does more stuff', 
        'owner_id': 1,
      };
        
      // check that the put request responds with the new board game
      expect(data.body).toEqual(putMagicItem);
      // check that the get request contians the new board game
      expect(dataMagicItems.body).toContainEqual(newMagicItem);
    });

    test('/DELETE magicItems deletes a single magic item', async() => {

      // make a request to update the new board game
      await fakeRequest(app)
        .delete('/magicItems/9')
        .expect('Content-Type', /json/)
        .expect(200);
    
      // make a request to see all board games
      const dataMagicItems = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);
    
      const newMagicItem = { 
        'name': 'New Sword',
        'type': 'Sword', 
        'level': 2, 
        'id': 9,
        'cursed': true, 
        'effect': 'does stuff', 
        'owner_id': 1,
      };
          
      // check that the get request contians the new board game
      expect(dataMagicItems.body).not.toContainEqual(newMagicItem);
    });
  });
});