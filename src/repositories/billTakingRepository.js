const { MongoClient } = require('mongodb');

function BillTakingRepository(dbConfig) {
  const { dbName, host, port } = dbConfig;
  const url = `mongodb://${host}:${port}`;
  let db;

  function connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        {
          useUnifiedTopology: true,
          poolSize: dbConfig.poolSize,
        },
        (err, client) => {
          if (err) throw reject(err);
          db = client.db(dbName);
          resolve(true);
        }
      );
    });
  }


  async function add({serviceKey, machineId, cashQuantities}) {
    const key = {
      serviceKey,
      machineId
    };

    await db.collection('billTaking').updateOne(
      key,
      {
        $addToSet: {
          cashQuantities: { $each: cashQuantities },
        },
      },
      { upsert: true }
    );
  }

  async function updateQuantities({serviceKey, machineId, cashQuantities}) {
    const updatePromises = cashQuantities.map(quantity => {
      const keys = {
        serviceKey,
        machineId,
        cashQuantities: { $elemMatch: {date: quantity.date, time: quantity.time }}
      }
      return db.collection('billTaking').updateOne(
        keys, {$set: {"cashQuantities.$.send": true}}
      )
    })
    await Promise.all(updatePromises);
  }

  async function get(query, projection){
    const result = await db.collection('billTaking').find(query).project(projection);
    return result.toArray();
  }

  return {connect, add, updateQuantities, get}
}

module.exports = BillTakingRepository