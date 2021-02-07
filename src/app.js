
/*if ('serviceWorker' in navigator) {
  //.register('./service-worker.js', { scope: './' })
  navigator.serviceWorker
    .register('./service-worker.js', { scope: '/' })
    .then(function (registration) {
      console.log("Service Worker Registered");
    })
    .catch(function (err) {
      console.log("Service Worker Failed to Register", err);
    })

}*/
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope:',  registration.scope);
  }).catch(function(error) {
    console.log('ServiceWorker registration failed:', error);
  });
}