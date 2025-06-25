/**
 * ================================================
 * 🏠 COMPONENTE PRINCIPAL DO APLICATIVO (APP.JS)
 * ================================================
 * * Este é o coração do aplicativo, que:
 * 1. Define a estrutura base de todas as páginas
 * 2. Importa e renderiza o sistema de rotas
 * 3. Aplica estilos globais através do App.css
 * 4. **NOVO: Configura o sistema de notificações (toasts)**
 */

// Importa o componente de rotas (que gerencia a navegação entre páginas)
import Routes from './routes';

// Importa os estilos CSS globais (afeta todo o aplicativo)
import './App.css';

// **NOVO: Importa o ToastContainer e o CSS de react-toastify**
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Componente App - A "moldura" principal do projeto
 * * Funcionamento:
 * - Renderiza o componente <Routes /> que contém todas as páginas do sistema
 * - Serve como ponto de partida para estilos e configurações globais
 * - Pode ser expandido para incluir cabeçalhos, rodapés ou menus laterais
 * - **NOVO: Exibe notificações (toasts) em qualquer parte do app**
 */
function App() {
  return (
    <div className="app-container">
      {/* Renderiza o sistema de navegação (rotas) */}
      <Routes/>
      
      {/* **NOVO: Componente para exibir notificações (toasts)** */}
      {/* Ele escuta chamadas de `toast.success()`, `toast.error()`, etc. */}
      {/* e exibe as mensagens no canto da tela. */}
      <ToastContainer
        position="top-right" /* Posição padrão dos toasts */
        autoClose={5000} /* Tempo em ms para o toast sumir automaticamente (5 segundos) */
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" /* Use "light", "dark" ou "colored" para o tema do toast */
      />
    </div>
  );
}

export default App;

/**
 * ================================================
 * 📝 GUIA VISUAL PARA NÃO-PROGRAMADORES
 * ================================================
 * * Imagine este componente como:
 * * 🖼️ Um "quadro vazio" que contém todas as páginas do app
 * 🔀 O "controlador central" que decide qual página mostrar
 * 🎨 A "base de pintura" onde os estilos globais são aplicados
 * **🔔 Um "sistema de sinos" que toca alertas para o usuário**
 * * Exemplo de fluxo:
 * 1. Usuário acessa /formulario → <Routes> mostra a página de formulário
 * 2. Usuário acessa / → <Routes> mostra a página inicial
 * **3. Formulário gera PDF → um "sino" (toast) toca na tela para avisar do sucesso ou erro**
 * * Observações:
 * - Todo conteúdo muda DENTRO desta "moldura"
 * - O arquivo App.css afeta TODAS as páginas igualmente
 * - **O ToastContainer fica invisível até que uma mensagem seja enviada, então ele não interfere no layout.**
 */

/**
 * Símbolos usados:
 * 🏠 = Componente principal/base
 * 🔀 = Gerenciamento de navegação
 * 🎨 = Estilos/design
 * 📝 = Explicação para não-técnicos
 * 🔔 = Notificações/Alertas
 */