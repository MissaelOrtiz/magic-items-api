const client = require('../lib/client');
// import our seed data:
const magicItems = require('./magicItems.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      magicItems.map(item => {
        return client.query(`
                    INSERT INTO magicItems (name, type, level, cursed, effect, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [item.name, item.type, item.level, item.cursed, item.effect, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
