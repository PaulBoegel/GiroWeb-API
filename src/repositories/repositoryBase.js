const { processenv } = require('processenv');
const { MongoClient } = require('mongodb');

function RepositoryBase() {
  const host = processenv('DB_HOST');
  const port = processenv('DB_PORT');
  const dbName = processenv('DB_NAME');
  const url = `mongodb://${host}:${port}`;
  let db;

  const repository = {
    connect() {
      return new Promise((resolve, reject) => {
        MongoClient.connect(
          url,
          {
            useUnifiedTopology: true,
            poolSize: process.env.DB_POO_SIZE,
          },
          (err, client) => {
            if (err) throw reject(err);
            this.db = client.db(dbName);
            resolve(true);
          }
        );
      });
    },
  };

  Object.defineProperty(repository, 'db', {
    value: db,
    writable: true,
    enumerable: false,
    configurable: false,
  });
  return repository;
}

module.exports = RepositoryBase;
