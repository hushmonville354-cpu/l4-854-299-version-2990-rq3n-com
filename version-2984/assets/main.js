(function () {
  var searchToggle = document.querySelector('.search-toggle');
  var searchPanel = document.querySelector('.search-panel');
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function () {
      var isHidden = searchPanel.hasAttribute('hidden');
      if (isHidden) {
        searchPanel.removeAttribute('hidden');
        var input = searchPanel.querySelector('input');
        if (input) {
          input.focus();
        }
      } else {
        searchPanel.setAttribute('hidden', '');
      }
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      if (mobileNav.hasAttribute('hidden')) {
        mobileNav.removeAttribute('hidden');
        menuToggle.textContent = '×';
      } else {
        mobileNav.setAttribute('hidden', '');
        menuToggle.textContent = '☰';
      }
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        startTimer();
      });
    });

    startTimer();
  }

  var libraryGrid = document.querySelector('[data-library-grid]');
  var libraryInput = document.querySelector('[data-library-search]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));

  if (libraryGrid && libraryInput) {
    var cards = Array.prototype.slice.call(libraryGrid.querySelectorAll('.movie-card'));
    var activeFilter = '';

    function applyLibraryFilter() {
      var keyword = libraryInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesFilter = !activeFilter || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
        card.classList.toggle('is-hidden', !(matchesKeyword && matchesFilter));
      });
    }

    libraryInput.addEventListener('input', applyLibraryFilter);
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter-value') || '';
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyLibraryFilter();
      });
    });
  }
})();
