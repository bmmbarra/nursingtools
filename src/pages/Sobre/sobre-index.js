/**
 * ================================================
 * ℹ️ PÁGINA "SOBRE" - NURSING TOOLS (SOBRE-INDEX.JS)
 * ================================================
 * 
 * Esta página contém informações sobre o projeto:
 * - Objetivos e missão
 * - Tecnologias utilizadas
 * - Equipe de desenvolvimento
 * - Versão do sistema
 * 
 * Estrutura:
 * 1. Cabeçalho de navegação (igual às outras páginas)
 * 2. Componente de tema (Theme)
 * 3. Seções de conteúdo sobre o projeto
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Theme from '../../components/Tema/tema';
import './sobre-index.css'; // Estilos específicos desta página

const SobrePage = () => {
  return (
    <div className="home-page-container">
      {/* ================================================ */}
      {/* 🧭 CABEÇALHO DE NAVEGAÇÃO */}
      {/* ================================================ */}
      <div className="home-content-box">
        <div className="header-background">
          <header className="custom-header">
            {/* Link para Home (ícone) */}
            <div className="dot_home">
              <Link to="/" className="bar-link-home" />
            </div>
            
            {/* Links para outras páginas */}
            <div className="dot" />
            <div className="dot" />
            <Link to="/glossario" className="bar-link">Glossário</Link>
            
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <Link to="/calculo" className="bar-link">Calculadora</Link>
            
            <div className="dot" />
            <div className="dot" />
            <Link to="/formulario" className="bar-link">Formulário</Link>
            
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <Link to="/quiz" className="bar-link">Quiz</Link>
            
            <div className="dot" />
            <div className="dot" />
            {/* Link ativo para a página atual (Sobre) */}
            <div className="dot-about">
              <Link to="/sobre" className="bar-link-about" />
            </div>
          </header>
        </div>
        
        {/* ================================================ */}
        {/* 🎨 COMPONENTE DE TEMA */}
        {/* ================================================ */}
        <Theme />
        
        {/* ================================================ */}
        {/* 📚 CONTEÚDO PRINCIPAL */}
        {/* ================================================ */}
        <div className="main-content">
          
          {/* Seção: Apresentação do projeto */}
          <section className="sobre-section">
            <p>
              Bem-vindo ao <strong>NursingTools</strong>, uma iniciativa desenvolvida pela turma <strong> 016.2024.0014 | Técnico em Informática  </strong> 
              como parte do <strong>Projeto Integrador do Senac</strong>, voltado para a área da <strong>Enfermagem</strong>.
            </p>
            <p>
              Nosso objetivo é oferecer uma ferramenta prática e inovadora para auxiliar alunos e profissionais 
              da saúde, facilitando o acesso a informações e recursos essenciais para sua formação.
            </p>
          </section>

          {/* Seção: Tecnologias usadas */}
          <section className="sobre-section">
            <h2>Tecnologias Utilizadas</h2>
            <p>
              Para garantir eficiência e usabilidade, desenvolvemos este projeto utilizando:
            </p>
            <ul className="tech-list">
              <li><strong>React</strong> como linguagem principal.</li>
              <li><strong>Visual Studio Code (VSCode)</strong> como ambiente de desenvolvimento.</li>
              <li>Bibliotecas como <strong>React Router</strong> para navegação e <strong>jsPDF</strong> para geração de documentos em PDF.</li>
            </ul>
          </section>

          {/* Seção: Missão */}
          <section className="sobre-section">
            <h2>Nossa Missão</h2>
            <p>
              Acreditamos que a tecnologia pode transformar a educação em saúde, e por isso criamos esta plataforma 
              pensando nas necessidades dos alunos de <strong>Enfermagem</strong>. Queremos contribuir para um aprendizado 
              mais dinâmico e acessível.
            </p>
          </section>

          {/* Seção: Equipe */}
          <section className="sobre-section">
            <h2>Equipe</h2>
            <div className="equipe-container">
              <div className="membro">
                <h3>Leo</h3>
                <p>Desenvolvedor FullStack</p>
              </div>
              <div className="membro">
                <h3>Victor</h3>
                <p>Desenvolvedor FullStack</p>
              </div>
              <div className="membro">
                <h3>Jonathan</h3>
                <p>Desenvolvedor FullStack</p>
              </div>
              <div className="membro">
                <h3>Yuri</h3>
                <p>Desenvolvedor BackEnd</p>
              </div>
              <div className="membro">
                <h3>Francisco</h3>
                <p>Desenvolvedor BackEnd</p>
              </div>
              <div className="membro">
                <h3>Guilherme</h3>
                <p>Desenvolvedor BackEnd</p>
              </div>
            </div>
          </section>

          {/* Seção: Versão */}
          <section className="sobre-section">
            <h2>Versão</h2>
            <p>1.0</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SobrePage;

/**
 * ================================================
 * 📝 GUIA PARA NÃO-PROGRAMADORES
 * ================================================
 * 
 * Esta página ("Sobre") é como um "cartão de visitas digital" que:
 * 
 * 1️⃣ Explica o propósito do NursingTools
 * 2️⃣ Mostra quem desenvolveu o projeto
 * 3️⃣ Lista as tecnologias usadas
 * 4️⃣ Inclui a versão atual
 * 
 * Estrutura visual:
 * - Cabeçalho idêntico ao do resto do site (para navegação)
 * - Seções organizadas por temas
 * - Design responsivo (se adapta a celulares e tablets)
 * 
 * Curiosidade:
 * - Todo o conteúdo está dentro de tags <section> para melhor organização
 * - Os estilos são importados do arquivo "sobre-index.css"
 */

/**
 * Símbolos usados:
 * ℹ️ = Página informativa
 * 🧭 = Navegação
 * 🎨 = Componente de tema/design
 * 📚 = Conteúdo principal
 * 📝 = Explicação para não-técnicos
 */
