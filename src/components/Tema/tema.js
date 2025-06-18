// ===================================================================================
// ARQUIVO: Tema.js (ou ThemeToggle.js)
//
// PROPÓSITO GERAL:
// Este arquivo cria o botão de "interruptor de tema" (claro/escuro).
// Ele é responsável por desenhar o botão na tela, permitir que o usuário
// troque o tema visual do site e, mais importante, lembrar da escolha do usuário
// para futuras visitas.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Decorações ---
// Importamos as ferramentas do React e os arquivos visuais para o nosso botão.
import React, { useEffect, useState } from "react";
import "./tema.css"; // O "manual de estilo" que define a aparência do botão e dos temas.
import sunIcon from "../../assets/Images/sun.png"; // A imagem do ícone de sol.
import moonIcon from "../../assets/Images/moon.png"; // A imagem do ícone de lua.


// --- PASSO 2: Construindo o Componente do Interruptor ---
// Aqui começa a definição do nosso componente. Pense nele como a planta baixa
// para construir um "interruptor de luz" para o site.
export default function ThemeToggle() {
  // --- PASSO 3: A "Memória" do Interruptor ---
  // Criamos um "estado" para que o componente possa se lembrar de qual tema está ativo.
  // Ele começa no modo 'light' (claro) por padrão.
  const [theme, setTheme] = useState("light");

  // --- PASSO 4: Verificando a Última Escolha do Usuário ---
  // Este bloco de código é executado UMA VEZ, assim que a página carrega.
  // Ele funciona como uma verificação inicial para ver como o interruptor deve estar.
  useEffect(() => {
    // Ele olha na "memória de longo prazo" do navegador (localStorage) se há um tema salvo.
    // Se não encontrar nada, ele assume o tema 'light' como padrão.
    const savedTheme = localStorage.getItem("theme") || "light";
    // Ele então atualiza sua própria memória e aplica o tema correto à página.
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []); // A lista vazia `[]` garante que isso rode apenas uma vez.

  // --- PASSO 5: A Função de "Decoração" da Página ---
  // Esta função é como um "decorador". A única tarefa dela é aplicar o
  // estilo visual (claro ou escuro) à página inteira.
  const applyTheme = (theme) => {
    // Ela muda a "classe" do corpo principal da página (<body>).
    // O nosso arquivo CSS tem regras que dizem: "se a classe for 'dark', use estas cores;
    // se for 'light', use estas outras".
    document.body.className = theme;

    // Faz o mesmo para um outro elemento específico da página, para garantir consistência.
    const contentBox = document.getElementById("home-content-box");
    if (contentBox) {
      contentBox.className = `content-box ${theme}`;
    }
  };

  // --- PASSO 6: A Ação de "Trocar o Tema" ---
  // Esta é a função que é executada toda vez que o usuário CLICA no botão.
  const toggleTheme = () => {
    // 1. Decide qual será o novo tema: se o atual é 'light', o novo será 'dark', e vice-versa.
    const newTheme = theme === "light" ? "dark" : "light";
    
    // 2. Atualiza a "memória" de curto prazo do botão com o novo tema.
    setTheme(newTheme);
    
    // 3. Salva a nova escolha na "memória de longo prazo" do navegador para que
    // da próxima vez que o usuário visitar o site, o tema já esteja como ele deixou.
    localStorage.setItem("theme", newTheme);
    
    // 4. Chama o nosso "decorador" para aplicar imediatamente as novas cores à página.
    applyTheme(newTheme);
  };

  // --- PASSO 7: Desenhando o Botão na Tela (A "Planta Baixa" do Interruptor) ---
  // O `return` descreve a aparência visual do nosso botão.
  return (
    // Cria o botão clicável. Ao ser clicado, ele aciona a função `toggleTheme`.
    <button className="theme-toggle" onClick={toggleTheme}>
        {/* Coloca a imagem do sol dentro do botão. */}
        <img src={sunIcon} className="icon" alt="Light Mode" />
        {/* Coloca a imagem da lua dentro do botão. */}
      <img src={moonIcon} className="icon" alt="Dark Mode" />
      {/* Este é o pequeno círculo que desliza para a esquerda ou direita,
          indicando qual modo está ativo. A sua posição é controlada
          pela "memória" do tema. */}
      <span className={`slider ${theme === "dark" ? "right" : "left"}`}></span>
    </button>
  );
}