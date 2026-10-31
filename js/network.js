export function isOnline() {
  return navigator.onLine;
}

export function initNetworkListener() {
  window.addEventListener('online', () => {
    location.reload();
  });

  window.addEventListener('offline', () => {
    document.getElementById('no-connection').style.display = 'flex';
  });
}
