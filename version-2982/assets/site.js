(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    ready(function () {
        var toggle = document.querySelector('.menu-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                var open = mobileNav.classList.toggle('open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        var prev = document.querySelector('.hero-arrow.prev');
        var next = document.querySelector('.hero-arrow.next');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function startHero() {
            if (timer || slides.length < 2) {
                return;
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function resetHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
            startHero();
        }

        if (slides.length) {
            showSlide(0);
            startHero();
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                resetHero();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                resetHero();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                resetHero();
            });
        });

        Array.prototype.slice.call(document.querySelectorAll('.filter-scope')).forEach(function (scope) {
            var search = scope.querySelector('.js-search');
            var type = scope.querySelector('.js-type-filter');
            var year = scope.querySelector('.js-year-filter');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-card'));
            var empty = scope.querySelector('.empty-state');

            function applyFilter() {
                var query = normalize(search ? search.value : '');
                var typeValue = normalize(type ? type.value : '');
                var yearValue = normalize(year ? year.value : '');
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-tags')
                    ].join(' '));
                    var cardType = normalize(card.getAttribute('data-type'));
                    var cardYear = normalize(card.getAttribute('data-year'));
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchType = !typeValue || cardType.indexOf(typeValue) !== -1;
                    var matchYear = !yearValue || cardYear === yearValue;
                    var match = matchQuery && matchType && matchYear;
                    card.hidden = !match;
                    if (match) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            [search, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', applyFilter);
                    control.addEventListener('change', applyFilter);
                }
            });

            if (search) {
                var params = new URLSearchParams(window.location.search);
                var q = params.get('q');
                if (q) {
                    search.value = q;
                    applyFilter();
                }
            }
        });
    });
})();
