if ('serviceWorker' in navigator) {
  //.register('./service-worker.js', { scope: './' })
  navigator.serviceWorker
    .register('./service-worker.js', { scope: '/' })
    .then(function (registration) {
      console.log("Service Worker Registered");
    })
    .catch(function (err) {
      console.log("Service Worker Failed to Register", err);
    })

}