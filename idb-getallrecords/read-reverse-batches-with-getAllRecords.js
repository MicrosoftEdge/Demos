export async function readInBatchesReverse(db, batchSize) {
  const transaction = db.transaction("features", "readonly");
  const store = transaction.objectStore("features");

  function getNextBatch(lastRecord) {
    return new Promise((resolve) => {
      const query = lastRecord
        ? IDBKeyRange.upperBound(lastRecord.key, true)
        : null;
      store.getAllRecords({
        query,
        count: batchSize,
        direction: "prev",
      }).onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  let lastRecord = null;
  while (true) {
    const records = await getNextBatch(lastRecord);
    if (records.length === batchSize) {
      // There could be more records, set a starting point for the next iteration.
      lastRecord = records.at(-1);
      console.log(`Read ${batchSize} records`, records);
    } else {
      break;
    }
  }
}
