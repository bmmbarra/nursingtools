// ===================================================================================
// ARQUIVO: calc-index.js (Calculadora)
//
// PROPÓSITO GERAL:
// Este arquivo constrói a página da "Calculadora". Ele oferece duas ferramentas
// de cálculo essenciais na área da saúde: uma para dosagem de Penicilina Cristalina
// e outra para calcular a velocidade de gotejamento de soro. A página também
// mantém um histórico dos últimos cálculos realizados.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Materiais ---
// Importamos as ferramentas do React para construir a página e gerenciar suas "memórias".
import { useState } from "react";
import { Link } from "react-router-dom"; // Ferramenta para criar os links de navegação.
import Theme from "../../components/Tema/tema"; // Componente para a troca de tema (claro/escuro).
import "../Calculo/calc-index.css"; // O "manual de estilo" que define a aparência da calculadora.


// --- PASSO 2: Construindo o Componente Principal da Calculadora ---
// Aqui começa a definição da nossa página de Calculadora.
export default function Penicilina() {
  // --- PASSO 3: A "Memória Digital" da Calculadora ---
  // Criamos "estados" para que nossa calculadora possa se lembrar dos números
  // digitados pelo usuário, das opções selecionadas e dos resultados.
  // Pense neles como os visores e as memórias de uma calculadora real.

  // "Memórias" para a calculadora de Penicilina.
  const [uiPrescritas, setUiPrescritas] = useState(""); // Guarda o valor das Unidades Internacionais (UI) prescritas.
  const [uiDisponivel, setUiDisponivel] = useState(""); // Guarda o valor das UI disponíveis no frasco.
  const [volumeOlivento, setVolumeOlivento] = useState(""); // Guarda o volume de diluente a ser usado.
  
  // "Memórias" para a calculadora de Gotejamento.
  const [volumeTotal, setVolumeTotal] = useState(""); // Guarda o volume total do soro em ml.
  const [tempo, setTempo] = useState(""); // Guarda o tempo (em horas ou minutos) para o soro correr.
  const [unidadeTempo, setUnidadeTempo] = useState("horas"); // Lembra se o tempo é em "horas" ou "minutos".
  const [tipoGotejamento, setTipoGotejamento] = useState("macrogotas"); // Lembra se o equipo é de "macrogotas" ou "microgotas".
  
  // "Memórias" para os resultados e o histórico.
  const [resultadoPenicilina, setResultadoPenicilina] = useState(null); // Guarda o último resultado do cálculo de penicilina.
  const [resultadoGotejamento, setResultadoGotejamento] = useState(null); // Guarda o último resultado do cálculo de gotejamento.
  const [historico, setHistorico] = useState([]); // A "fita de memória" da calculadora, que guarda os últimos 10 cálculos.

  // --- PASSO 4: As Funções de Cálculo (O "Cérebro" da Calculadora) ---

  // Define o que acontece quando o botão "Calcular Penicilina" é pressionado.
  const calcularPenicilina = () => {
      // 1. Verificação: Se algum campo estiver vazio, a função para aqui para evitar erros.
      if (!uiPrescritas || !uiDisponivel || !volumeOlivento) return;

      // 2. Preparação: Converte os textos digitados em números para fazer a conta.
      const uiP = parseFloat(uiPrescritas);
      const uiD = parseFloat(uiDisponivel);
      const volOliv = parseFloat(volumeOlivento);

      // 3. O Cálculo: Aplica a "regra de três" da enfermagem para achar o volume final a ser administrado.
      // Fórmula: (Dose Prescrita * Volume do Diluente) / Dose Disponível
      const volumeFinal = (uiP * volOliv) / uiD;

      // 4. Formatação do Resultado: Cria um "cartão de resultado" com todas as informações do cálculo.
      const novoResultado = {
          tipo: "penicilina",
          uiPrescritas: uiP,
          uiDisponivel: uiD,
          volumeOlivento: volOliv,
          volumeFinal: volumeFinal.toFixed(2), // Arredonda o resultado para 2 casas decimais.
          data: new Date().toLocaleString() // Adiciona a data e hora do cálculo.
      };

      // 5. Atualização: Mostra o resultado na tela e o adiciona no topo da "fita de memória" (histórico).
      setResultadoPenicilina(novoResultado);
      setHistorico(prev => [novoResultado, ...prev].slice(0, 10)); // Mantém apenas os últimos 10 cálculos.
  };

  // Define o que acontece quando o botão "Calcular Gotejamento" é pressionado.
  const calcularGotejamento = () => {
      // 1. Verificação: Checa se os campos de volume e tempo foram preenchidos.
      if (!volumeTotal || !tempo) return;

      // 2. Preparação: Converte os textos em números.
      const volTotal = parseFloat(volumeTotal);
      const tempoTotal = parseFloat(tempo);
      
      let resultado; // Variável para guardar o resultado final.
      
      // 3. O Cálculo com Decisões: O cálculo muda dependendo das opções escolhidas.
      // Primeiro, o código verifica se o tempo foi informado em horas ou minutos.
      if (unidadeTempo === "horas") {
          // Se for em horas, ele verifica se é macrogotas ou microgotas.
          if (tipoGotejamento === "macrogotas") {
              resultado = volTotal / (tempoTotal * 3); // Fórmula para Macrogotas em Horas.
          } else {
              resultado = volTotal / tempoTotal; // Fórmula para Microgotas em Horas.
          }
      } else { // Se o tempo for em minutos...
          // ...ele também verifica o tipo de gota.
          if (tipoGotejamento === "macrogotas") {
              resultado = (volTotal * 20) / tempoTotal; // Fórmula para Macrogotas em Minutos.
          } else {
              resultado = (volTotal * 60) / tempoTotal; // Fórmula para Microgotas em Minutos.
          }
      }

      // 4. Formatação do Resultado: Cria um "cartão de resultado" para o gotejamento.
      const novoResultado = {
          tipo: "gotejamento",
          volumeTotal: volTotal,
          tempoTotal: tempoTotal,
          unidadeTempo: unidadeTempo,
          tipoGotejamento: tipoGotejamento,
          resultado: resultado.toFixed(1), // Arredonda para 1 casa decimal.
          data: new Date().toLocaleString()
      };

      // 5. Atualização: Mostra o resultado na tela e o adiciona ao histórico.
      setResultadoGotejamento(novoResultado);
      setHistorico(prev => [novoResultado, ...prev].slice(0, 10));
  };

  // Função para o botão "Limpar Histórico".
  const limparHistorico = () => {
      // Simplesmente apaga todas as informações da "fita de memória".
      setHistorico([]);
  };

  // --- PASSO 5: Desenhando a Página na Tela (A "Planta Baixa") ---
  // O `return` contém a estrutura visual da página da calculadora.
  return (
      <div className="home-content-box">
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

          {/* O container que organiza a página com a calculadora à esquerda e o histórico à direita. */}
          <div className="main-content-wrapper">
              <div className="calculadora-container">
                  <div className='calculo'>

                      
                      {/* A seção da calculadora de Penicilina. */}
                      <div className="secao-penicilina">
                          <h3>Penicilina Cristalina</h3>
                          <label>
                              UI Prescritas:
                              <input
                                  type="number"
                                  value={uiPrescritas}
                                  onChange={(e) => setUiPrescritas(e.target.value)}
                                  placeholder="Ex: 5000000"
                              />
                          </label>
                          
                          <label>
                              UI Disponível:
                              <input
                                  type="number"
                                  value={uiDisponivel}
                                  onChange={(e) => setUiDisponivel(e.target.value)}
                                  placeholder="Ex: 10000000"
                              />
                        
                          </label>
                            
                          <label>
                              Volume Diluente (ml):
                              <input
                                  type="number"
                                  value={volumeOlivento}
                                  onChange={(e) => setVolumeOlivento(e.target.value)}
                                  placeholder="Ex: 8"
                                  step="0.1"
                              />
                          </label>
                          
                          <button onClick={calcularPenicilina}>Calcular Penicilina</button>
                          
                      
                      </div>
                          <br/>
                            
                      
                      {/* A seção da calculadora de Gotejamento. */}
                      <div className="secao-gotejamento">
                          <h3>Cálculo de Gotejamento</h3>
                          <label>
                              Volume Total (ml):
                              <input
                                  type="number"
                                  value={volumeTotal}
                                  onChange={(e) => setVolumeTotal(e.target.value)}
                                  placeholder="Ex: 500"
                              />
                          </label>
                          
                          <label>
                              Tempo:
                              <input
                                  type="number"
                                  value={tempo}
                                  onChange={(e) => setTempo(e.target.value)}
                                  placeholder="Ex: 8"
                              />
                          </label>
                          
                          {/* Caixa de seleção para Horas ou Minutos. */}
                          <label>
                              Unidade de Tempo:
                              <select
                                  value={unidadeTempo}
                                  onChange={(e) => setUnidadeTempo(e.target.value)}
                              >
                                  <option value="horas">Horas</option>
                                  <option value="minutos">Minutos</option>
                              </select>
                          </label>
                          
                          {/* Caixa de seleção para Macrogotas ou Microgotas. */}
                          <label>
                              Tipo de Gotejamento:
                              <select
                                  value={tipoGotejamento}
                                  onChange={(e) => setTipoGotejamento(e.target.value)}
                              >
                                  <option value="macrogotas">Macrogotas</option>
                                  <option value="microgotas">Microgotas</option>
                              </select>
                          </label>
                          
                          <button onClick={calcularGotejamento}>Calcular Gotejamento</button>
                          
                          
                      </div>
                  </div>
              </div>

              {/* A barra lateral direita que mostra a "fita de memória". */}
              <div className="historico-sidebar">
                  <div className="historico-header">
                      <h3>Histórico de Cálculos</h3>
                      {/* O botão "Limpar" só aparece se houver algo no histórico. */}
                      {historico.length > 0 && (
                          <button onClick={limparHistorico} className="limpar-historico">
                              Limpar
                          </button>
                      )}
                  </div>
                  
                  {/* Se o histórico tiver itens... */}
                  {historico.length > 0 ? (
                      <div className="historico-lista">
                          {/* ...o código cria um pequeno resumo para cada item guardado. */}
                          {historico.map((item, index) => (
                              <div key={index} className="historico-item">
                                  <p><strong>{item.tipo === "penicilina" ? "Penicilina" : "Gotejamento"}</strong></p>
                                  {/* O resumo é diferente para cada tipo de cálculo. */}
                                  {item.tipo === "penicilina" ? (
                                      <>
                                          <p>{item.uiPrescritas} UI • {item.volumeFinal} ml</p>
                                      </>
                                  ) : (
                                      <>
                                          <p>{item.volumeTotal} ml • {item.resultado} {item.tipoGotejamento === "macrogotas" ? "gts/min" : "mcgts/min"}</p>
                                      </>
                                  )}
                                  <p className="historico-data">{item.data}</p>
                              </div>
                          ))}
                      </div>
                  ) : (
                      // Se o histórico estiver vazio, mostra uma mensagem amigável.
                      <div className="historico-vazio">
                          <p>Nenhum cálculo no histórico</p>
                          <p>Realize cálculos para vê-los aqui</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
}