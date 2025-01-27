// Without getAllRecords, reading in reserve order requires the use of a cursor.
// This means that it has to be done one item at a time.
export function readInBatchesReverse(db, batchSize) {
  const transaction = db.transaction("features", "readonly");
  const store = transaction.objectStore("features");

  return new Promise(resolve => {
    store.openCursor(null, "prev").onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        console.log(`Read one item backward`, cursor.key, cursor.value);
        cursor.continue();
      } else {
        console.log("Reverse read done");
        resolve();
      }
    };
  });
}
