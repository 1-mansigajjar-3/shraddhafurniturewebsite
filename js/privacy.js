(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.policy-toc a')
  );
  if (!links.length) return;

  var headings = links.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var index = headings.indexOf(entry.target);
        links.forEach(function (link) {
          link.classList.remove('on');
        });
        if (index > -1) links[index].classList.add('on');
      });
    },
    { rootMargin: '-90px 0px -70% 0px' }
  );

  headings.forEach(function (heading) {
    if (heading) observer.observe(heading);
  });
})();