(function () {
  function setupMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var trigger = document.querySelector(options.triggerSelector);
    var source = options.source;
    var hlsInstance = null;
    var sourceReady = false;
    var pendingPlay = false;

    if (!video || !source) {
      return;
    }

    function hideTrigger() {
      if (trigger) {
        trigger.classList.add('is-hidden');
      }
    }

    function attachSource() {
      if (sourceReady) {
        return;
      }
      sourceReady = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (pendingPlay) {
            video.play().catch(function () {});
          }
        });
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      pendingPlay = true;
      hideTrigger();
      video.setAttribute('controls', 'controls');
      attachSource();
      video.play().catch(function () {});
    }

    if (trigger) {
      trigger.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', hideTrigger);

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
