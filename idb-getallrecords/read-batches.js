export async function readInBatches(db, batchSize) {
  const transaction = db.transaction("features", "readonly");
  const store = transaction.objectStore("features");

  function getAllKeys(range) {
    return new Promise((resolve) => {
      store.getAllKeys(range, batchSize).onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  function getAllValues(range) {
    return new Promise((resolve) => {
      store.getAll(range, batchSize).onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  let range = null;

  while (true) {
    const [keys, values] = await Promise.all([
      getAllKeys(range),
      getAllValues(range),
    ]);
    if (keys && values && values.length === batchSize) {
      // There could be more records, set a starting range for next iteration.
      range = IDBKeyRange.lowerBound(keys.at(-1), true);
      console.log(`Read ${batchSize} records`, keys, values);
    } else {
      break;
    }
  }
}
