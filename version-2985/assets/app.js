(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
            var prev = carousel.querySelector("[data-hero-prev]");
            var next = carousel.querySelector("[data-hero-next]");
            var current = 0;
            var timer;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function restart() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    restart();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    restart();
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                    restart();
                });
            });

            show(0);
            restart();
        });

        document.querySelectorAll(".tab-buttons").forEach(function (group) {
            var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-tab-target]"));
            var scope = group.parentElement;
            var panels = Array.prototype.slice.call(scope.querySelectorAll("[data-tab-panel]"));

            function activate(name) {
                buttons.forEach(function (button) {
                    button.classList.toggle("active", button.getAttribute("data-tab-target") === name);
                });
                panels.forEach(function (panel) {
                    panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === name);
                });
            }

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    activate(button.getAttribute("data-tab-target"));
                });
            });

            if (buttons[0]) {
                activate(buttons[0].getAttribute("data-tab-target"));
            }
        });

        document.querySelectorAll("[data-filter-input]").forEach(function (input) {
            var root = input.closest(".page-shell") || document;
            var grid = root.querySelector("[data-filter-grid]");
            var count = root.querySelector("[data-filter-count]");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .mini-card, .rank-row"));
            var params = new URLSearchParams(window.location.search);
            var initial = params.get("q");
            if (initial && !input.value) {
                input.value = initial;
            }

            function apply() {
                var query = normalize(input.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-year"),
                        card.textContent
                    ].join(" "));
                    var matched = !query || haystack.indexOf(query) !== -1;
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = visible;
                }
            }

            input.addEventListener("input", apply);
            apply();
        });
    });
})();

function initMoviePlayer(source) {
    var video = document.getElementById("movie-player");
    var overlay = document.getElementById("play-overlay");
    var hlsInstance = null;
    var prepared = false;

    if (!video || !overlay || !source) {
        return;
    }

    function prepare() {
        if (prepared) {
            return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function play() {
        prepare();
        overlay.classList.add("hidden");
        var result = video.play();
        if (result && typeof result.catch === "function") {
            result.catch(function () {
                overlay.classList.remove("hidden");
            });
        }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("play", function () {
        overlay.classList.add("hidden");
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
