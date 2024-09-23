
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDz1FNpjValLs39_sBiz_RtczOk9nNohE0",
    authDomain: "casvamantenimiento-de348.firebaseapp.com",
    databaseURL: "https://casvamantenimiento-de348-default-rtdb.firebaseio.com",
    projectId: "casvamantenimiento-de348",
    storageBucket: "casvamantenimiento-de348.appspot.com",
    messagingSenderId: "808523547122",
    appId: "1:808523547122:web:e70a81c6ad67f10a9d2b6b",
    measurementId: "G-1DDE7Q981N"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const btnLogin = document.querySelector('.btn');

const loginEmailPassword = async () => {

    const email = document.getElementById('txtEmail').value;
    const password = document.getElementById('txtPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener el rol del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            alert('No se encontró la información del usuario.');
            return;
        }
        const userData = userDoc.data();

        // Redireccionar según el rol
        if (userData.role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'user_dashboard.html';
        }
    } catch (error) {
        alert('Error de autenticación: ' + error.message);
    }
};

btnLogin.addEventListener("click",loginEmailPassword);


document.querySelector(".icon-close").addEventListener("click", () => {
    document.querySelector(".fondo").classList.remove("active-btn");
})