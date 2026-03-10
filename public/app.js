const form = document.getElementById('task-form');
const statusBox = document.getElementById('status');
const resultsSection = document.getElementById('results');
const warningText = document.getElementById('warning-text');
const resultGrid = document.getElementById('result-grid');

const sectionConfig = [
  { key: 'bestMatches', title: 'Best Matches' },
  { key: 'courseMaterials', title: 'Course Materials' },
  { key: 'pastAssignments', title: 'Past Assignments' },
  { key: 'onlineSources', title: 'Online Sources' },
  { key: 'suggestedStudyPlan', title: 'Suggested Study Plan' }
];

function setStatus(message) {
  statusBox.textContent = message;
  statusBox.classList.remove('hidden');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderCard(item) {
  if (typeof item === 'string') {
    return `<div class="card"><p>${escapeHtml(item)}</p></div>`;
  }

  const title = escapeHtml(item.title || 'Untitled source');
  const snippet = escapeHtml(item.snippet || 'No summary provided.');
  const source = escapeHtml(item.sourceLabel || 'Unknown source');
  const link = item.link
    ? `<p><a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">Open source</a></p>`
    : '';

  return `
    <div class="card">
      <h3>${title}</h3>
      <p class="source">Source: ${source}</p>
      <p>${snippet}</p>
      ${link}
    </div>
  `;
}

function renderResults(payload) {
  resultGrid.innerHTML = '';
  warningText.textContent = payload.warning || '';

  sectionConfig.forEach((section) => {
    const items = payload.sections?.[section.key] || [];
    const html = items.map(renderCard).join('') || '<div class="card"><p>No results.</p></div>';

    resultGrid.insertAdjacentHTML(
      'beforeend',
      `
      <article class="card">
        <h2>${section.title}</h2>
        ${html}
      </article>
    `
    );
  });

  resultsSection.classList.remove('hidden');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('Processing task...');
  resultsSection.classList.add('hidden');

  const formData = new FormData(form);

  try {
    const response = await fetch('/api/process-task', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const payload = await response.json();
    setStatus(`Done (${payload.mode} mode)`);
    renderResults(payload);
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  }
});
