const RepositoryBase = require('./repositoryBase');

function BillAssumtionRepository() {
  async function create({ serviceKey, machineId }) {
    const values = [500, 1000, 2000, 5000];
    const result = await this.db.collection('billAssumtion').insert({
      serviceKey,
      machineId,
      total: 0,
      detail: values.map((value) => {
        return { value, quantity: 0, total: 0 };
      }),
    });
    return result.nInserted;
  }

  async function add({ serviceKey, machineId, value }) {
    const key = {
      serviceKey,
      machineId,
    };
    const exists = await this.db
      .collection('billAssumtion')
      .find({ serviceKey, machineId })
      .count();
    if (exists === 0) await create.call(this, key);
    const result = await this.db.collection('billAssumtion').updateOne(
      {
        serviceKey,
        machineId,
        'detail.value': value,
      },
      {
        $inc: { total: value, 'detail.$.quantity': 1, 'detail.$.total': value },
      },
      { upsert: true }
    );
    return result.matchedCount;
  }

  async function get(query, projection) {
    const result = await this.db
      .collection('billAssumtion')
      .find(query)
      .project(projection);
    return result.toArray();
  }

  return Object.setPrototypeOf(
    Object.assign(RepositoryBase(), { create, add, get }),
    RepositoryBase
  );
}

module.exports = BillAssumtionRepository;
