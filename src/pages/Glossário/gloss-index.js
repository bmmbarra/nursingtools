// ===================================================================================
// ARQUIVO: Glossario.js
//
// PROPÓSITO GERAL:
// Este arquivo constrói a página do "Glossário". Ele funciona como um assistente
// de chat (um "bot") que sabe as definições de vários termos técnicos. O usuário
// digita um termo, e o bot responde com a definição, se a encontrar em seu banco de dados.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Materiais ---
// Como sempre, primeiro importamos as ferramentas necessárias para a construção da página.
import { Link } from "react-router-dom"; // Ferramenta para criar links de navegação.
import "../Glossário/gloss-index.css"; // O "manual de estilo" que define a aparência do chat.
import Theme from "../../components/Tema/tema"; // O componente para trocar o tema (claro/escuro).
import { useState, useEffect } from "react"; // As "ferramentas cerebrais" do React para lembrar informações e reagir a mudanças.
import glossaryData from "../../components/Const/glossarioData"; // O mais importante: nosso "dicionário" com todos os termos e definições.


// --- PASSO 2: Construindo o Componente Principal do Glossário ---
// Aqui começa a definição da página. Tudo dentro de "Glossário" controla
// o comportamento do nosso chat de definições.
export default function Glossário() {
  // --- PASSO 3: Os "Painéis de Controle" ou a "Memória" do Chat ---
  // Criamos "estados" para que nosso componente possa se lembrar das coisas.
  // Pense neles como a memória de curto prazo do nosso bot.
  
  const [input, setInput] = useState(""); // Lembra o que o usuário está digitando na caixa de busca.
  const [messages, setMessages] = useState([]); // Guarda todo o histórico da conversa (mensagens do usuário e do bot).
  const [suggestions, setSuggestions] = useState([]); // Guarda a lista de sugestões de autopreenchimento.
  const [showSuggestions, setShowSuggestions] = useState(false); // Um interruptor que decide se a caixa de sugestões deve aparecer ou não.

  // --- PASSO 4: O "Assistente de Autopreenchimento" ---
  // Este bloco de código é um "assistente" que fica vigiando a caixa de busca.
  // Ele entra em ação toda vez que o texto digitado (`input`) pelo usuário muda.
  useEffect(() => {
    // Se a caixa de busca estiver vazia, o assistente limpa a lista de sugestões.
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    // O assistente pega o que foi digitado e procura em todo o nosso "dicionário" (`glossaryData`).
    // Ele filtra todos os termos que contenham o texto digitado.
    const matchedTerms = glossaryData.filter(item =>
      item.term.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5); // Para não sobrecarregar, ele pega apenas as 5 primeiras sugestões encontradas.

    // Por fim, ele atualiza a "memória" de sugestões com os termos que encontrou.
    setSuggestions(matchedTerms);
  }, [input]); // A "mágica" está aqui: este código só roda quando `input` muda.

  // --- PASSO 5: Ações do Usuário ---
  // Esta função define o que acontece quando o usuário clica no botão "Buscar" ou aperta Enter.
  const handleSend = () => {
    // Se o usuário não digitou nada, não fazemos nada.
    if (!input.trim()) return;

    // Procuramos no nosso "dicionário" por um termo que seja uma correspondência EXATA com o que foi digitado.
    const termEntry = glossaryData.find(item =>
      item.term.toLowerCase() === input.toLowerCase()
    );

    // Atualizamos o histórico do chat com duas novas mensagens:
    setMessages(prev => [
      ...prev, // Mantém as mensagens antigas.
      { sender: "user", text: input }, // 1. A pergunta do usuário.
      { // 2. A resposta do bot.
        sender: "bot",
        // Se o termo foi encontrado, a resposta é a definição. Senão, é uma mensagem de erro.
        text: termEntry
          ? `${termEntry.term}: ${termEntry.definition}`
          : "Termo não encontrado no glossário."
      }
    ]);

    // Limpamos a caixa de busca e escondemos as sugestões para a próxima pesquisa.
    setInput("");
    setShowSuggestions(false);
  };

  // Esta função define a lógica principal de buscar um termo e adicionar a resposta ao chat.
  // É usada tanto ao enviar quanto ao clicar em uma sugestão.
  const handleTermClick = (term) => {
    // Esvazia a caixa de busca e esconde as sugestões.
    setInput(term); // Coloca o termo clicado na caixa de busca.
    setShowSuggestions(false);
    
    // Procura a definição do termo clicado no "dicionário".
    const termEntry = glossaryData.find(item =>
      item.term.toLowerCase() === term.toLowerCase()
    );

    // Adiciona a pergunta e a resposta do bot ao histórico do chat.
    setMessages(prev => [
      ...prev,
      { sender: "user", text: term },
      {
        sender: "bot",
        text: termEntry
          ? `${termEntry.term}: ${termEntry.definition}`
          : "Termo não encontrado no glossário."
      }
    ]);
  };

  // Esta função é acionada quando o usuário clica em uma das sugestões da lista.
  const handleSuggestionClick = (term) => {
    setInput(term); // Preenche a caixa de busca com o termo clicado.
    setShowSuggestions(false); // Esconde a lista de sugestões.
    handleTermClick(term); // Executa a busca imediatamente para o termo clicado.
  };

  // Função para o botão "Limpar". É como apertar um botão de "reset".
  const handleClear = () => {
    setInput(""); // Esvazia a caixa de busca.
    setMessages([]); // Apaga todo o histórico do chat.
    setSuggestions([]); // Limpa qualquer sugestão que estivesse na memória.
    setShowSuggestions(false); // Esconde a caixa de sugestões.
  };


  // --- PASSO 6: Desenhando a Página na Tela (A "Planta Baixa") ---
  // O `return` contém a estrutura visual da página, como a planta de um arquiteto.
  return (
    <main className="home">
        <div className='home-content-box'>
          {/* O cabeçalho padrão com os links de navegação. */}
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
        <div className="glossario-box">
          {/* A "janela" do nosso chat. */}
          <div className="glossario-chat">
            {/* A área onde as mensagens do histórico são exibidas. */}
            <div className="messages">
              {/* O código pega cada mensagem da "memória" e a desenha na tela. */}
              {messages.map((msg, index) => (
                // Cada mensagem recebe um estilo diferente se for do "user" ou do "bot".
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            {/* A área de entrada de texto na parte inferior. */}
            <div className="input-area">
              <div className="suggestion-wrapper">
                {/* A caixa de texto onde o usuário digita. */}
                <input
                  type="text"
                  value={input}
                  // A cada letra digitada, atualiza a "memória" do input e mostra as sugestões.
                  onChange={e => {
                    setInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)} // Mostra sugestões quando o usuário clica na caixa.
                  // Um pequeno truque para que a caixa de sugestões não suma antes do clique ser registrado.
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Digite um termo..."
                  // Permite que o usuário aperte "Enter" para enviar a busca.
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                {/* A lista de sugestões só aparece se o interruptor estiver ligado e se houver sugestões. */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {/* Cria um item de lista clicável para cada sugestão. */}
                    {suggestions.map((item, index) => (
                      <li 
                        key={index}
                        onClick={() => handleSuggestionClick(item.term)}
                        onMouseDown={(e) => e.preventDefault()} // Evita que o input perca o foco ao clicar.
                      >
                        {item.term}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
                  {/* Os botões de Limpar e Buscar, conectados às suas respectivas funções. */}
                  <button onClick={handleClear} className="clear-button">Limpar</button>
              <button onClick={handleSend}>Buscar</button>
        
            </div>
          </div>
        </div>
          <Theme />
        </div>
    </main>
  );
}