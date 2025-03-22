// assets/js/search.js
async function loadSearchIndex() {
  const res = await fetch('/index.json');
  const pages = await res.json();

  const idx = lunr(function () {
    this.ref('permalink');
    this.field('title');
    this.field('content');

    pages.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  const searchInput = document.getElementById('searchInput');
  const resultsList = document.getElementById('resultsList');

  searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim();
    resultsList.innerHTML = '';

    if (query.length < 2) return;

    const results = idx.search(query);

    results.forEach(result => {
      const item = pages.find(p => p.permalink === result.ref);
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.permalink}"><strong>${item.title}</strong><br><small>${item.summary}</small></a>`;
      resultsList.appendChild(li);
    });
  });
}

document.addEventListener('DOMContentLoaded', loadSearchIndex);