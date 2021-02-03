const RepositoryBase = require('./repositoryBase');

function BillStockRepository() {
  async function get(query, projection, limit) {
    let result = this.db
      .collection('billStock')
      .find(query, { fields: projection });

    if (limit > 0) {
      result = result.limit(limit);
    }

    result = await result.toArray();

    return result;
  }

  async function add({ serviceKey, machineId, cashQuantities }) {
    const key = {
      serviceKey,
      machineId,
    };

    await this.db.collection('billStock').updateOne(
      key,
      {
        $addToSet: {
          cashQuantities: { $each: cashQuantities },
        },
      },
      { upsert: true }
    );
  }
  return Object.setPrototypeOf(
    Object.assign(RepositoryBase(), { get, add }),
    RepositoryBase
  );
}

module.exports = BillStockRepository;
