require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const magicItems =  [
  {
    id: 1,
    name: 'Sword of Embers',
    type: 'Sword',
    level: 6,
    cursed: false,
    effect: 'A balde roughly forged with special metals. It lets off heat as if it was just taken out of the forge.'
  },
  {
    id: 2,
    name: 'Lizard of Warding',
    type: 'Trinket',
    level: 2,
    cursed: false,
    effect: 'A desicated lizard preserved with pungent herbs. It seems to take on curses easily.'
  },
  {
    id: 3,
    name: 'Lucky Shield',
    type: 'Shield',
    level: 3,
    cursed: true,
    effect: 'A shield that is not so lucky. Attacks seem to slip right past the shield and onto the arm.'
  },
  {
    id: 4,
    name: 'Ring of Feathers',
    type: 'Ring',
    level: 3,
    cursed: false,
    effect: 'A silver ring with a feather pattern. Makes you feel much lighter, and fall slower.'
  },
  {
    id: 5,
    name: 'Bracers of Storms',
    type: 'Bracers',
    level: 9,
    cursed: false,
    effect: 'A set of bracers made of a reflective, opalescent metal. They hum with an innate power, and often lance out bolts of lightning.'
  },
  {
    id: 6,
    name: 'Bag of Storing',
    type: 'Misc',
    level: 3,
    cursed: true,
    effect: 'This bag is bigger on the inside than it is on the outside. Any object that can fit inside the mouth of the bag are stored inside, but cannot be retrieved.'
  },
  {
    id: 7,
    name: 'Necklace of Keys',
    type: 'Necklace',
    level: 7,
    cursed: true,
    effect: 'A leather chord with a large amount of keys strung upon it. Any key that is used from this necklace will jam and permanently break any lock attempted to be used in.'
  },
  {
    id: 8,
    name: 'The Second Ring',
    type: 'Ring',
    level: 14,
    cursed: true,
    effect: 'A copy of the master ring. Super cursed.'
  },
];
describe('post put and delete routes', () => {
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

    const magicItems =  [
      {
        id: 1,
        name: 'Sword of Embers',
        type: 'Sword',
        level: 6,
        cursed: false,
        effect: 'A balde roughly forged with special metals. It lets off heat as if it was just taken out of the forge.'
      },
      {
        id: 2,
        name: 'Lizard of Warding',
        type: 'Trinket',
        level: 2,
        cursed: false,
        effect: 'A desicated lizard preserved with pungent herbs. It seems to take on curses easily.'
      },
      {
        id: 3,
        name: 'Lucky Shield',
        type: 'Shield',
        level: 3,
        cursed: true,
        effect: 'A shield that is not so lucky. Attacks seem to slip right past the shield and onto the arm.'
      },
      {
        id: 4,
        name: 'Ring of Feathers',
        type: 'Ring',
        level: 3,
        cursed: false,
        effect: 'A silver ring with a feather pattern. Makes you feel much lighter, and fall slower.'
      },
      {
        id: 5,
        name: 'Bracers of Storms',
        type: 'Bracers',
        level: 9,
        cursed: false,
        effect: 'A set of bracers made of a reflective, opalescent metal. They hum with an innate power, and often lance out bolts of lightning.'
      },
      {
        id: 6,
        name: 'Bag of Storing',
        type: 'Misc',
        level: 3,
        cursed: true,
        effect: 'This bag is bigger on the inside than it is on the outside. Any object that can fit inside the mouth of the bag are stored inside, but cannot be retrieved.'
      },
      {
        id: 7,
        name: 'Necklace of Keys',
        type: 'Necklace',
        level: 7,
        cursed: true,
        effect: 'A leather chord with a large amount of keys strung upon it. Any key that is used from this necklace will jam and permanently break any lock attempted to be used in.'
      },
      {
        id: 8,
        name: 'The Second Ring',
        type: 'Ring',
        level: 14,
        cursed: true,
        effect: 'A copy of the master ring. Super cursed.'
      },
    ];
      
    test('/POST magic-items creates a single magic item', async() => {

      const data = await fakeRequest(app)
        .post('/magicItems')
        .send({
          name: 'new sword',
          type: 'sword',
          level: '2',
          cursed: 'true',
          effect: 'does stuff'
        })
        .expect('Content-Type', /json/)
        .expect(500);

      const dataMagicItems = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);

      const newMagicItem = { 
        'name': 'New Sword',
        'type': 'Sword', 
        'level': 2, 
        'id': 9,
        'cursed': 'true', 
        'effect': 'does stuff', 
        'owner_id': 1,
      };
      
      // check that the post request responds with the new board game
      expect(data.body).toEqual(newMagicItem);
      // check that the get request contians the new board game
      expect(dataMagicItems.body).toContainEqual(newMagicItem);
    });

    test('/PUT magicItems updates a single magic item', async() => {

      // make a request to update the new board game
      const data = await fakeRequest(app)
        .put('/magicItems/5')
        .send({
          name: 'New Bracers of Storms',
          type: 'Bracers',
          level: 10,
          cursed: 'false',
          effect: 'A set of bracers made of a reflective, opalescent metal. They hum with an innate power, and often lance out bolts of lightning. Now with more lightning!'
        })
        .expect('Content-Type', /json/)
        .expect(500);
  
      // make a request to see all board games
      const dataMagicItems = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);
  
      const newMagicItem = { 
        'name': 'New Bracers of Storms',
        'type': 'Bracers', 
        'level': 10, 
        'id': 5,
        'cursed': 'false', 
        'effect': 'A set of bracers made of a reflective, opalescent metal. They hum with an innate power, and often lance out bolts of lightning. Now with more lightning!', 
        'owner_id': 1,
      };
        
      // check that the put request responds with the new board game
      expect(data.body).toEqual(newMagicItem);
      // check that the get request contians the new board game
      expect(dataMagicItems.body).toContainEqual(newMagicItem);
    });

    test('/DELETE magicItems deletes a single magic item', async() => {

      // make a request to update the new board game
      await fakeRequest(app)
        .delete('/magicItems/5')
        .expect('Content-Type', /json/)
        .expect(200);
    
      // make a request to see all board games
      const dataMagicItems = await fakeRequest(app)
        .get('/magicItems')
        .expect('Content-Type', /json/)
        .expect(200);
    
      const newMagicItem = { 
        'name': 'New Bracers of Storms',
        'type': 'Bracers', 
        'level': 2, 
        'id': 5,
        'cursed': 'false', 
        'effect': 'A set of bracers made of a reflective, opalescent metal. They hum with an innate power, and often lance out bolts of lightning. Now with more lightning!', 
        'owner_id': 1,
      };
          
      // check that the get request contians the new board game
      expect(dataMagicItems.body).not.toContainEqual(newMagicItem);
    });
  });
});