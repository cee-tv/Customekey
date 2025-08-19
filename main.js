const directLink = { 
  url: "https://shrtq.com/Vb28pse/79592035", 
  label: "Direct Link" 
};

let currentDuration = { value: 1, unit: 'days' };

function getDurationFileName() {
  // Use PH time (UTC+8) to match backend
  const phTime = new Date(new Date().getTime() + (8 * 60 * 60 * 1000));
  const yyyy = phTime.getUTCFullYear();
  const mm = String(phTime.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(phTime.getUTCDate()).padStart(2, '0');
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
  const repoBase = 'cee-tv/iptvphkey'; // Update this to your actual repo
  const url = `https://raw.githubusercontent.com/${repoBase}/main/keys/${fileName}`;
  
  // Debug output
  console.log('Trying to fetch:', url);

  try {
    const response = await fetch(url, { cache: 'no-store' });
    console.log('Response status:', response.status);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const key = await response.text();
    keyArea.innerHTML = `
      <div class="alert alert-success d-flex align-items-center justify-content-center" role="alert" style="width:100%;">
        <i class="bi bi-shield-lock me-2"></i>
        <div class="key-value" style="white-space: pre-wrap; margin-bottom: 0;">${key.trim()}</div>
        <button class="btn btn-outline-primary btn-sm ms-3" onclick="copyKey(this, '${key.trim()}')"><i class="bi bi-clipboard"></i> Copy</button>
      </div>
    `;
  } catch (e) {
    console.error('Error fetching key:', e);
    keyArea.innerHTML = `
      <div class="alert alert-warning d-flex flex-column align-items-center justify-content-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2 mb-2"></i>
        <div class="text-center">
          <div>Key not available yet for ${currentDuration.value} ${currentDuration.unit}.</div>
          <small class="text-muted">Checking for: ${fileName}</small>
          <br><br>
          <button class="btn btn-sm btn-outline-primary" onclick="loadKey()">Retry</button>
        </div>
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
