/**
 * ================================================
 * 🏠 COMPONENTE PRINCIPAL DO APLICATIVO (APP.JS)
 * ================================================
 * 
 * Este é o coração do aplicativo, que:
 * 1. Define a estrutura base de todas as páginas
 * 2. Importa e renderiza o sistema de rotas
 * 3. Aplica estilos globais através do App.css
 */

// Importa o componente de rotas (que gerencia a navegação entre páginas)
import Routes from './routes';

// Importa os estilos CSS globais (afeta todo o aplicativo)
import './App.css';

/**
 * Componente App - A "moldura" principal do projeto
 * 
 * Funcionamento:
 * - Renderiza o componente <Routes /> que contém todas as páginas do sistema
 * - Serve como ponto de partida para estilos e configurações globais
 * - Pode ser expandido para incluir cabeçalhos, rodapés ou menus laterais
 */
function App() {
  return (
    <div className="app-container">
      {/* Renderiza o sistema de navegação (rotas) */}
      <Routes/>
    </div>
  );
}

export default App;

/**
 * ================================================
 * 📝 GUIA VISUAL PARA NÃO-PROGRAMADORES
 * ================================================
 * 
 * Imagine este componente como:
 * 
 * 🖼️ Um "quadro vazio" que contém todas as páginas do app
 * 🔀 O "controlador central" que decide qual página mostrar
 * 🎨 A "base de pintura" onde os estilos globais são aplicados
 * 
 * Exemplo de fluxo:
 * 1. Usuário acessa /formulario → <Routes> mostra a página de formulário
 * 2. Usuário acessa / → <Routes> mostra a página inicial
 * 
 * Observações:
 * - Todo conteúdo muda DENTRO desta "moldura"
 * - O arquivo App.css afeta TODAS as páginas igualmente
 */

/**
 * Símbolos usados:
 * 🏠 = Componente principal/base
 * 🔀 = Gerenciamento de navegação
 * 🎨 = Estilos/design
 * 📝 = Explicação para não-técnicos
 */