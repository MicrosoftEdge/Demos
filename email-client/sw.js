// This demo is about protocol handling only. We don't need to handle offline scenarios.
// So we're only using the most minimal service-worker so that the app can be installed.
self.addEventListener('fetch', event => {});
