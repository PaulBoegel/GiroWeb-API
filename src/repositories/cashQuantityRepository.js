const { MongoClient } = require('mongodb');

function CashQuantityRepository(dbConfig) {
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

  async function get(query, projection, limit) {
    let result = db
      .collection('cashQuantities')
      .find(query, { fields: projection });

    if (limit > 0) {
      result = result.limit(limit);
    }

    result = await result.toArray();

    return result;
  }

  async function add(newCashQuantity) {
    const key = {
      serviceKey: newCashQuantity.serviceKey,
      machineId: newCashQuantity.machineId,
    };

    await db.collection('cashQuantities').updateOne(
      key,
      {
        $addToSet: {
          cashQuantities: { $each: [newCashQuantity.cashQuantities] },
        },
      },
      { upsert: true }
    );
  }

  return { connect, get, add };
}

module.exports = CashQuantityRepository;
