const { createCashQuantity } = require('../entities/cash-quantity');

function BillStockRepository({ makeDb }) {
  async function get(query, projection) {
    if (!query || Object.entries(query).length === 0) {
      throw new Error('Query is empty.');
    }
    const db = await makeDb();
    const billStockArray = await db
      .collection('billStock')
      .find(query)
      .project(projection)
      .toArray();

    return billStockArray.map((billStock) =>
      createCashQuantity(billStock)
    );
  }

  async function add(billStockData) {
    const db = await makeDb();
    const billStock = createCashQuantity(billStockData);
    const keys = billStock.getKeys();
    const data = billStock.getData();
    const { ops } = await db.collection('billStock').insertOne({
      ...keys,
      ...data,
    });
    const { _id: id, ...result } = ops[0];
    return createCashQuantity(result);
  }
  return { get, add };
}

module.exports = BillStockRepository;
