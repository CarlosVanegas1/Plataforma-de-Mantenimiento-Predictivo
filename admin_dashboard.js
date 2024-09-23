import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
    if (!user) {
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

// Crear Usuario (verificamos que esta funcionalidad debe realizarse en el backend)
const createUserForm = document.getElementById('createUserForm');
createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const name = document.getElementById('newUserName').value;
    const role = document.getElementById('newUserRole').value;

    // Guardar el estado de la sesión actual (del admin)
    const adminUser = auth.currentUser;
    const adminEmail = adminUser.email;
    const adminPassword = prompt("Por razones de seguridad, ingresa tu contraseña de administrador:");
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        alert("Cuenta creada satisfactoriamente UID: " + uid);
        // Agregar usuario a la colección 'users' en Firestore
        await setDoc(doc(db, "users", uid), {
            email: email,
            name: name,
            role: role
        });
        // Cerrar la sesión del nuevo usuario creado
        await signOut(auth);
        // Volver a iniciar sesión con la cuenta del administrador
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        // Cargar los usuarios para verificar que se guardó correctamente
        loadUsers();
    } catch (error) {
        alert('Error creando usuario: ' + error.message);
    }
});

// Cargar Usuarios
const usersList = document.getElementById('usersList');

const loadUsers = async () => {
    usersList.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        const user = doc.data();
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.innerHTML = `
            <span>${user.name} (${user.email}) - ${user.role}</span>
            <button onclick="deleteUser('${doc.id}')">Eliminar</button>
        `;
        usersList.appendChild(userItem);
    });
};

window.deleteUser = async (uid) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
            // Eliminar usuario de Firestore
            await deleteDoc(doc(db, "users", uid));
            // Nota: Eliminar usuario de Firebase Authentication solo se puede realizar desde el backend (Admin SDK).
            alert('Usuario eliminado exitosamente.');
            loadUsers();
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            alert('Error eliminando usuario: ' + error.message);
        }
    }
};

// Cargar usuarios al inicio
loadUsers();

// Crear Producto
const createProductForm = document.getElementById('createProductForm');
createProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('newProductName').value;
    const description = document.getElementById('newProductDescription').value;

    try {
        await addDoc(collection(db, "products"), {
            name: name,
            description: description,
            createdAt: new Date()
        });
        alert('Producto agregado exitosamente.');
        createProductForm.reset();
        loadProducts();
    } catch (error) {
        console.error('Error agregando producto:', error);
        alert('Error agregando producto: ' + error.message);
    }
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
            <button onclick="deleteProduct('${doc.id}')">Eliminar</button>
        `;
        productsList.appendChild(productItem);
    });
};

window.deleteProduct = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            await deleteDoc(doc(db, "products", productId));
            alert('Producto eliminado exitosamente.');
            loadProducts();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('Error eliminando producto: ' + error.message);
        }
    }
};

// Cargar productos al inicio
loadProducts();
