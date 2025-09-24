// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
 apiKey: "AIzaSyAjTt8fLJC4pBp2fMzX3Qf5yrgcQtjGnWU",
  authDomain: "openidconnect-aa065.firebaseapp.com",
  projectId: "openidconnect-aa065",
  storageBucket: "openidconnect-aa065.firebasestorage.app",
  messagingSenderId: "1012354990414",
  appId: "1:1012354990414:web:950953d1a84b0230e11e1f"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); // A mensagem desaparece após 5 segundos
}

// Função de login com Google
const signInWithGoogle = async () => {
    try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const db = getFirestore();
        const userData = {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            photoURL: user.photoURL || '',
            provider: 'google'
        };

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, userData, { merge: true });

        showMessage('Login com Google realizado com sucesso', 'signInMessage');
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homepage.html';
        
        return user;
    } catch (error) {
        console.error('Erro no login com Google:', error);
        if (error.code === 'auth/popup-closed-by-user') {
            showMessage('Popup de login fechado', 'signInMessage');
        } else {
            showMessage('Erro ao fazer login com Google', 'signInMessage');
        }
        throw error;
    }
};

// Lógica de cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de cadastro
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth(); // Configura o serviço de autenticação
    const db = getFirestore(); // Conecta ao Firestore

    // Cria uma conta com e-mail e senha
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user; // Usuário autenticado
        const userData = { email, firstName, lastName }; // Dados do usuário para salvar

        showMessage('Conta criada com sucesso', 'signUpMessage'); // Exibe mensagem de sucesso

        // Salva os dados do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'index.html'; // Redireciona para a página de login após cadastro
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Endereço de email já existe', 'signUpMessage');
        } else {
            showMessage('não é possível criar usuário', 'signUpMessage');
        }
    });
});

// Lógica de login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de login
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth(); // Configura o serviço de autenticação

    // Realiza o login com e-mail e senha
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('usuário logado com sucesso', 'signInMessage'); // Exibe mensagem de sucesso
        const user = userCredential.user;

        // Salva o ID do usuário no localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        window.location.href = 'homepage.html'; // Redireciona para a página inicial
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('Email ou Senha incorreta', 'signInMessage');
        } else {
            showMessage('Essa conta não existe', 'signInMessage');
        }
    });
});

// Lógica de login com Google
const googleLoginBtn = document.getElementById('googleSignIn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        signInWithGoogle()
            .then((user) => {
                console.log('Login com Google bem-sucedido:', user);
            })
            .catch((error) => {
                console.error('Falha no login com Google:', error);
                
                if (error.code === 'auth/account-exists-with-different-credential') {
                    showMessage('Este email já está cadastrado com outro método de login', 'signInMessage');
                } else if (error.code === 'auth/popup-blocked') {
                    showMessage('Popup bloqueado. Permita popups para este site', 'signInMessage');
                } else if (error.code === 'auth/network-request-failed') {
                    showMessage('Erro de conexão. Verifique sua internet', 'signInMessage');
                }
            });
    });
}