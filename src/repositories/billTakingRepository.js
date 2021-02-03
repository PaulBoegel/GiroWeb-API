const RepositoryBase = require('./repositoryBase');

function BillTakingRepository() {
  async function add({ serviceKey, machineId, cashQuantities }) {
    const key = {
      serviceKey,
      machineId,
    };

    await this.db.collection('billTaking').updateOne(
      key,
      {
        $addToSet: {
          cashQuantities: { $each: cashQuantities },
        },
      },
      { upsert: true }
    );
  }

  async function updateQuantities({ serviceKey, machineId, cashQuantities }) {
    const updatePromises = cashQuantities.map((quantity) => {
      const keys = {
        serviceKey,
        machineId,
        cashQuantities: {
          $elemMatch: { date: quantity.date, time: quantity.time },
        },
      };
      return this.db
        .collection('billTaking')
        .updateOne(keys, { $set: { 'cashQuantities.$.send': true } });
    });
    await Promise.all(updatePromises);
  }

  async function get(query, projection) {
    const result = await this.db
      .collection('billTaking')
      .find(query)
      .project(projection);
    return result.toArray();
  }
  return Object.setPrototypeOf(
    Object.assign(RepositoryBase(), { add, updateQuantities, get }),
    RepositoryBase
  );
}

module.exports = BillTakingRepository;
