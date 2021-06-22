const client = require('../lib/client');
// import our seed data:
const magicItems = require('./magicItems.js');
const usersData = require('./users.js');
const typesData = require('./types.js');
const { getEmoji } = require('../lib/emoji.js');
const { getTypeIdByName } = require('../lib/utils.js');


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

    const typeResponses = await Promise.all(
      typesData.map(type => {
        return client.query(`
          INSERT INTO types (name)
          VALUES ($1)
          RETURNING *;
        `,
        [type.name]);
      })
    );

    const types = typeResponses.map(response => {
      return response.rows[0];
    });

    await Promise.all(
      magicItems.map(item => {
        const typeId = getTypeIdByName(types, item.type);

        return client.query(`
                    INSERT INTO magicItems (name, type_id, level, cursed, effect, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [item.name, typeId, item.level, item.cursed, item.effect, user.id]);
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
