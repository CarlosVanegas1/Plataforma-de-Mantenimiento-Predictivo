import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js';

Chart.register(...registerables);

// Inicializar Firebase
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

// Verificar autenticación y rol
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        // Verificar el rol del usuario en Firestore
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Verificar si el usuario es administrador
            if (userData.role !== 'user') { // Cambiado a 'user' si es una dashboard de usuario normal
                alert("No tienes permisos para acceder a esta página.");
                window.location.href = "Login.html";
            }
        } else {
            alert("No se pudo obtener la información del usuario.");
            window.location.href = "Login.html";
        }
    } else {
        // Si el usuario no está autenticado, redirigir al Login
        window.location.href = "Login.html";
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'Login.html';
    }).catch((error) => {
        alert('Error al cerrar sesión: ' + error.message);
    });
});

// Cargar Productos
const productsList = document.getElementById('productsList');
const loadProducts = async () => {
    productsList.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <span>${product.name} - ${product.description}</span>
        `;
        productsList.appendChild(productItem);
    });
};

// Cargar datos y gráficas
const loadDashboardData = async () => {
    const machineDoc = await getDoc(doc(db, "machines", "machineId")); // Ajusta el ID de la máquina
    if (machineDoc.exists()) {
        const machineData = machineDoc.data();
        updateMaintenanceChart(machineData);
    }
};

// Actualizar la gráfica de mantenimiento
const updateMaintenanceChart = (data) => {
    const ctx = document.getElementById('maintenanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.timestamps,
            datasets: [
                {
                    label: 'Temperatura de Aire',
                    data: data.airTemperature,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Temperatura del Proceso',
                    data: data.processTemperature,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                },
                // Añade más datasets según sea necesario
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat().format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
};

// Cargar productos y datos al inicio
loadProducts();
loadDashboardData();
