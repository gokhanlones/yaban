// İnternet Bağlantısı Kontrolü

export function isOnline() {
  return navigator.onLine;
}

export function initNetworkListener() {
  window.addEventListener('online', () => {
    hideNoConnection();
    location.reload();
  });

  window.addEventListener('offline', () => {
    showNoConnection();
  });
}

function showNoConnection() {
  let banner = document.getElementById('no-connection-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'no-connection-banner';
    banner.innerHTML = `
      <div class="no-connection-overlay">
        <div class="no-connection-box">
          <div class="no-connection-icon">📡</div>
          <h2>İnternet Bağlantısı Yok</h2>
          <p>Lütfen bağlantını kontrol et ve tekrar dene.</p>
          <button onclick="location.reload()" class="retry-btn">
            Tekrar Dene
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }
  banner.style.display = 'flex';
}

function hideNoConnection() {
  const banner = document.getElementById('no-connection-banner');
  if (banner) banner.style.display = 'none';
}