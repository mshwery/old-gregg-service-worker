(function() {
  'use strict';
  
  if (!('Notification' in window)) {
    alert('Sorry, this browser doesn\'t support desktop notifications');
    return;
  }

  var icon = './old-gregg-avatar.png';
  var title = 'Old Gregg';

  var quotes = [
    'Hi there.',
    'Pleased to meetcha',
    'What do ya think of me?',
    'Make an assessment',
    'I got all things that are good.',
    'Easy now fuzzy little man peach.',
    'I\'m Old Gregg!',
    'Bailey\'s. Mmm... creamy. Soft creamy beige.'
  ];

  function sendMessage(message) {
    // This wraps the message posting/response in a promise, which will resolve if the response doesn't
    // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
    // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
    // a convenient wrapper.
    return new Promise(function(resolve, reject) {
      var messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };

      navigator.serviceWorker.controller.postMessage(message);
    });
  }

  function getQuote() {
    var quote = quotes.shift();

    if (!quote) {
      return;
    }
    
    sendMessage({
      title: title,
      body: quote,
      icon: icon
    });

    var time = Math.floor(Math.random() * 10000) + 2000;
    setTimeout(function() {
      getQuote();
    }, time);
  }

  window.addEventListener('load', function() {
    // Check that service workers are supported, if so, progressively
    // enhance and add push messaging support, otherwise continue without it.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(function() { return navigator.serviceWorker.ready; })
        .then(function() {
          Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
              getQuote();
            }
          });
        });
    } else {
      console.log('Service workers aren\'t supported in this browser.');
    }
  });
})();