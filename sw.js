// Kill-switch service worker: this site no longer uses a service worker.
// Any browser with a stale SW registered from an earlier version of the
// site will pick this up, wipe its caches, unregister itself, and reload
// so every tab goes straight to the network from then on.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      })
  );
});
