const { MongoClient } = require('mongodb');

function BillStockRepository(dbConfig) {
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
      .collection('billStock')
      .find(query, { fields: projection });

    if (limit > 0) {
      result = result.limit(limit);
    }

    result = await result.toArray();

    return result;
  }

  async function add(newBillStock) {
    const key = {
      serviceKey: newBillStock.serviceKey,
      machineId: newBillStock.machineId,
    };

    await db.collection('billStock').updateOne(
      key,
      {
        $addToSet: {
          cashQuantities: { $each: newBillStock.cashQuantities },
        },
      },
      { upsert: true }
    );
  }

  return { connect, get, add };
}

module.exports = BillStockRepository;
