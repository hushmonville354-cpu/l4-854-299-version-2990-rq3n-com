(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function text(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = all('[data-hero-slide]', root);
        var dots = all('[data-hero-dot]', root);
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
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

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot') || 0));
                start();
            });
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function yearMatch(rule, year) {
        var number = Number(year || 0);
        if (rule === 'all') {
            return true;
        }
        if (rule === 'before-2000') {
            return number < 2000;
        }
        if (rule.indexOf('-') > -1) {
            var parts = rule.split('-').map(Number);
            return number >= parts[0] && number <= parts[1];
        }
        return String(number) === rule;
    }

    function setupFilters() {
        all('[data-filter-panel]').forEach(function (panel) {
            var section = panel.closest('.content-section') || document;
            var list = section.querySelector('[data-list-filter]');
            if (!list) {
                return;
            }
            var input = panel.querySelector('[data-filter-input]');
            var type = panel.querySelector('[data-filter-type]');
            var year = panel.querySelector('[data-filter-year]');
            var cards = all('[data-card]', list);

            if (input && input.hasAttribute('data-query-from-url')) {
                var param = input.getAttribute('data-query-from-url');
                var query = new URLSearchParams(window.location.search).get(param);
                if (query) {
                    input.value = query;
                }
            }

            function apply() {
                var keyword = text(input && input.value);
                var typeRule = type ? type.value : 'all';
                var yearRule = year ? year.value : 'all';

                cards.forEach(function (card) {
                    var haystack = text(card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta'));
                    var cardType = card.getAttribute('data-type') || '';
                    var cardYear = card.getAttribute('data-year') || '';
                    var okKeyword = !keyword || haystack.indexOf(keyword) > -1;
                    var okType = typeRule === 'all' || cardType === typeRule;
                    var okYear = yearMatch(yearRule, cardYear);
                    card.classList.toggle('is-hidden', !(okKeyword && okType && okYear));
                });
            }

            [input, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });

            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupHero();
        setupFilters();
    });
}());
