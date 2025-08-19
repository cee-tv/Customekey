const directLink = { 
  url: "https://shrtq.com/Vb28pse/79592035", 
  label: "Direct Link" 
};

let currentDuration = { value: 1, unit: 'days' };

function getDurationFileName() {
  // Get today's date in UTC
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const durationDays = convertToDays(currentDuration.value, currentDuration.unit);
  return `${yyyy}-${mm}-${dd}_${durationDays}days.txt`;
}

function convertToDays(value, unit) {
  const multipliers = {
    days: 1,
    weeks: 7,
    months: 30,
    years: 365
  };
  return value * (multipliers[unit] || 1);
}

function updateDuration() {
  const valueInput = document.getElementById('durationValue');
  const unitSelect = document.getElementById('durationUnit');
  currentDuration = {
    value: parseInt(valueInput.value) || 1,
    unit: unitSelect.value
  };
  
  // Reset the direct link button when duration changes
  const directLinkBtn = document.getElementById('direct-link-btn');
  if (directLinkBtn) {
    directLinkBtn.disabled = false;
    directLinkBtn.innerHTML = `<i class="bi bi-link-45deg"></i> ${directLink.label}`;
  }
  
  // Clear the key area
  document.getElementById('key-area').innerHTML = '';
}

function renderLink() {
  const directLinksDiv = document.getElementById('direct-links');
  
  directLinksDiv.innerHTML = `
    <button id="direct-link-btn" class="btn btn-primary btn-link-step" onclick="handleLinkClick()">
      <i class="bi bi-link-45deg"></i> ${directLink.label}
    </button>
  `;
}

function handleLinkClick() {
  document.getElementById('direct-link-btn').disabled = true;
  document.getElementById('direct-link-btn').innerHTML = '<i class="bi bi-check-circle"></i> Link Clicked';
  loadKey();
}

async function loadKey() {
  const keyArea = document.getElementById('key-area');
  keyArea.innerHTML = `
    <div class="d-flex flex-column align-items-center">
      <div class="spinner-border text-primary mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span class="text-secondary">Fetching key for ${currentDuration.value} ${currentDuration.unit} duration&hellip;</span>
    </div>
  `;

  const fileName = getDurationFileName();
  const url = `https://raw.githubusercontent.com/cee-tv/iptvphkey/main/keys/${fileName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Key not found yet.');
    const key = await response.text();
    keyArea.innerHTML = `
      <div class="alert alert-success d-flex align-items-center justify-content-center" role="alert" style="width:100%;">
        <i class="bi bi-shield-lock me-2"></i>
        <div class="key-value" style="white-space: pre-wrap; margin-bottom: 0;">${key.trim()}</div>
        <button class="btn btn-outline-primary btn-sm ms-3" onclick="copyKey(this, '${key.trim()}')"><i class="bi bi-clipboard"></i> Copy</button>
      </div>
    `;
  } catch (e) {
    keyArea.innerHTML = `
      <div class="alert alert-warning d-flex align-items-center justify-content-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <span>Key not available yet for ${currentDuration.value} ${currentDuration.unit} duration.</span>
      </div>
    `;
  }
}

function copyKey(button, text) {
  navigator.clipboard.writeText(text);
  button.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied!';
  button.disabled = true;
  setTimeout(() => {
    button.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
    button.disabled = false;
  }, 1200);
}

window.onload = () => {
  document.getElementById('durationValue').addEventListener('input', updateDuration);
  document.getElementById('durationUnit').addEventListener('change', updateDuration);
  
  renderLink();
  document.getElementById('key-area').innerHTML = '';
};
