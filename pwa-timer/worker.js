addEventListener('message', (e) => {
  const { reminder, timeQty, timeUnit, timeMs } = e.data;
  setTimeout(() => {
    postMessage('timer ended');
  }, timeMs);
});
