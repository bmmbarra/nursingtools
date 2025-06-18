// ===================================================================================
// ARQUIVO: Quiz.js
//
// PROPÓSITO GERAL:
// Este arquivo é o "cérebro" e o "esqueleto" da página do Quiz.
// Ele é responsável por tudo: carregar as perguntas, organizar as unidades,
// controlar o jogo (qual pergunta está na tela, pontuação), salvar o progresso
// do jogador e, finalmente, desenhar todos os botões e textos na tela.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Materiais ---
// Antes de construir qualquer coisa, importamos as "ferramentas" necessárias.
// Pense nisso como pegar as plantas do projeto e os materiais de construção.
import React, { useState, useMemo, useEffect } from "react"; // Ferramentas do React, o "construtor" da página.
import { Link } from "react-router-dom"; // Ferramenta para criar links de navegação.
import Theme from "../../components/Tema/tema"; // Componente para trocar o tema (claro/escuro).
import questionsData from "../../components/Const/questions"; // A "lista mestra" com todas as perguntas do quiz.
import "../Quiz/quiz-index.css"; // O "manual de estilo" que define as cores e o layout.
import { screen } from '@testing-library/react'; // Ferramenta para testes (geralmente não impacta a produção).


// --- PASSO 2: Organizando o Conteúdo do Quiz ---
// Aqui, pegamos a lista mestra de perguntas e a organizamos em "capítulos".
// Cada capítulo é uma "Unidade" do nosso quiz.
const allUnits = {};
// Criamos um laço para montar 17 unidades, cada uma com suas 10 primeiras perguntas.
for (let i = 1; i <= 17; i++) {
  allUnits[`Unidade ${i}`] = questionsData.filter((q) => q.unit === i).slice(0, 10);
}

// Criamos uma "etiqueta" para a caixa onde vamos guardar o progresso do jogador.
// Isso garante que a gente sempre salve e carregue os dados do lugar certo no navegador.
const QUIZ_PROGRESS_LOCALSTORAGE_KEY = "meuQuizProgressoUnidades";


// --- PASSO 3: Construindo o Componente Principal do Quiz ---
// Agora começa a construção da página em si. Tudo que está dentro de "Quiz"
// controla o que o usuário vê e com o que ele interage.
const Quiz = () => {
  // Para sermos eficientes, "memorizamos" as unidades que organizamos antes.
  // É como deixar os capítulos do livro já separados na mesa para não ter que
  // reorganizar tudo a cada pequena ação do usuário.
  const units = useMemo(() => allUnits, []);

  // Esta é uma função "planta baixa" para criar um progresso zerado para um novo jogador.
  // Ela define que a pontuação de todas as unidades é 0 e apenas a "Unidade 1"
  // começa desbloqueada.
  const getDefaultInitialProgress = () => {
    const initial = {};
    const currentUnitKeys = Object.keys(allUnits);
    
    currentUnitKeys.forEach((unitName, index) => {
      initial[unitName] = {
        score: 0,
        completed: false,
        unlocked: index === 0, // A mágica acontece aqui: só o primeiro é "true".
        attempted: false,
      };
    });
    return initial;
  };

  // --- PASSO 4: Gerenciando o Progresso do Jogador (O "Save Game") ---
  // Este é o "painel de controle" do progresso. É a parte mais inteligente do código.
  // Ao carregar a página, ele tenta fazer o seguinte:
  const [unitProgress, setUnitProgress] = useState(() => {
    // 1. Prepara um progresso zerado, como garantia.
    const defaultProgress = getDefaultInitialProgress();

    try {
      // 2. Tenta encontrar um progresso salvo no "depósito" do navegador (localStorage).
      const savedProgressString = localStorage.getItem(QUIZ_PROGRESS_LOCALSTORAGE_KEY);
      
      // 3. Se encontrou um progresso salvo...
      if (savedProgressString) {
        const loadedSavedProgress = JSON.parse(savedProgressString);
        const combinedProgress = {};
        let atLeastOneUnitIsCurrentlyUnlocked = false;
        const currentUnitKeysFromCode = Object.keys(allUnits);

        // ...ele verifica o progresso salvo, unidade por unidade, e o compara com o
        // estado atual do código. Isso evita que o jogo quebre se, por exemplo,
        // adicionarmos novas unidades no futuro. É uma verificação de segurança.
        currentUnitKeysFromCode.forEach((unitName) => {
          const defaultUnitDataForThisUnit = defaultProgress[unitName] || { score: 0, completed: false, unlocked: false, attempted: false };
          const savedUnitData = loadedSavedProgress[unitName];

          // Ele mescla os dados salvos com os padrões para garantir que nada falte.
          if (savedUnitData) {
            combinedProgress[unitName] = {
              score: typeof savedUnitData.score === 'number' ? savedUnitData.score : defaultUnitDataForThisUnit.score,
              completed: typeof savedUnitData.completed === 'boolean' ? savedUnitData.completed : defaultUnitDataForThisUnit.completed,
              unlocked: typeof savedUnitData.unlocked === 'boolean' ? savedUnitData.unlocked : defaultUnitDataForThisUnit.unlocked,
              attempted: typeof savedUnitData.attempted === 'boolean' ? savedUnitData.attempted : defaultUnitDataForThisUnit.attempted,
            };
          } else {
            combinedProgress[unitName] = defaultUnitDataForThisUnit;
          }

          if (combinedProgress[unitName]?.unlocked) {
            atLeastOneUnitIsCurrentlyUnlocked = true;
          }
        });

        // 4. Como uma camada extra de segurança, se por algum motivo nenhum progresso salvo
        // tiver uma unidade desbloqueada, ele desbloqueia a primeira para garantir que o jogador não fique travado.
        if (!atLeastOneUnitIsCurrentlyUnlocked && currentUnitKeysFromCode.length > 0) {
          const firstUnitNameInCode = currentUnitKeysFromCode[0];
          if (combinedProgress[firstUnitNameInCode]) {
            combinedProgress[firstUnitNameInCode].unlocked = true;
          }
        }
        return combinedProgress;
      
      // 5. Se não encontrou nenhum progresso salvo, simplesmente usa o progresso zerado.
      } else {
        return defaultProgress;
      }
    // 6. Se der qualquer erro ao tentar ler os dados, ele usa o progresso zerado para não travar.
    } catch (error) {
      console.error("Falha ao carregar/processar o progresso do localStorage:", error);
      return defaultProgress;
    }
  });

  // --- PASSO 5: A Função de "Salvamento Automático" ---
  // Este bloco de código funciona como um "vigia". Ele fica observando o painel de progresso (`unitProgress`).
  // Toda vez que o progresso do jogador muda (uma nova pontuação, uma unidade desbloqueada),
  // ele automaticamente salva a versão mais recente no "depósito" do navegador.
  useEffect(() => {
    try {
      if (Object.keys(unitProgress).length > 0) {
        localStorage.setItem(QUIZ_PROGRESS_LOCALSTORAGE_KEY, JSON.stringify(unitProgress));
      } else if (localStorage.getItem(QUIZ_PROGRESS_LOCALSTORAGE_KEY)) {
        localStorage.removeItem(QUIZ_PROGRESS_LOCALSTORAGE_KEY);
      }
    } catch (error) {
      console.error("Falha ao salvar o progresso no localStorage:", error);
    }
  }, [unitProgress]); // A "mágica" está aqui: ele só executa quando `unitProgress` muda.


  // --- PASSO 6: Controles para o Quiz em Andamento ---
  // Estes são os "controles de mão" que gerenciam um quiz enquanto ele está acontecendo.
  const [selectedUnit, setSelectedUnit] = useState(null); // Guarda qual unidade o jogador escolheu.
  const [current, setCurrent] = useState(0); // Qual a pergunta atual (a primeira, segunda, etc.).
  const [selected, setSelected] = useState(null); // Qual opção o jogador acabou de clicar.
  const [score, setScore] = useState(0); // A pontuação da tentativa ATUAL.
  const [finished, setFinished] = useState(false); // Se o quiz da unidade terminou ou não.
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Lista de perguntas já respondidas.

  // Pega as perguntas certas da unidade que o jogador selecionou.
  const questions = selectedUnit ? units[selectedUnit] || [] : [];

  // --- PASSO 7: Ações do Jogador ---
  // A função que é executada quando o jogador clica para começar uma unidade.
  const handleUnitSelect = (unitName) => {
    // Primeiro, uma verificação de segurança: a unidade está desbloqueada?
    if (!unitProgress[unitName]?.unlocked) {
      alert("🔒 Esta unidade está bloqueada. Complete a unidade anterior com pelo menos 70% de acerto para desbloqueá-la.");
      return; // Se estiver bloqueada, a função para aqui.
    }
    // Segunda verificação: esta unidade tem perguntas?
    if (!units[unitName] || units[unitName].length === 0) {
        alert("📝 Esta unidade não possui perguntas no momento.");
        return;
    }

    // Se tudo estiver certo, preparamos o "tabuleiro" para um novo jogo.
    setSelectedUnit(unitName); // Marca qual unidade estamos jogando.
    setCurrent(0); // Volta para a primeira pergunta.
    setSelected(null); // Limpa a resposta selecionada anteriormente.
    setScore(0); // Zera a pontuação da tentativa.
    setFinished(false); // Marca que o jogo está em andamento.
    setAnsweredQuestions([]); // Limpa o histórico de perguntas respondidas.
  };

  // A função que é executada quando o jogador clica em uma das opções de resposta.
  const handleAnswer = (option) => {
    // Marca a opção que o jogador escolheu.
    setSelected(option);
    let currentAttemptScore = score;
    // Verifica se a resposta está correta.
    if (option === questions[current].answer) {
      // Se estiver correta, aumenta a pontuação da tentativa atual.
      currentAttemptScore++;
      setScore(s => s + 1);
    }

    if (!answeredQuestions.includes(current)) {
      setAnsweredQuestions([...answeredQuestions, current]);
    }

    // Espera 1 segundo para o jogador ver se acertou ou errou (efeito visual).
    setTimeout(() => {
      // Depois da pausa, verifica se ainda há perguntas na unidade.
      if (current + 1 < questions.length) {
        // Se houver, avança para a próxima pergunta.
        setCurrent(current + 1);
        setSelected(null); // Limpa a seleção para a nova pergunta.
      } else {
        // Se não houver mais perguntas, o quiz da unidade terminou.
        setFinished(true);
        const finalUnitScore = currentAttemptScore;
        const numQuestions = questions.length;
        const percentage = numQuestions > 0 ? (finalUnitScore / numQuestions) * 100 : 0;
        const unitName = selectedUnit;

        // --- A Grande Atualização ---
        // Agora, atualizamos o "painel de controle" geral com o resultado do quiz.
        setUnitProgress(prevProgress => {
          const newProgressDataForUnit = {
            ...prevProgress[unitName],
            score: finalUnitScore, // Atualiza a pontuação.
            completed: true, // Marca a unidade como "concluída".
            attempted: true,
          };

          const updatedOverallProgress = {
            ...prevProgress,
            [unitName]: newProgressDataForUnit,
          };

          // --- A Regra de Desbloqueio ---
          // Se o jogador acertou 70% ou mais...
          if (percentage >= 70 && numQuestions > 0) {
            const unitKeys = Object.keys(units);
            const currentUnitIndex = unitKeys.indexOf(unitName);
            // ...e não for a última unidade...
            if (currentUnitIndex < unitKeys.length - 1) {
              // ...desbloqueamos a próxima unidade da lista!
              const nextUnitName = unitKeys[currentUnitIndex + 1];
              updatedOverallProgress[nextUnitName] = {
                ...prevProgress[nextUnitName],
                unlocked: true,
              };
            }
          }
          // Retorna o novo estado de progresso, que será salvo automaticamente.
          return updatedOverallProgress;
        });
      }
    }, 1000); // 1000 milissegundos = 1 segundo de pausa.
  };

  // Funções de "conveniência" para os botões da tela de resultado.
  // Permite ao jogador voltar para a tela de seleção de unidades.
  const restartQuizAndGoToSelection = () => {
    setSelectedUnit(null);
  };

  // Permite ao jogador tentar a mesma unidade novamente.
  const tryAgainCurrentUnit = () => {
    if (selectedUnit) {
      handleUnitSelect(selectedUnit);
    }
  };

  // Permite ao jogador avançar para a próxima unidade (se estiver desbloqueada).
  const advanceToNextUnit = () => {
    const unitKeys = Object.keys(units);
    const currentUnitIndex = unitKeys.indexOf(selectedUnit);
    if (currentUnitIndex < unitKeys.length - 1) {
      const nextUnitName = unitKeys[currentUnitIndex + 1];
      if (unitProgress[nextUnitName]?.unlocked) {
        handleUnitSelect(nextUnitName);
      } else {
        alert("Erro: A próxima unidade não está desbloqueada.");
        setSelectedUnit(null);
      }
    }
  };

  // Lógica auxiliar para saber qual é a próxima unidade.
  const currentUnitIndexGlobal = selectedUnit ? Object.keys(units).indexOf(selectedUnit) : -1;
  const nextUnitNameGlobal = currentUnitIndexGlobal !== -1 && currentUnitIndexGlobal < Object.keys(units).length - 1
    ? Object.keys(units)[currentUnitIndexGlobal + 1]
    : null;


  // --- PASSO 8: Desenhando a Página na Tela (A "Planta Baixa") ---
  // Tudo dentro do `return` é o que será efetivamente desenhado na tela.
  // É como a planta de um arquiteto, dizendo onde cada parede, porta e janela vai ficar.
  return (
    <div className="home-content-box">
      {/* O cabeçalho da página com os links de navegação. */}
      <div className="header-background">
              <header className="custom-header">
                <div className="dot_home">
                  <Link to="/" className="bar-link-home" />
                </div>
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
                <div className="dot-about">
                  <Link to="/sobre" className="bar-link-about" />
                </div>
              </header>
            </div>
      
            <Theme />

      {/* O container principal que segura a barra lateral e a área do quiz. */}
      <div className="quiz-wrapper">
        {/* A barra lateral esquerda que lista todas as unidades. */}
        <aside className="quiz-sidebar">
          <h3>Unidades</h3>
          <ul className="unit-list-vertical">
            {/* Aqui, o código cria um botão para cada unidade existente. */}
            {Object.keys(units).map((unitName) => {
              // Para cada unidade, ele verifica o progresso do jogador.
              const progress = unitProgress[unitName] || { 
                score: 0, 
                completed: false, 
                unlocked: (Object.keys(units).indexOf(unitName) === 0), 
                attempted: false 
              };
              const unitData = units[unitName] || [];
              let statusIndicator = "";
              let itemClassName = "";

              // E, com base no progresso, decide qual ícone e cor usar.
              // Se não estiver desbloqueada, mostra um cadeado 🔒.
              if (!progress?.unlocked) {
                statusIndicator = " 🔒";
                itemClassName = "locked";
              // Se já foi concluída...
              } else if (progress?.completed) {
                itemClassName = "completed";
                // ...e a nota for boa, mostra um check ✅.
                if (unitData.length > 0 && (progress.score / unitData.length) * 100 >= 70) {
                  statusIndicator = " ✅";
                  itemClassName += " passed";
                // ...e a nota for ruim, mostra um X ❌.
                } else if (unitData.length > 0) {
                  statusIndicator = " ❌";
                  itemClassName += " failed";
                } else {
                    statusIndicator = " N/A";
                    itemClassName += " empty";
                }
              // Se estiver desbloqueada mas não concluída, mostra uma seta ➡️.
              } else {
                statusIndicator = " ➡️";
                itemClassName = "unlocked";
              }

              return (
                <li key={unitName}>
                  <button
                    className={`unit-tab ${selectedUnit === unitName ? "active" : ""} ${itemClassName}`}
                    onClick={() => handleUnitSelect(unitName)}
                    // O botão fica desabilitado se a unidade estiver bloqueada ou vazia.
                    disabled={!progress?.unlocked || (units[unitName] && units[unitName].length === 0)}
                  >
                    {unitName}
                    {statusIndicator}
                    {units[unitName] && units[unitName].length === 0 && progress?.unlocked && " (Vazia)"}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* A área principal à direita, onde o quiz acontece. */}
        <main className="quiz-main">
          {/* O que mostrar aqui depende do estado do jogo. */}
          {!selectedUnit ? (
            // Se nenhuma unidade foi selecionada, mostra uma tela de boas-vindas.
            <div className="unit-placeholder">
              <p>👋 Bem-vindo ao Quiz! Selecione uma unidade ao lado para começar.</p>
              <p><small>Seu progresso será salvo automaticamente.</small></p>
            </div>
          ) : finished ? (
            // Se o quiz da unidade terminou, mostra a tela de resultado.
            <div className="result">
              <h2>Resultado da {selectedUnit}</h2>
              <p>
                Você acertou {score} de {questions.length} perguntas (
                {questions.length > 0 ? ((score / questions.length) * 100).toFixed(0) : 0}%)
              </p>
              {/* Mensagens de incentivo com base na pontuação. */}
              {questions.length > 0 && (score / questions.length) * 100 >= 70 ? (
                <>
                  <p><strong>🎉 Parabéns! Você passou nesta unidade.</strong></p>
                  {/* Mostra o botão para avançar apenas se a próxima unidade estiver desbloqueada. */}
                  {nextUnitNameGlobal && unitProgress[nextUnitNameGlobal]?.unlocked ? (
                    <button onClick={advanceToNextUnit} className="next-unit-button">
                      Ir para {nextUnitNameGlobal} ➡️
                    </button>
                  ) : (
                      Object.keys(units).indexOf(selectedUnit) === Object.keys(units).length - 1 && <p>🏆 Você completou todas as unidades!</p>
                  )}
                </>
              ) : questions.length > 0 ? (
                <p>Você precisa acertar pelo menos 70% para desbloquear a próxima unidade. Não desanime! 💪</p>
              ) : (
                <p>Esta unidade não continha perguntas para avaliação.</p>
              )}
              {/* Botões para tentar novamente ou escolher outra unidade. */}
              {questions.length > 0 && <button onClick={tryAgainCurrentUnit}>Tentar Novamente {selectedUnit} 🔁</button>}
              <button onClick={restartQuizAndGoToSelection}>Escolher outra unidade 📚</button>
            </div>
          ) : questions.length > 0 ? (
            // Se um quiz está em andamento, mostra a caixa com a pergunta e as opções.
            <div className="question-box">
              <h2>{questions[current]?.question}</h2>
              <div className="options">
                {/* Cria um botão para cada opção de resposta. */}
                {questions[current].options.map((option) => (
                  <button
                    key={option}
                    // A cor do botão muda para verde ou vermelho após a resposta.
                    className={`option-button ${
                      selected
                        ? option === questions[current].answer
                          ? "correct"
                          : option === selected
                          ? "incorrect"
                          : ""
                        : ""
                    }`}
                    onClick={() => handleAnswer(option)}
                    // Desabilita os botões após uma resposta ser escolhida.
                    disabled={!!selected}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {/* As bolinhas que mostram o progresso dentro da unidade. */}
              <div className="quiz-progress">
                {[...Array(questions.length)].map((_, index) => (
                  <div
                    key={index}
                    className={`progress-dot ${
                      answeredQuestions.includes(index) ? "answered" : ""
                    } ${index === current ? "current" : ""}`}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
              // Se a unidade selecionada não tem perguntas, mostra uma mensagem de aviso.
              <div className="unit-placeholder">
                <p>😕 Parece que não há perguntas para a {selectedUnit}. Por favor, selecione outra unidade.</p>
                <button onClick={restartQuizAndGoToSelection}>Voltar para seleção</button>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Finalmente, "exportamos" nosso componente Quiz para que outras partes do site possam usá-lo.
export default Quiz;