// ===================================================================================
// ARQUIVO: Home.js
//
// PROPÓSITO GERAL:
// Este arquivo é o responsável por construir a página inicial (Home) da aplicação.
// A principal característica desta página é um carrossel interativo que exibe
// cartões de informação sobre diferentes medicamentos. O código gerencia tanto a
// exibição e automação do carrossel quanto a sua interatividade com o usuário.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Materiais ---
// Antes de começar a construção, importamos as ferramentas e os "materiais"
// necessários, como as funções do React, o criador de links, o arquivo de
// estilo e as imagens que serão usadas.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Home/home-index.css"; // O "manual de estilo" que define as cores e o layout.
import Theme from "../../components/Tema/tema"; // O componente que permite trocar o tema (claro/escuro).
import logoRemedioImg from '../../assets/Images/logo-rem.png'; // Imagem do logo para o cartão.
import logoMedicamento from '../../assets/Images/logo-medicamento.png'; // Outra imagem de logo para o cartão.


// --- PASSO 2: Construindo o Componente da Página Inicial ---
// Aqui começa a definição do componente "Home". Tudo que está aqui dentro
// descreve como a página inicial deve funcionar e se parecer.
const Home = () => {
  // --- PASSO 2.1: Nosso Catálogo de Medicamentos ---
  // Criamos uma lista fixa, como se fosse um "catálogo" ou uma enciclopédia,
  // com as informações de cada medicamento que queremos mostrar no carrossel.
  // Cada item da lista é um "cartão de informações".
  const medicamentos = [
     {
    nome: "Paracetamol",
    descricao: "Analgésico e antitérmico para dores leves, moderadas e febre.",
    dose: "500mg ou 750mg",
    frequencia: "1 comprimido a cada 4 a 6 horas",
    faixaEtaria: "Adultos e crianças acima de 12 anos",
    classe: "paracetamol",
  },
  {
    nome: "Dipirona Monoidratada",
    descricao: "Analgésico e antitérmico para tratamento de dor e febre.",
    dose: "500mg ou 1g",
    frequencia: "1 comprimido a cada 6 horas (máx. 4x ao dia)",
    faixaEtaria: "Adultos e adolescentes acima de 15 anos",
    classe: "dipirona",
  },
  {
    nome: "Ibuprofeno",
    descricao: "Anti-inflamatório com ação analgésica e antitérmica.",
    dose: "400mg ou 600mg",
    frequencia: "1 comprimido a cada 6 ou 8 horas",
    faixaEtaria: "Adultos e crianças acima de 12 anos",
    classe: "ibuprofeno",
  },
  {
    nome: "Amoxicilina",
    descricao: "Antibiótico para tratamento de diversas infecções bacterianas.",
    dose: "500mg",
    frequencia: "1 cápsula a cada 8 horas",
    faixaEtaria: "Uso adulto e pediátrico (sob prescrição)",
    classe: "amoxicilina",
  },
  {
    nome: "Cloridrato de Metformina",
    descricao: "Antidiabético oral para tratamento do diabetes tipo 2.",
    dose: "500mg ou 850mg",
    frequencia: "1 a 2 vezes ao dia, com as refeições",
    faixaEtaria: "Adultos e crianças acima de 10 anos",
    classe: "metformina",
  },
  {
    nome: "Omeprazol",
    descricao: "Reduz a acidez do estômago. Para úlceras, refluxo e gastrite.",
    dose: "20mg",
    frequencia: "1 cápsula ao dia, pela manhã",
    faixaEtaria: "Adultos e crianças acima de 1 ano",
    classe: "omeprazol",
  },
  {
    nome: "Amoxicilina + Clavulanato de Potássio",
    descricao: "Antibiótico potente para infecções bacterianas resistentes.",
    dose: "875mg + 125mg",
    frequencia: "1 comprimido a cada 12 horas",
    faixaEtaria: "Adultos e crianças acima de 12 anos",
    classe: "amoxicilina",
  },
  {
    nome: "Cloridrato de Metformina XR",
    descricao: "Versão de liberação prolongada para tratamento do diabetes tipo 2.",
    dose: "500mg, 750mg ou 1000mg",
    frequencia: "1 vez ao dia, ao jantar",
    faixaEtaria: "Adultos e adolescentes acima de 17 anos",
    classe: "metformina",
  },
  {
    nome: "Dipirona Sódica (Gotas)",
    descricao: "Analgésico e antitérmico em gotas para dor e febre.",
    dose: "500mg/mL",
    frequencia: "20 a 40 gotas, até 4x ao dia",
    faixaEtaria: "Adultos e crianças acima de 3 meses",
    classe: "dipirona",
  },
  {
    nome: "Ibuprofeno (Suspensão Infantil)",
    descricao: "Suspensão infantil para alívio de febre e dores.",
    dose: "100mg/5mL",
    frequencia: "A cada 6 a 8 horas (dose por peso)",
    faixaEtaria: "Crianças a partir de 6 meses",
    classe: "ibuprofeno",
  },
  {
    nome: "Paracetamol (Suspensão Infantil)",
    descricao: "Suspensão infantil para tratamento de febre e dor.",
    dose: "100mg/mL (Gotas) ou 32mg/mL",
    frequencia: "A cada 4 a 6 horas (dose por peso)",
    faixaEtaria: "Uso pediátrico desde o nascimento (com orientação médica)",
    classe: "paracetamol",
  },
  {
    nome: "Amoxicilina (Suspensão Infantil)",
    descricao: "Suspensão antibiótica para infecções em crianças.",
    dose: "250mg/5mL ou 500mg/5mL",
    frequencia: "A cada 8 ou 12 horas",
    faixaEtaria: "Uso pediátrico (dose por peso)",
    classe: "amoxicilina",
  },
  {
    nome: "Ibuprofeno (Gel Tópico)",
    descricao: "Gel tópico para alívio de dores musculares e inflamações locais.",
    dose: "50mg/g (5%)",
    frequencia: "Aplicar 3 a 4 vezes ao dia",
    faixaEtaria: "Adultos e crianças acima de 12 anos",
    classe: "ibuprofeno",
  },
];

 // --- PASSO 3: Os "Painéis de Controle" do Carrossel ---
  // Usamos "estados" para controlar as partes dinâmicas do carrossel.
  // Pense neles como botões e alavancas em um painel de controle.

  // Este é o controle principal: ele sabe qual cartão está no centro da tela.
  // Começa no primeiro cartão (índice 0).
  const [index, setIndex] = useState(0);

  // Controles auxiliares para a função de arrastar/deslizar:
  const [dragStartX, setDragStartX] = useState(null); // Guarda onde o dedo/mouse começou a arrastar.
  const [dragging, setDragging] = useState(false); // Diz se o usuário está arrastando AGORA.
  const [enableTransition, setEnableTransition] = useState(true); // Controla a animação suave de deslizamento.

  // --- PASSO 4: O "Piloto Automático" do Carrossel ---
  // Este bloco de código cria a funcionalidade de avanço automático.
  useEffect(() => {
    // Inicia um "cronômetro" que executa uma ação a cada 10 segundos.
    const interval = setInterval(() => {
      // A cada 10 segundos, ele avança o "índice" para o próximo cartão.
      // A fórmula com "%" garante que, ao chegar no final, ele volte para o começo, criando um loop.
      setIndex((prevIndex) => (prevIndex + 1) % medicamentos.length);
    }, 10000); // 10000 milissegundos = 10 segundos.

    // Medida de segurança: quando o usuário sai da página, o cronômetro é desligado
    // para não causar erros ou usar recursos do computador desnecessariamente.
    return () => clearInterval(interval);
  }, [medicamentos.length]);


  // --- PASSO 5: Comandos para Arrastar com o MOUSE ---
  // Estas funções definem como o carrossel reage ao mouse do computador.

  // Quando o botão do mouse é PRESSIONADO:
  const handleMouseDown = (e) => {
    setDragStartX(e.clientX); // Grava a posição inicial do clique.
    setDragging(true); // Ativa o "modo de arrastar".
    setEnableTransition(false); // Desliga a animação suave para que o arrastar seja instantâneo.
  };

  // Enquanto o mouse se MOVE (com o botão pressionado):
  const handleMouseMove = (e) => {
    if (!dragging) return; // Se não estiver no "modo de arrastar", não faz nada.
    const deltaX = e.clientX - dragStartX; // Calcula o quanto o mouse se moveu.
    // Se o movimento for maior que uma pequena distância (50 pixels)...
    if (Math.abs(deltaX) > 50) {
      // ...ele muda o cartão para o próximo (ou anterior, dependendo da direção).
      setIndex((prevIndex) =>
        (prevIndex + (deltaX > 0 ? -1 : 1) + medicamentos.length) % medicamentos.length
      );
      setDragging(false); // Sai do "modo de arrastar" para não trocar vários cartões de uma vez.
      setEnableTransition(true); // Liga a animação suave de volta.
    }
  };

  // Quando o botão do mouse é SOLTO:
  const handleMouseUp = () => {
    setDragging(false); // Desativa o "modo de arrastar".
    setDragStartX(null); // Limpa a posição inicial.
    setEnableTransition(true); // Garante que a animação suave esteja ligada.
  };

  
  // --- PASSO 6: Comandos para Deslizar com o TOQUE (Touchscreen) ---
  // Estas funções são IDÊNTICAS às do mouse, mas para telas de toque (celulares, tablets).
  // Isso garante que a experiência de deslizar com o dedo seja a mesma de arrastar com o mouse.
  const handleTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
    setDragging(true);
    setEnableTransition(false);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 50) {
      setIndex((prevIndex) =>
        (prevIndex + (deltaX > 0 ? -1 : 1) + medicamentos.length) % medicamentos.length
      );
      setDragging(false);
      setEnableTransition(true);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setDragStartX(null);
    setEnableTransition(true);
  };

  // --- PASSO 7: O "Diretor de Palco" ---
  // Esta função é como um "diretor de palco". Ela olha para cada cartão e decide
  // onde ele deve ficar no palco (na tela), criando o efeito do carrossel.
  const getItemClass = (i) => {
    // Calcula a posição do cartão em relação ao que está no centro.
    const relativeIndex = ((i - index + medicamentos.length) % medicamentos.length);
    // Define a "classe" (posição) do cartão:
    if (relativeIndex === 0) return "item center"; // No centro do palco.
    if (relativeIndex === 1) return "item right-1"; // Um pouco à direita.
    if (relativeIndex === 2) return "item right-2"; // Mais à direita.
    if (relativeIndex === medicamentos.length - 1) return "item left-1"; // Um pouco à esquerda.
    if (relativeIndex === medicamentos.length - 2) return "item left-2"; // Mais à esquerda.
    return "item hidden"; // Fora do palco (escondido).
  };

  // --- PASSO 8: Desenhando a Página na Tela (A "Planta Baixa") ---
  // O `return` contém a estrutura visual da página, como uma planta de arquiteto.
  return (
    <main className="home">
      <div className='home-content-box'>
        {/* O cabeçalho da página com os links de navegação. */}
        <div className="header-background">
          <header className="custom-header">
            <div className="dot_home">
              <Link to="/" className="bar-link-home" />
            </div>
            <div className="dot" />
            <div className="dot" />
            <Link to="/formulario" className="bar-link">Relatório de Estágio</Link>
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <Link to="/calculo" className="bar-link">Calculadora</Link>
            <div className="dot" />
            <div className="dot" />
            <Link to="/glossario" className="bar-link">Glossário</Link>
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <Link to="/quiz" className="bar-link">Quiz</Link>
            <div className="dot" />
            <div className="dot" />
            <div className="dot-about">
              <Link to="/sobre" className="bar-link-about" />
            </div>

          </header>
        </div>

        {/* O componente que adiciona o botão de troca de tema. */}
        <Theme />

        {/* O "palco" principal onde o carrossel é exibido. */}
        <div className="carousel-container">
          {/* A "pista" do carrossel que se move. É aqui que ligamos todas as funções
              de mouse e toque que definimos antes. */}
          <div
            className={`carousel-track ${enableTransition ? "with-transition" : "no-transition"}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Importante para quando o mouse sai da área.
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* A "fábrica" de cartões: Pega nosso catálogo de medicamentos e cria um
                cartão visual para cada um. */}
            {medicamentos.map((med, i) => (
              // Cada cartão é criado aqui.
              // A função "diretor de palco" (getItemClass) define sua posição na tela.
              <div key={i} className={`${getItemClass(i)} ${med.classe}`}>
                {/* O conteúdo visual de um único cartão. */}
                <img src={logoRemedioImg} alt="Logo Remédio" className="card-logo-header" />
                <div className="med-info-container">
                  <div className="med-nome-topo">{med.nome}</div>
                  <p className="med-descricao">{med.descricao}</p>
                </div>
                <div className="tarja-amarela">
                  <img src={logoMedicamento} alt="Logo Medicamento" className="card-logo" />
                  <div className="tarja-content" />
                </div>
                <div className="tarja-vermelha">
                  <div className="tarja-content">
                  
                    <p><strong>Dose:</strong> {med.dose}</p>
                    <p><strong>Frequência:</strong> {med.frequencia}</p>
                    <p><strong>Idade:</strong> {med.faixaEtaria}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

// Finalmente, "exportamos" nosso componente Home para que ele possa ser usado no site.
export default Home;
