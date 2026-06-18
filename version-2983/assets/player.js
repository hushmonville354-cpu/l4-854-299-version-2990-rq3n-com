(function () {
    function setupPlayer(shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('.player-overlay');
        var url = shell.getAttribute('data-video-url');
        var ready = false;
        var hls = null;

        if (!video || !url) {
            return;
        }

        function play() {
            shell.classList.add('is-playing');
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }

        function attach() {
            if (ready) {
                play();
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.addEventListener('loadedmetadata', play, { once: true });
                video.load();
                play();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, play);
                return;
            }
            video.src = url;
            video.load();
            play();
        }

        if (button) {
            button.addEventListener('click', attach);
        }

        video.addEventListener('click', function () {
            if (!ready) {
                attach();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-video-url]')).forEach(setupPlayer);
    });
}());
