// ==========================================================================
//  Breast Cancer Predictor — Frontend Logic
// ==========================================================================

const FEATURES = [
  { id: 'clump_thickness',       label: 'Clump Thickness',              min: 1, max: 10, default: 5, info: 'Assessment of cell grouping. Benign cells are in monolayers; malignant cells form multi-layered clumps.' },
  { id: 'cell_size_uniformity',  label: 'Uniformity of Cell Size',      min: 1, max: 10, default: 1, info: 'Cancer cells vary in size. High uniformity is typically benign.' },
  { id: 'cell_shape_uniformity', label: 'Uniformity of Cell Shape',     min: 1, max: 10, default: 1, info: 'Cancer cells vary in shape. High uniformity is typically benign.' },
  { id: 'marginal_adhesion',     label: 'Marginal Adhesion',            min: 1, max: 10, default: 1, info: 'Loss of adhesion allows cancer cells to spread. High values indicate malignancy.' },
  { id: 'epithelial_cell_size',  label: 'Single Epithelial Cell Size',  min: 1, max: 10, default: 2, info: 'Significantly enlarged epithelial cells can indicate cancer.' },
  { id: 'bare_nuclei',           label: 'Bare Nuclei',                  min: 1, max: 10, default: 1, info: 'Nuclei without cytoplasm cover. Often found in malignant tumors.' },
  { id: 'bland_chromatin',       label: 'Bland Chromatin',              min: 1, max: 10, default: 3, info: 'Describes the uniform texture of the nucleus. Coarse/dark chromatin strongly indicates cancer.' },
  { id: 'normal_nucleoli',       label: 'Normal Nucleoli',              min: 1, max: 10, default: 1, info: 'Nucleoli are small structures in the nucleus. Enlarged ones are seen in cancer.' },
  { id: 'mitoses',               label: 'Mitoses',                      min: 1, max: 10, default: 1, info: 'Rate of cell division. High mitotic activity is a sign of cancer.' },
];

// ---------- Build slider UI ----------
function buildSliders() {
  const grid = document.getElementById('features-grid');
  FEATURES.forEach(f => {
    const group = document.createElement('div');
    group.className = 'slider-group';
    group.innerHTML = `
      <label for="${f.id}">
        <span class="label-info-wrapper">
          ${f.label}
          <div class="info-tooltip">
            <span class="info-icon">ℹ️</span>
            <div class="tooltip-text">${f.info}</div>
          </div>
        </span>
        <span class="value-badge" id="${f.id}-val">${f.default}</span>
      </label>
      <input type="range" id="${f.id}" min="${f.min}" max="${f.max}" value="${f.default}" step="1">
    `;
    grid.appendChild(group);

    const slider = group.querySelector('input');
    const badge  = group.querySelector('.value-badge');
    slider.addEventListener('input', () => { badge.textContent = slider.value; });
  });
}

// ---------- Collect feature values ----------
function getFeatures() {
  return FEATURES.map(f => parseFloat(document.getElementById(f.id).value));
}

// ---------- Call prediction API ----------
async function predict() {
  const btn = document.getElementById('predict-btn');
  const resultCard = document.getElementById('result-card');

  // Start loading
  btn.classList.add('loading');
  btn.disabled = true;
  resultCard.classList.remove('show', 'benign', 'malignant');

  try {
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: getFeatures() }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    showResult(data);
  } catch (err) {
    alert('Prediction failed. Make sure the server is running.\n' + err.message);
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// ---------- Result descriptions ----------
const DESCRIPTIONS = {
  Benign: {
    title: '💚 Likely Non-Cancerous',
    text: 'The tumor characteristics suggest a benign (non-cancerous) growth. Benign tumors typically have uniform cell size and shape, low mitotic activity, and well-defined margins. While this is a positive indicator, always confirm with a medical professional through biopsy and clinical evaluation.',
  },
  Malignant: {
    title: '⚠️ Potentially Cancerous',
    text: 'The tumor characteristics suggest a malignant (cancerous) growth. Malignant tumors often show irregular cell size and shape, higher mitotic rates, and abnormal chromatin patterns. Early detection is key — please consult an oncologist immediately for further diagnostic tests such as biopsy, imaging, and staging.',
  },
};

// ---------- Display result ----------
function showResult({ prediction, cancer_risk }) {
  const card      = document.getElementById('result-card');
  const icon      = document.getElementById('result-icon');
  const label     = document.getElementById('result-label');
  const confText  = document.getElementById('result-confidence');
  const bar       = document.getElementById('result-bar');
  const descEl    = document.getElementById('result-description');

  const isBenign = prediction === 'Benign';
  const desc = DESCRIPTIONS[prediction];

  card.className  = `card result-card show ${isBenign ? 'benign' : 'malignant'}`;
  icon.textContent = isBenign ? '✅' : '⚠️';
  label.textContent = prediction;
  confText.textContent = `Cancer Risk: ${(cancer_risk * 100).toFixed(1)}%`;

  // Show description
  descEl.innerHTML = `<strong>${desc.title}</strong><p>${desc.text}</p>`;

  // Animate bar
  bar.style.width = '0%';
  requestAnimationFrame(() => {
    bar.style.width = `${(cancer_risk * 100).toFixed(0)}%`;
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  buildSliders();
  document.getElementById('predict-btn').addEventListener('click', predict);
});
