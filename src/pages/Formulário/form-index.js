// ===================================================================================
// ARQUIVO: FormularioEstagio.js
//
// PROPÓSITO GERAL:
// Este arquivo constrói a página do "Formulário de Estágio". Ele funciona como um
// assistente digital para preencher relatórios e checklists de diferentes Unidades
// Curriculares (UCs). O usuário seleciona a empresa, a UC e o tipo de documento,
// preenche os dados, e ao final, pode gerar um arquivo PDF com todas as informações.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e os Modelos de Documento ---
// Primeiro, importamos tudo que precisamos para construir e operar o formulário.
import { useState } from "react"; // A principal ferramenta do React para "lembrar" das informações preenchidas.
import { Link } from "react-router-dom"; // Ferramenta para criar os links de navegação no cabeçalho.
import Theme from "../../components/Tema/tema"; // O componente que permite trocar o tema (claro/escuro).
import empresas from "../../components/Const/empresas"; // Nosso "banco de dados" com as informações das empresas.
import RelatorioUC4 from "../../components/Relatorios/relatoriouc4"; // O "modelo" do formulário de relatório da UC4.
import RelatorioUC7 from "../../components/Relatorios/relatoriouc7"; // O "modelo" do formulário de relatório da UC7.
import RelatorioUC10 from "../../components/Relatorios/relatoriouc10"; // O "modelo" do formulário de relatório da UC10.
import RelatorioUC17 from "../../components/Relatorios/relatoriouc17"; // O "modelo" do formulário de relatório da UC17.
import ChecklistUC from "../../components/Checklist/checklistuc"; // O "modelo" do formulário de checklist.
import gerarPDF from "../../assets/utils/pdfgenerator"; // A "máquina de impressão" que gera o PDF no final.
import "../Formulário/form-index.css"; // O "manual de estilo" que define a aparência do formulário.


// --- PASSO 2: Definindo as Opções Fixas ---
// Para manter o código organizado, criamos listas com as opções que aparecerão
// como botões de seleção para o usuário.
const ucs = ["UC4", "UC7", "UC10", "UC17"]; // As Unidades Curriculares disponíveis.
const abas = ["Relatório", "Checklist"]; // Os tipos de documento disponíveis.


// --- PASSO 3: Construindo o Componente Principal do Formulário ---
// Aqui começa a definição do nosso assistente de formulário.
export default function FormularioEstagio() {
  // --- PASSO 3.1: A "Memória Central" do Formulário ---
  // Criamos vários "estados" para que o formulário possa se lembrar das escolhas do usuário
  // e das informações digitadas. Pense em cada um como uma "pasta" na memória.
  
  const [ucSelecionada, setUcSelecionada] = useState("UC4"); // Pasta que guarda qual UC está selecionada.
  const [abaAtiva, setAbaAtiva] = useState("Relatório"); // Pasta que guarda qual aba ("Relatório" ou "Checklist") está ativa.
  const [empresaSelecionada, setEmpresaSelecionada] = useState(""); // Pasta que lembra o nome da empresa escolhida.
  const [dadosEmpresa, setDadosEmpresa] = useState({}); // Pasta para os detalhes da empresa (preenchidos automaticamente e manualmente).
  const [dadosRelatorio, setDadosRelatorio] = useState({}); // Pasta que armazena todas as respostas do formulário de relatório.
  const [dadosChecklist, setDadosChecklist] = useState({}); // Pasta que armazena todos os itens marcados no checklist.

  // --- PASSO 4: As Funções do Assistente ---

  // Esta função é um "assistente de autopreenchimento".
  // Quando o usuário escolhe uma empresa na lista, esta função é acionada.
  const preencherEmpresa = (nome) => {
    // Ela busca os dados da empresa no nosso "banco de dados"...
    const dados = empresas[nome] || {};
    // ...e atualiza a memória com o nome da empresa e seus dados.
    setEmpresaSelecionada(nome);
    setDadosEmpresa({ ...dados, periodoEstagio: "" }); // Preenche tudo e deixa o período do estágio em branco para o usuário digitar.
  };

  // Esta função é o comando do botão "Salvar PDF".
  const handleGerarPDF = () => {
    /* O trecho comentado abaixo representa uma validação futura.
       A ideia era verificar se todos os campos obrigatórios foram preenchidos
       antes de permitir a geração do PDF, mostrando um alerta em caso de erro.
       const erro = validarCamposParaPDF({ ... });
       if (erro) {
         alert(`⚠️ ${erro}`);
         return;
       }
    */

    // A função reúne todas as informações das nossas "pastas" de memória...
    gerarPDF({
      uc: ucSelecionada,
      empresa: { nome: empresaSelecionada, ...dadosEmpresa },
      relatorio: dadosRelatorio,
      checklist: dadosChecklist,
      tipo: abaAtiva,
    }); // ...e as entrega para a nossa "máquina de impressão" (`gerarPDF`) criar o documento.
  };

  // Esta função é um "seletor inteligente de formulários".
  // Ela decide qual modelo de relatório deve ser mostrado na tela.
  const renderRelatorioUC = () => {
    // Prepara um "pacote" de informações para passar para o modelo de formulário.
    const props = {
      uc: ucSelecionada,
      dados: dadosRelatorio,
      setDados: setDadosRelatorio,
    };
    // Ele olha qual UC está selecionada...
    switch (ucSelecionada) {
      // ...e escolhe o componente de relatório correspondente para exibir.
      case "UC4":
        return <RelatorioUC4 {...props} />;
      case "UC7":
        return <RelatorioUC7 {...props} />;
      case "UC10":
        return <RelatorioUC10 {...props} />;
      case "UC17":
        return <RelatorioUC17 {...props} />;
      default:
        return null; // Se nenhuma UC for válida, não mostra nada.
    }
  };


  // --- PASSO 5: Desenhando a Página na Tela (A "Planta Baixa") ---
  // O `return` contém a estrutura visual de toda a página do formulário.
  return (
    <main className="extra">
      <div className="home-content-box">
        {/* O cabeçalho padrão com os links de navegação. */}
        <div className="header-background">
          <header className="custom-header">
            <div className="dot_home">
              <Link to="/" className="bar-link-home" />
            </div>
            <div className="dot" /><div className="dot" />
            <Link to="/glossario" className="bar-link">Glossário</Link>
            <div className="dot" /><div className="dot" />
            <Link to="/calculo" className="bar-link">Calculadora</Link>
            <div className="dot" /><div className="dot" />
            <Link to="/formulario" className="bar-link">Formulário</Link>
            <div className="dot" /><div className="dot" />
            <Link to="/quiz" className="bar-link">Quiz</Link>
            <div className="dot" /><div className="dot" />
            <div className="dot-about">
              <Link to="/sobre" className="bar-link-about" />
            </div>
          </header>
        </div>

        <Theme />

        {/* O container principal que envolve todo o nosso formulário. */}
        <div className="formulario-container">
          <h2 className="titulo">Formulário de Estágio Supervisionado</h2>

          {/* O grid que divide o formulário em duas colunas para melhor organização. */}
          <div className="form-grid">
            {/* Coluna da Esquerda: Seleção e dados da empresa. */}
            <div className="col-esquerda">
              <label><strong>Empresa afiliada:</strong></label>
              {/* Caixa de seleção que aciona o "assistente de autopreenchimento". */}
              <select onChange={(e) => preencherEmpresa(e.target.value)}>
                <option value="">Selecione uma empresa</option>
                {/* Cria uma opção para cada empresa do nosso "banco de dados". */}
                {Object.keys(empresas).map((nome, i) => (
                  <option key={i} value={nome}>{nome}</option>
                ))}
              </select>

              {/* Esta seção só aparece DEPOIS que uma empresa é selecionada. */}
              {empresaSelecionada && (
                <div className="info-empresa">
                  {/* Mostra os dados que foram preenchidos automaticamente. */}
                  <p><strong>RA:</strong> {dadosEmpresa.ra}</p>
                  <p><strong>Polo:</strong> {dadosEmpresa.polo}</p>
                  <p><strong>Período:</strong> {dadosEmpresa.periodo}</p>
                  <p><strong>Ano Letivo:</strong> {dadosEmpresa.anoLetivo}</p>
                  <p><strong>Setor:</strong> {dadosEmpresa.setor}</p>
                  <p><strong>Info:</strong> {dadosEmpresa.info}</p>
                  <p><strong>Plano:</strong> {dadosEmpresa.plano}</p>

                  {/* Campo para o usuário digitar o período do estágio. */}
                  <label><strong>Período do Estágio:</strong></label>
                  <input
                    type="text"
                    placeholder="Ex: 05/08/2024 a 06/09/2024"
                    value={dadosEmpresa.periodoEstagio || ""}
                    onChange={(e) =>
                      // A cada letra digitada, atualiza a "pasta" de dados da empresa.
                      setDadosEmpresa({ ...dadosEmpresa, periodoEstagio: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* Coluna da Direita: Seleção da UC, Abas e o conteúdo do formulário. */}
            <div className="col-direita">
              {/* Os botões para selecionar a Unidade Curricular (UC). */}
              <div className="uc-tabs">
                {ucs.map((uc) => (
                  <button
                    key={uc}
                    onClick={() => setUcSelecionada(uc)}
                    className={ucSelecionada === uc ? "ativo" : ""} // O botão selecionado fica com estilo diferente.
                  >
                    {uc}
                  </button>
                ))}
              </div>

              {/* Os botões para selecionar a Aba ("Relatório" ou "Checklist"). */}
              <div className="aba-tabs">
                {abas.map((aba) => (
                  <button
                    key={aba}
                    onClick={() => setAbaAtiva(aba)}
                    className={abaAtiva === aba ? "ativo" : ""} // O botão selecionado fica com estilo diferente.
                  >
                    {aba}
                  </button>
                ))}
              </div>

              {/* A área de conteúdo dinâmico, que muda conforme a aba selecionada. */}
              <div className="aba-conteudo">
                {/* Se a aba "Relatório" estiver ativa... */}
                {abaAtiva === "Relatório" ? (
                  // ...chama nosso "seletor inteligente" para mostrar o formulário de relatório correto.
                  renderRelatorioUC()
                ) : (
                  // ...senão, mostra o formulário de checklist.
                  <ChecklistUC
                    uc={ucSelecionada}
                    dados={dadosChecklist}
                    setDados={setDadosChecklist}
                  />
                )}
              </div>

              {/* O botão final para gerar o PDF. */}
              <button className="btn-enviar" onClick={handleGerarPDF}>
                Salvar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}