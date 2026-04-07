const API_KEY = 'qzpdjgmHc36spGtLkog40dwofRxCKcf6fzkN6Xo0';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';
 
const startInput = document.getElementById('startDate');
const endInput   = document.getElementById('endDate');
const fetchBtn   = document.getElementById('fetchBtn');
const gallery    = document.getElementById('gallery');
const status     = document.getElementById('status');
 
const modal         = document.getElementById('modal');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
 
// Set up date inputs via dateRange.js
setupDateInputs(startInput, endInput);
 
// Fetch images on button click
fetchBtn.addEventListener('click', async () => {
  const start = startInput.value;
  const end   = endInput.value;
 
  if (!start || !end) {
    status.textContent = '⚠ Please select both a start and end date.';
    return;
  }
  if (start > end) {
    status.textContent = '⚠ Start date must be before or equal to end date.';
    return;
  }
 
  status.textContent = '🔄 Loading space photos…';
  fetchBtn.disabled = true;
  gallery.innerHTML = '';
 
  try {
    const url = `${APOD_URL}?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
    const res  = await fetch(url);
 
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || `HTTP ${res.status}`);
    }
 
    const data  = await res.json();
    const items = Array.isArray(data) ? data : [data];
 
    if (items.length === 0) {
      gallery.innerHTML = '<p class="error-msg">No images found for the selected range.</p>';
      status.textContent = '';
      return;
    }
 
    status.textContent = `Showing ${items.length} image${items.length !== 1 ? 's' : ''}`;
    renderGallery(items);
 
  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class="error-msg">Could not load images: ${err.message}</p>`;
    status.textContent = '';
  } finally {
    fetchBtn.disabled = false;
  }
});
 
// Build gallery cards
function renderGallery(items) {
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-item';
 
    const isVideo = item.media_type === 'video';
 
    if (isVideo) {
      card.innerHTML = `
        <div class="gallery-item-thumb-video">&#9654;</div>
        <div class="gallery-item-info">
          <p class="gallery-item-title">${escHtml(item.title)}</p>
          <p class="gallery-item-date">${formatDate(item.date)}</p>
        </div>`;
    } else {
      card.innerHTML = `
        <img src="${escHtml(item.url)}" alt="${escHtml(item.title)}" loading="lazy" />
        <div class="gallery-item-info">
          <p class="gallery-item-title">${escHtml(item.title)}</p>
          <p class="gallery-item-date">${formatDate(item.date)}</p>
        </div>`;
    }
 
    card.addEventListener('click', () => openModal(item));
    gallery.appendChild(card);
  });
}
 
// Open modal
function openModal(item) {
  const isVideo = item.media_type === 'video';
  const wrap = modal.querySelector('.modal-image-wrap');
 
  if (isVideo) {
    wrap.innerHTML = `<iframe src="${escHtml(item.url)}" frameborder="0" allowfullscreen
      style="width:100%;height:100%;min-height:260px;"></iframe>`;
  } else {
    wrap.innerHTML = `<img src="${escHtml(item.hdurl || item.url)}" alt="${escHtml(item.title)}" />`;
  }
 
  modal.querySelector('#modalDate').textContent        = formatDate(item.date);
  modal.querySelector('#modalTitle').textContent       = item.title;
  modal.querySelector('#modalExplanation').textContent = item.explanation;
  modal.querySelector('#modalCopyright').textContent   = item.copyright ? `© ${item.copyright.trim()}` : '';
 
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
// Close modal
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
 
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
 
// Helpers
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}
 
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}