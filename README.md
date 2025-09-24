Sistema de Autenticação
Este projeto implementa um sistema completo de autenticação utilizando Firebase Authentication com dois métodos de login: email/senha e Google OAuth.

📋 Funcionalidades Implementadas
🔐 Login com Email e Senha
Cadastro de novos usuários: Validação de dados e criação de conta

Login de usuários existentes: Autenticação segura com tratamento de erros

Armazenamento de dados: Salvamento de informações do usuário no Firestore

Persistência de sessão: Uso de localStorage para manter o usuário logado

🔵 Login com Google OAuth
Autenticação social: Integração com contas Google

Popup de login: Interface amigável para autenticação

Salvamento automático: Dados do usuário são automaticamente salvos no Firestore

Tratamento de erros: Mensagens específicas para diferentes tipos de erro

🛠️ Tecnologias Utilizadas
Firebase Authentication: Para gerenciamento de autenticação

Firebase Firestore: Para armazenamento de dados do usuário

Google OAuth: Para autenticação social

JavaScript ES6+: Para lógica do frontend

HTML5 e CSS3: Para interface do usuário

📁 Estrutura do Projeto
text
├── index.html          # Página principal com formulários de login/cadastro
├── style.css           # Estilos da aplicação
├── script.js           # Lógica principal de autenticação
├── homepage.html       # Página após login bem-sucedido
└── README.md          # Esta documentação
🔧 Implementação Técnica
Configuração do Firebase
javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-sender-id",
    appId: "seu-app-id"
};
Método de Login com Email/Senha
javascript
// Cadastro
createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Salva dados no Firestore
        const userData = { email, firstName, lastName };
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData);
    });

// Login
signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homepage.html';
    });
Método de Login com Google
javascript
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Salva dados do usuário do Google
    const userData = {
        email: user.email,
        firstName: user.displayName?.split(' ')[0],
        lastName: user.displayName?.split(' ')[1],
        photoURL: user.photoURL,
        provider: 'google'
    };
    
    await setDoc(doc(db, "users", user.uid), userData, { merge: true });
};
🎨 Interface do Usuário
Formulários
Design responsivo: Adaptável a diferentes tamanhos de tela

Validação visual: Campos com labels flutuantes

Feedback visual: Mensagens de erro/sucesso temporárias

Animações: Transições suaves e efeitos hover

Elementos de UI
Campos de formulário: Com ícones e validação

Botões estilizados: Com efeitos de hover e focus

Ícones FontAwesome: Para melhor experiência visual

Gradiente de fundo: Design moderno e atraente

⚡ Funcionalidades de Segurança
Validação de email: Verificação de formato correto

Tratamento de erros: Mensagens específicas para cada tipo de erro

Persistência segura: Uso de localStorage apenas para ID do usuário

Firebase Security Rules: Proteção dos dados no Firestore

🚀 Como Usar
Cadastro: Preencha nome, email e senha no formulário de cadastro

Login com email: Use email e senha cadastrados

Login com Google: Clique no ícone do Google para autenticação social

Redirecionamento: Após login bem-sucedido, será redirecionado para homepage

🔍 Tratamento de Erros
O sistema trata diversos cenários de erro:

auth/email-already-in-use: Email já cadastrado

auth/invalid-credential: Credenciais incorretas

auth/popup-closed-by-user: Popup fechado pelo usuário

auth/network-request-failed: Problema de conexão

📱 Responsividade
A interface é totalmente responsiva com media queries para:

Dispositivos móveis (até 600px)

Tablets (601px - 900px)

Desktop (acima de 900px)

🔄 Fluxo de Autenticação
Usuário preenche formulário ou clica no Google

Dados são validados e enviados para Firebase

Em caso de sucesso, dados são salvos no Firestore

ID do usuário é armazenado no localStorage

Redirecionamento para página principal