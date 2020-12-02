const { MongoClient } = require('mongodb');

function BillAssumtionRepository(dbConfig) {
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

  async function create({serviceKey, machineId}){
    const values = [500, 1000, 2000, 5000];
    const result = await db.collection('billAssumtion').insert({
      serviceKey,
      machineId,
      total: 0,
      detail: values.map(value => {return {value, quantity: 0, total:0}})
    });
    return result.nInserted;
  }

  async function add({serviceKey, machineId, value}) {
    const key = {
        serviceKey,
        machineId,
    };
    const exists = await db.collection('billAssumtion').find({serviceKey, machineId}).count();
    if(exists === 0) await create(key);
    const result = await db.collection('billAssumtion').updateOne({
    serviceKey,
    machineId,
    "detail.value": value 
  },{
    $inc: {total: value, "detail.$.quantity": 1, "detail.$.total": value},
  },
    { upsert: true }
    );
    return result.matchedCount;
  }

  async function get(query, projection){
    const result = await db.collection('billAssumtion').find(query).project(projection);
    return result.toArray();
  }

  return {connect, create, add, get}
}

module.exports = BillAssumtionRepository