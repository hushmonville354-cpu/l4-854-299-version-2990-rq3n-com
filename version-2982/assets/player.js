(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));
        players.forEach(function (video) {
            var shell = video.closest('.player-shell');
            var overlay = shell ? shell.querySelector('.player-overlay') : null;
            var stream = video.getAttribute('data-stream');
            var hls = null;

            function attachStream() {
                if (!stream || video.getAttribute('data-ready') === 'true') {
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false,
                        backBufferLength: 90
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else {
                    video.src = stream;
                }

                video.setAttribute('data-ready', 'true');
                if (shell) {
                    shell.classList.add('ready');
                }
            }

            function playVideo() {
                attachStream();
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        if (shell) {
                            shell.classList.remove('ready');
                        }
                    });
                }
            }

            if (overlay) {
                overlay.addEventListener('click', playVideo);
            }

            video.addEventListener('play', function () {
                if (shell) {
                    shell.classList.add('playing');
                }
            });

            video.addEventListener('pause', function () {
                if (shell) {
                    shell.classList.remove('playing');
                    if (!video.currentTime) {
                        shell.classList.remove('ready');
                    }
                }
            });

            video.addEventListener('ended', function () {
                if (shell) {
                    shell.classList.remove('playing');
                    shell.classList.remove('ready');
                }
            });

            window.addEventListener('beforeunload', function () {
                if (hls && typeof hls.destroy === 'function') {
                    hls.destroy();
                }
            });
        });
    });
})();
