require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
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

    test('returns magicItems', async() => {

      const expectation = [
        {
          cursed: false,
          effect: 'A balde roughly forged with special metals. It lets off heat as if it was just taken out of the forge.',
          id: 1,
          level: 6,
          name: 'Sword of Embers',
          owner_id: 1,
          type: 'Sword',
        },
        {
          cursed: false,
          effect: 'A desicated lizard preserved with pungent herbs. It seems to take on curses easily.',
          id: 2,
          level: 2,
          name: 'Lizard of Warding',
          owner_id: 1,
          type: 'Trinket',
        },
        {
          cursed: true,
          effect: 'A shield that is not so lucky. Attacks seem to slip right past the shield and onto the arm.',
          id: 3,
          level: 3,
          name: 'Lucky Shield',
          owner_id: 1,
          type: 'Shield',
        },
        {
          cursed: false,
          effect: 'A silver ring with a feather pattern. Makes you feel much lighter, and fall slower.',
          id: 4,
          level: 3,
          name: 'Ring of Feathers',
          owner_id: 1,
          type: 'Ring',
        },
        {
          cursed: false,
          effect: 'A set of bracers made of a reflective, opalescent metal. They hum with an innate power, and often lance out bolts of lightning.',
          id: 5,
          level: 9,
          name: 'Bracers of Storms',
          owner_id: 1,
          type: 'Bracers',
        },
        {
          cursed: true,
          effect: 'This bag is bigger on the inside than it is on the outside. Any object that can fit inside the mouth of the bag are stored inside, but cannot be retrieved.',
          id: 6,
          level: 3,
          name: 'Bag of Storing',
          owner_id: 1,
          type: 'Misc',
        },
        {
          cursed: true,
          effect: 'A leather chord with a large amount of keys strung upon it. Any key that is used from this necklace will jam and permanently break any lock attempted to be used in.',
          id: 7,
          level: 7,
          name: 'Necklace of Keys',
          owner_id: 1,
          type: 'Necklace',
        },
        {
          cursed: true,
          effect: 'A copy of the master ring. Super cursed.',
          id: 8,
          level: 14,
          name: 'The Second Ring',
          owner_id: 1,
          type: 'Ring',
        }
      ];

      const data = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns a single item by id', async() => {

      const expectation = {
        cursed: false,
        effect: 'A balde roughly forged with special metals. It lets off heat as if it was just taken out of the forge.',
        id: 1,
        level: 6,
        name: 'Sword of Embers',
        type: 'Sword',
        owner_id: 1,
      };

      const data = await fakeRequest(app)
        .get('/magicItems/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns all types of items', async() => {
      const data = await fakeRequest(app)
        .get('/types')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body.length).toBeGreaterThan(0);
    });
  });
});
