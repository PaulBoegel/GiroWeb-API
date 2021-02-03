const RepositoryBase = require('./repositoryBase');

function AuthRepository() {
  async function update(updatedObj) {
    const { machineId, ...newData } = updatedObj;
    return this.db
      .collection('authentication')
      .updateOne({ machineId }, { $set: { ...newData } });
  }

  async function get(query, projection) {
    const result = this.db
      .collection('authentication')
      .find(query)
      .project(projection);
    return result.toArray();
  }

  async function count(query) {
    return this.db.collection('authentication').find(query).count();
  }

  return Object.setPrototypeOf(
    Object.assign(RepositoryBase(), {
      update,
      get,
      count,
    }),
    RepositoryBase
  );
}

module.exports = AuthRepository;
