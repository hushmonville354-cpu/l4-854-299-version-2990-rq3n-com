(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        show(0);
        setInterval(function () {
            show(current + 1);
        }, 5500);
    }

    function setupFilters() {
        Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]')).forEach(function (panel) {
            var scopeName = panel.getAttribute('data-filter-panel');
            var scope = document.querySelector('[data-filter-scope="' + scopeName + '"]');
            if (!scope) {
                return;
            }
            var input = panel.querySelector('[data-search-input]');
            var typeSelect = panel.querySelector('[data-type-select]');
            var yearSelect = panel.querySelector('[data-year-select]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
            var empty = document.querySelector('[data-empty-for="' + scopeName + '"]');
            function apply() {
                var keyword = normalize(input ? input.value : '');
                var type = normalize(typeSelect ? typeSelect.value : '');
                var year = normalize(yearSelect ? yearSelect.value : '');
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-tags')
                    ].join(' '));
                    var matchedKeyword = !keyword || text.indexOf(keyword) >= 0;
                    var matchedType = !type || normalize(card.getAttribute('data-type')) === type;
                    var matchedYear = !year || normalize(card.getAttribute('data-year')) === year;
                    var showCard = matchedKeyword && matchedType && matchedYear;
                    card.style.display = showCard ? '' : 'none';
                    if (showCard) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.style.display = visible ? 'none' : 'block';
                }
            }
            [input, typeSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    function initPlayer(sourceUrl) {
        var video = document.getElementById('moviePlayer');
        var cover = document.getElementById('playCover');
        if (!video || !sourceUrl) {
            return;
        }
        var attached = false;
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
        }
        function play() {
            attach();
            if (cover) {
                cover.classList.add('hidden');
            }
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('hidden');
            }
        });
    }

    window.initPlayer = initPlayer;

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
