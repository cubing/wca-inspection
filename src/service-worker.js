// From https://github.com/mozilla/serviceworker-cookbook/blob/f724cb1ac8c6fe0a65b462ecfa1f9495cc4320d8/strategy-network-or-cache/index.js
const CACHE = "network-or-cache";

// On install, cache some resource.
self.addEventListener("install", (evt) => {
  console.log("The service worker is being installed.");
  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener("fetch", (evt) => {
  // Try network and if it fails, go for the cached copy.
  evt.respondWith(
    fromNetwork(evt.request, 400).catch(() => fromCache(evt.request)),
  );
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches
    .open(CACHE)
    .then((cache) =>
      cache.addAll([
        "./",
        "./style.css",
        "./wca-inspection.js",
        "./lib/digital-7-mono.timer.woff2",
        "./lib/digital-7.timer.woff2",
        "./lib/fastclick.js",
      ]),
    );
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
  return new Promise((fulfill, reject) => {
    // Reject in case of timeout.
    const timeoutId = setTimeout(reject, timeout);
    // Fulfill in case of success.
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      fulfill(response);
      // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches
    .open(CACHE)
    .then((cache) =>
      cache
        .match(request, { ignoreSearch: true })
        .then((matching) => matching || Promise.reject("no-match")),
    );
}
