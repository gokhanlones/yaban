import { auth, db } from './firebase-config.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { isOnline, initNetworkListener } from './network.js';

document.addEventListener('DOMContentLoaded', () => {

  if (!isOnline()) {
    document.getElementById('no-connection').style.display = 'flex';
    return;
  }

  initNetworkListener();

  // Splash → 2 saniye → giriş ekranı
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('main').style.display = 'flex';
    }, 500);
  }, 2000);

  // Zaten giriş yapılmışsa home'a git
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = 'home.html';
  });

  // Google giriş butonu
  const btn = document.getElementById('google-btn');
  btn.addEventListener('click', async () => {
    if (!isOnline()) { alert('İnternet bağlantısı yok.'); return; }

    btn.disabled = true;
    btn.textContent = 'Giriş yapılıyor...';

    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user   = result.user;
      const ref    = doc(db, 'users', user.uid);
      const snap   = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          displayName: user.displayName,
          email:       user.email,
          photoURL:    user.photoURL,
          xp: 0, level: 1, totalCatches: 0,
          badges: [], city: '', licenseNo: '',
          createdAt: serverTimestamp()
        });
      }
      window.location.href = 'home.html';

    } catch (e) {
      console.error(e);
      btn.disabled = false;
      btn.textContent = 'Google ile Giriş Yap';
      if (e.code !== 'auth/popup-closed-by-user') {
        alert('Giriş yapılamadı. Tekrar dene.');
      }
    }
  });
});
