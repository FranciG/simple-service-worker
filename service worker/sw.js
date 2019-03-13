console.log('Hello from sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const cacheName = 'cached1';
//array of the files we wanna cache
const cacheAssets = [
  'index.html',
  'products.html',
  'style.css',
  'sw.js',
  'liikenne.jpg',
  'logo.png',
  '/images/icons/icon-72x72.png'
];

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil( //We take e perimeter, waituntil says to the browser to wait until sw finnishes.
    caches
      .open(cacheName) //opens a cache, pasing our cache name defined above, cache1
      .then(cache => { //takes the cache from the array cachename
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets); //Taking the cache object and using the method addall
      })
      .then(() => self.skipWaiting())
  );
}); //Now the files are on cache

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches, if we had other cached versions
  e.waitUntil(
    caches.keys().then(cacheNames => { //We loop though the caches
      return Promise.all(
        cacheNames.map(cache => { //map though the catches
          if (cache !== cacheName) { //If the cache is not the one we are currently using
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache); //it is deleted
          }
        })
      );
    })
  );
});

// Call Fetch Event for offline viewing 
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  //If ther is no connection, loads from the cache
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

