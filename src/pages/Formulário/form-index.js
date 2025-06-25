import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Theme from "../../components/Tema/tema";
import empresasData from "../../components/Const/empresas";
import RelatorioUC4 from "../../components/Relatorios/relatoriouc4";
import RelatorioUC7 from "../../components/Relatorios/relatoriouc7";
import RelatorioUC10 from "../../components/Relatorios/relatoriouc10";
import RelatorioUC17 from "../../components/Relatorios/relatoriouc17";
import ChecklistUC from "../../components/Checklist/checklistuc";
import gerarPDF from "../../assets/utils/pdfgenerator"; // Certifique-se de que este caminho está correto
import "../Formulário/form-index.css";

// Importa as listas de habilidades de cada UC
// **MANTENHA ESTAS IMPORTAÇÕES**
import { habilidadesUC4, atitudesUC4 } from "../../components/Relatorios/relatoriouc4";
import { habilidadesUC7, atitudesUC7 } from "../../components/Relatorios/relatoriouc7";
import { habilidadesUC10, atitudesUC10 } from "../../components/Relatorios/relatoriouc10";
import { habilidadesUC17, atitudesUC17 } from "../../components/Relatorios/relatoriouc17";

// Importa a estrutura mestra do Checklist para a validação
import { estruturaChecklist } from "../../components/Checklist/checklistuc";


// --- Funções Auxiliares para CPF (dentro do escopo do formulário) ---
function mascararCPF(valor) {
  return valor.replace(/\D/g, '').substring(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function validarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
  return true;
}
// ------------------------------------

const ucs = ["UC4", "UC7", "UC10", "UC17"];
const abas = ["Relatório", "Checklist"];

export default function FormularioEstagio() {
  const [ucSelecionada, setUcSelecionada] = useState("UC4");
  const [abaAtiva, setAbaAtiva] = useState("Relatório");
  const [empresasSelecionadas, setEmpresasSelecionadas] = useState([]);
  const [dadosRelatorio, setDadosRelatorio] = useState({
    nome: '', cpf: '', turma: '', instrutores: '', conclusao: '', habilidades: {}
  });
  const [dadosChecklist, setDadosChecklist] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const toggleEmpresa = (nome) => {
    const existe = empresasSelecionadas.find((e) => e.nome === nome);
    let atualizadas;
    if (existe) {
      atualizadas = empresasSelecionadas.filter((e) => e.nome !== nome);
    } else {
      atualizadas = [
        ...empresasSelecionadas,
        { nome, ...empresasData[nome], dataInicio: "", dataFim: "" },
      ];
    }
    setEmpresasSelecionadas(atualizadas);
  };

  const handleEmpresaDateChange = (nomeEmpresa, tipoData, valor) => {
    setEmpresasSelecionadas((prevEmpresas) =>
      prevEmpresas.map((empresa) => {
        if (empresa.nome === nomeEmpresa) {
          const updatedEmpresa = { ...empresa, [tipoData]: valor };
          if (tipoData === 'dataInicio' && updatedEmpresa.dataFim && new Date(valor) > new Date(updatedEmpresa.dataFim)) {
            updatedEmpresa.dataFim = valor;
          }
          return updatedEmpresa;
        }
        return empresa;
      })
    );
  };

  const handleChangeRelatorio = (e) => {
    const { name, value } = e.target;
    setDadosRelatorio(prevState => ({ ...prevState, [name]: value }));
    if (errors[name]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleCPFChange = (e) => {
    const valorFormatado = mascararCPF(e.target.value);
    setDadosRelatorio(prevState => ({ ...prevState, cpf: valorFormatado }));
    if (errors.cpf) {
        setErrors(prevErrors => ({ ...prevErrors, cpf: null }));
    }
  };

  const validarFormularioRelatorio = () => {
    const novosErros = {};
    if (!dadosRelatorio.nome) novosErros.nome = "O nome do aluno é obrigatório.";
    if (!dadosRelatorio.turma) novosErros.turma = "A turma é obrigatória.";
    if (!dadosRelatorio.instrutores) novosErros.instrutores = "O nome do(s) instrutor(es) é obrigatório.";
    if (!dadosRelatorio.cpf) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (!validarCPF(dadosRelatorio.cpf)) {
      novosErros.cpf = "O CPF digitado é inválido.";
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleGerarPDF = async () => {
    setSuccessMessage('');
    setErrors({});

    if (abaAtiva === 'Relatório' && !validarFormularioRelatorio()) {
        return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        // **INÍCIO DA ALTERAÇÃO IMPORTANTE AQUI**
        // Coletar habilidades e atitudes separadamente
        let habilidadesRelatorio = [];
        let atitudesRelatorio = [];

        if (abaAtiva === "Relatório") {
          switch (ucSelecionada) {
            case "UC4": 
                habilidadesRelatorio = habilidadesUC4; 
                atitudesRelatorio = atitudesUC4; 
                break;
            case "UC7": 
                habilidadesRelatorio = habilidadesUC7; 
                atitudesRelatorio = atitudesUC7; 
                break;
            case "UC10": 
                habilidadesRelatorio = habilidadesUC10; 
                atitudesRelatorio = atitudesUC10; 
                break;
            case "UC17": 
                habilidadesRelatorio = habilidadesUC17; 
                atitudesRelatorio = atitudesUC17; 
                break;
            default: break;
          }
        }

        const dadosParaPDF = {
          uc: ucSelecionada,
          empresa: empresasSelecionadas,
          relatorio: dadosRelatorio,
          checklist: dadosChecklist,
          tipo: abaAtiva,
          // **PASSAR AS LISTAS SEPARADAMENTE PARA pdfgenerator.js**
          habilidadesRelatorio: habilidadesRelatorio,
          atitudesRelatorio: atitudesRelatorio,
          checklistEstrutura: estruturaChecklist,
        };
        // **FIM DA ALTERAÇÃO IMPORTANTE AQUI**

        await gerarPDF(dadosParaPDF);

        setSuccessMessage('PDF gerado e salvo com sucesso!');
        setTimeout(() => setSuccessMessage(''), 5000);

      } catch (error) {
        console.error("Falha na validação ou geração do PDF:", error);
        if (error.campos) {
          const novosErros = {};
          error.campos.forEach(campo => {
            novosErros[campo] = `O campo '${campo}' é obrigatório.`;
          });
          setErrors(novosErros);
        } else {
          setErrors({ geral: error.message || "Ocorreu um erro inesperado." });
        }
      } finally {
        setIsLoading(false);
      }
    }, 0);
  };

  const renderRelatorioUC = () => {
    const commonProps = {
      uc: ucSelecionada,
      dados: dadosRelatorio,
      setDados: setDadosRelatorio,
      erros: errors,
      handleChange: handleChangeRelatorio,
      handleCPFChange: handleCPFChange,
    };
    switch (ucSelecionada) {
      // **INÍCIO DA ALTERAÇÃO IMPORTANTE AQUI**
      // Passar as props 'habilidades' e 'atitudes' para cada componente de relatório
      case "UC4": return <RelatorioUC4 {...commonProps} habilidades={habilidadesUC4} atitudes={atitudesUC4} />;
      case "UC7": return <RelatorioUC7 {...commonProps} habilidades={habilidadesUC7} atitudes={atitudesUC7} />;
      case "UC10": return <RelatorioUC10 {...commonProps} habilidades={habilidadesUC10} atitudes={atitudesUC10} />;
      case "UC17": return <RelatorioUC17 {...commonProps} habilidades={habilidadesUC17} atitudes={atitudesUC17} />;
      // **FIM DA ALTERAÇÃO IMPORTANTE AQUI**
      default: return null;
    }
  };

  return (
    <main className="extra">
      <div className="home-content-box">
        <div className="header-background">
          <header className="custom-header">
            <div className="dot_home"><Link to="/" className="bar-link-home" /></div>
            <div className="dot" /><div className="dot" />
            <Link to="/formulario" className="bar-link">Relatório de Estágio </Link>
            <div className="dot" /><div className="dot" />
            <Link to="/calculo" className="bar-link">Calculadora</Link>
            <div className="dot" /><div className="dot" />
            <Link to="/glossario" className="bar-link">Glossário </Link>
            <div className="dot" /><div className="dot" />
            <Link to="/quiz" className="bar-link">Quiz</Link>
            <div className="dot" /><div className="dot" />
            <div className="dot-about"><Link to="/sobre" className="bar-link-about" /></div>
          </header>
        </div>

        <Theme />

        <div className="formulario-container">
          <h2 className="titulo">Formulário de Estágio Supervisionado</h2>
          <div className="form-grid">
            <div className="col-esquerda">
              <label><strong>Unidade(s) Concedente(s):</strong></label>
              <div className="lista-empresas">
                {Object.keys(empresasData).map((nome, i) => (
                  <label key={i} className="empresa-checkbox">
                    <input type="checkbox" checked={empresasSelecionadas.some((e) => e.nome === nome)} onChange={() => toggleEmpresa(nome)} />
                    {nome}
                  </label>
                ))}
              </div>
              {empresasSelecionadas.map((empresa) => (
                <div key={empresa.nome} className="info-empresa">
                  <h3>{empresa.nome}</h3>
                  <p><strong>RA:</strong> {empresa.ra}</p>
                  <p><strong>Polo:</strong> {empresa.polo}</p>
                  <p><strong>Período Padrão (se houver):</strong> {empresa.periodo}</p>
                  <p><strong>Ano Letivo:</strong> {empresa.anoLetivo}</p>
                  <p><strong>Setor:</strong> {empresa.setor}</p>
                  <p><strong>Info:</strong> {empresa.info}</p>
                  <p><strong>Plano:</strong> {empresa.plano}</p>
                  <p><strong>Descrição:</strong> {empresa.descricao}</p>
                  <div className="periodo-estagio-empresa">
                    <label><strong>Início do Estágio em {empresa.nome}:</strong></label>
                    <input type="date" value={empresa.dataInicio || ""} onChange={(e) => handleEmpresaDateChange(empresa.nome, "dataInicio", e.target.value)} />
                    <label><strong>Fim do Estágio em {empresa.nome}:</strong></label>
                    <input type="date" value={empresa.dataFim || ""} onChange={(e) => handleEmpresaDateChange(empresa.nome, "dataFim", e.target.value)} min={empresa.dataInicio || ""} />
                  </div>
                  <hr style={{ margin: '15px 0' }}/>
                </div>
              ))}
            </div>

            <div className="col-direita">
              <div className="uc-tabs">
                {ucs.map((uc) => (<button key={uc} onClick={() => setUcSelecionada(uc)} className={ucSelecionada === uc ? "ativo" : ""}>{uc}</button>))}
              </div>
              <div className="aba-tabs">
                {abas.map((aba) => (<button key={aba} onClick={() => setAbaAtiva(aba)} className={abaAtiva === aba ? "ativo" : ""}>{aba}</button>))}
              </div>
              <div className="aba-conteudo">
                {abaAtiva === "Relatório" ? renderRelatorioUC() : (<ChecklistUC uc={ucSelecionada} dados={dadosChecklist} setDados={setDadosChecklist} />)}
              </div>
              
              <div className="acoes">
                <button className="btn-enviar" onClick={handleGerarPDF} disabled={isLoading}>
                  {isLoading ? 'Gerando PDF...' : 'Salvar PDF'}
                </button>
                {isLoading && <div className="spinner"></div>}
              </div>

              {successMessage && <div className="mensagem-sucesso">{successMessage}</div>}
              {Object.keys(errors).length > 0 && (
                <div className="mensagem-erro">
                  <p><strong>Por favor, corrija os seguintes erros:</strong></p>
                  <ul>
                    {Object.values(errors).map((erro, i) => (erro && <li key={i}>{erro}</li>))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}