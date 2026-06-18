(function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');
  var data = window.SEARCH_MOVIES || [];

  if (!form || !input || !results || !summary) {
    return;
  }

  function getQuery() {
    return new URLSearchParams(window.location.search).get('q') || '';
  }

  function createCard(item) {
    return [
      '<article class="movie-card">',
      '  <a class="movie-card-image" href="' + item.href + '" aria-label="' + escapeHtml(item.title) + '">',
      '    <img src="' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '    <span class="movie-play-icon">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-card-meta">' + escapeHtml(item.meta) + '</div>',
      '    <h3><a href="' + item.href + '">' + escapeHtml(item.title) + '</a></h3>',
      '    <p>' + escapeHtml(item.desc) + '</p>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function render(query) {
    var keyword = query.trim().toLowerCase();
    input.value = query;

    if (!keyword) {
      summary.textContent = '输入关键词开始搜索';
      results.innerHTML = '';
      return;
    }

    var matched = data.filter(function (item) {
      return item.text.toLowerCase().indexOf(keyword) !== -1;
    }).slice(0, 96);

    summary.textContent = matched.length ? '为你找到相关影片' : '没有找到相关影片';
    results.innerHTML = matched.map(createCard).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var query = input.value.trim();
    var url = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
    window.history.replaceState(null, '', url);
    render(query);
  });

  render(getQuery());
})();
