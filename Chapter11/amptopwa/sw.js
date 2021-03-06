self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('amptopwa-cache').then(cache =>
      {
        return cache.addAll(['/ch11/amptopwa/index.html', '/ch11/amptopwa/pwa.js', '/ch11/amptopwa/style.css', '/ch11/amptopwa/manifest.json'])
      })
  )
});

self.addEventListener('fetch', e => {
  console.log('requested: ',e.request.url);
  var url = new URL(e.request.url);
  console.log(url.pathname);
  if(url.pathname.split('/').pop().endsWith('amp.html')) {

    e.respondWith(
      fetch(e.request).then(response => {
        var init = {
          status:     200,
          statusText: "OK",
          headers: {'Content-Type': 'text/html'}
        };

        return response.text().then(body => {
          body = body.replace('</body>', '<script src="extra.js"></script></body>');
          return new Response(body, init);
        });
      })
    );
  }else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});