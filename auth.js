import { auth, db } from './firebase-config.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { isOnline, initNetworkListener } from './network.js';

// Sayfa yüklenince çalışır
document.addEventListener('DOMContentLoaded', () => {
  // İnternet kontrolü
  if (!isOnline()) {
    showNoConnectionPage();
    return;
  }

  // Ağ dinleyicisini başlat
  initNetworkListener();

  // Splash göster → sonra auth kontrol
  showSplash(() => {
    checkAuthState();
  });

  // Google giriş butonu
  const googleBtn = document.getElementById('google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', signInWithGoogle);
  }
});

// Splash ekranı
function showSplash(callback) {
  const splash = document.getElementById('splash');
  const main = document.getElementById('main');

  if (!splash) {
    callback();
    return;
  }

  splash.style.display = 'flex';
  if (main) main.style.display = 'none';

  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      if (main) main.style.display = 'flex';
      callback();
    }, 500);
  }, 2000);
}

// Auth durumunu kontrol et
function checkAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Giriş yapılmış → home'a yönlendir
      window.location.href = 'home.html';
    }
    // Giriş yapılmamış → giriş ekranında kal
  });
}

// Google ile giriş
async function signInWithGoogle() {
  if (!isOnline()) {
    alert('İnternet bağlantısı yok.');
    return;
  }

  const btn = document.getElementById('google-login-btn');
  btn.disabled = true;
  btn.textContent = 'Giriş yapılıyor...';

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Kullanıcı Firestore'da var mı kontrol et
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Yeni kullanıcı → Firestore'a kaydet
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        xp: 0,
        level: 1,
        totalCatches: 0,
        badges: [],
        city: '',
        licenseNo: '',
        createdAt: serverTimestamp()
      });

      // Yeni kullanıcıyı profil tamamlama sayfasına gönder
      window.location.href = 'setup.html';
    } else {
      // Mevcut kullanıcı → ana sayfaya gönder
      window.location.href = 'home.html';
    }

  } catch (error) {
    console.error('Giriş hatası:', error);
    btn.disabled = false;
    btn.textContent = 'Google ile Giriş Yap';

    if (error.code === 'auth/popup-closed-by-user') return;
    alert('Giriş yapılamadı. Tekrar dene.');
  }
}

// Dışarıdan erişim için
export { signOut, auth };