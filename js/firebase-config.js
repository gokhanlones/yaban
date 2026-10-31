import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMT-mHr3Debz426EdH4s1QOmtcbcMLRzk",
  authDomain: "yaban-b00bd.firebaseapp.com",
  projectId: "yaban-b00bd",
  storageBucket: "yaban-b00bd.firebasestorage.app",
  messagingSenderId: "919377752116",
  appId: "1:919377752116:web:67f545c67931892ebf5a61"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
