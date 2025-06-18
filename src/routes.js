/**
 * ====================================================
 * 🌐 ROTAS DO APLICATIVO - CONFIGURAÇÃO DE NAVEGAÇÃO
 * ====================================================
 * 
 * Este arquivo define todas as "páginas" (telas) do sistema
 * e os caminhos (URLs) que levam a cada uma delas.
 * 
 * Funcionamento:
 * - Quando o usuário acessa um link (ex: "/glossario"),
 *   o sistema mostra a página correspondente.
 * - Todas as páginas estão dentro do componente <BrowserRouter>,
 *   que gerencia a navegação sem recarregar a tela.
 */

// Importa os componentes necessários do React Router (biblioteca de navegação)
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa cada página do sistema (os componentes estão em pastas separadas)
import Home from "./pages/Home/home-index.js";
import Glossario from "./pages/Glossário/gloss-index";
import Calculo from "./pages/Calculo/calc-index.js";
import Formulario from "./pages/Formulário/form-index";
import Quiz from "./pages/Quiz/quiz-index";
import Sobre from "./pages/Sobre/sobre-index.js";

/**
 * Componente principal de rotas
 * (Renderiza a página correta com base no URL acessado)
 */
const AppRoutes = () => {
  return (
    // Envolve todas as rotas no gerenciador de navegação
    <BrowserRouter>
      {/* Container das rotas individuais */}
      <Routes>
        {/* Rota da página inicial (acessada via URL "/") */}
        <Route path="/" element={<Home />} />

        {/* Rota do glossário (acessada via URL "/glossario") */}
        <Route path="/glossario" element={<Glossario />} />

        {/* Rota da calculadora (acessada via URL "/calculo") */}
        <Route path="/calculo" element={<Calculo />} />

        {/* Rota de formulários (acessada via URL "/formulario") */}
        <Route path="/formulario" element={<Formulario />} />

        {/* Rota do quiz (acessada via URL "/quiz") */}
        <Route path="/quiz" element={<Quiz />} />

        {/* Rota "Sobre o projeto" (acessada via URL "/sobre") */}
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  );
}

// Exporta o componente para ser usado no resto do aplicativo
export default AppRoutes;