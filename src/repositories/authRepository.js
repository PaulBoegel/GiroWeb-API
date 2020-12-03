const { MongoClient } = require('mongodb');

function AuthRepository(dbConfig) {
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

  async function update(updatedObj) {
    const { machineId, ...newData } = updatedObj;
    return db
      .collection('authentication')
      .updateOne({ machineId }, { $set: { ...newData } });
  }

  async function get(query, projection) {
    const result = db
      .collection('authentication')
      .find(query)
      .project(projection);
    return result.toArray();
  }

  async function count(query) {
    return db.collection('authentication').find(query).count();
  }

  return { connect, update, get, count };
}

module.exports = AuthRepository;
