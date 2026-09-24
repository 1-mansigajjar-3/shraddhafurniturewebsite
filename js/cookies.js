(function () {
  'use strict';

  var KEY = 'cookie-consent';          // saved value: "accepted" or "declined"
  var banner  = document.getElementById('cookieBanner');
  var accept  = document.getElementById('cookieAccept');
  var decline = document.getElementById('cookieDecline');
  var reopen  = document.getElementById('cookieSettings');

  if (!banner || !accept || !decline) return;

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked */ }
  }

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  // Put analytics or other optional scripts here.
  // This runs ONLY after the visitor clicks Accept.
  function enableOptionalCookies() {
    // Example for Google Analytics (replace G-XXXXXXX with your ID):
    // var s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    // document.head.appendChild(s);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){ dataLayer.push(arguments); }
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXX');
  }

  accept.addEventListener('click', function () {
    saveChoice('accepted');
    hideBanner();
    enableOptionalCookies();
  });

  decline.addEventListener('click', function () {
    saveChoice('declined');
    hideBanner();
  });

  if (reopen) {
    reopen.addEventListener('click', function (e) {
      e.preventDefault();
      showBanner();
      accept.focus();
    });
  }

  // On page load
  var choice = getChoice();
  if (choice === 'accepted') {
    enableOptionalCookies();
  } else if (choice !== 'declined') {
    showBanner();
  }
})();