// ===================================================================================
// ARQUIVO: FormularioEstagio.js
// ===================================================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import Theme from "../../components/Tema/tema";
import empresasData from "../../components/Const/empresas";
import RelatorioUC4 from "../../components/Relatorios/relatoriouc4";
import RelatorioUC7 from "../../components/Relatorios/relatoriouc7";
import RelatorioUC10 from "../../components/Relatorios/relatoriouc10";
import RelatorioUC17 from "../../components/Relatorios/relatoriouc17";
import ChecklistUC from "../../components/Checklist/checklistuc";
import gerarPDF from "../../assets/utils/pdfgenerator";
import "../Formulário/form-index.css";

import { habilidadesUC4, atitudesUC4 } from "../../components/Relatorios/relatoriouc4";
import { habilidadesUC7, atitudesUC7 } from "../../components/Relatorios/relatoriouc7";
import { habilidadesUC10, atitudesUC10 } from "../../components/Relatorios/relatoriouc10";
import { habilidadesUC17, atitudesUC17 } from "../../components/Relatorios/relatoriouc17";

import { validarChecklist } from "../../assets/utils/validarChecklist";
import { validarRelatorio } from "../../assets/utils/validarRelatorio";

const ucs = ["UC4", "UC7", "UC10", "UC17"];
const abas = ["Relatório", "Checklist"];

export default function FormularioEstagio() {
  const [ucSelecionada, setUcSelecionada] = useState("UC4");
  const [abaAtiva, setAbaAtiva] = useState("Relatório");
  const [empresasSelecionadas, setEmpresasSelecionadas] = useState([]); 
  const [dadosRelatorio, setDadosRelatorio] = useState({});
  const [dadosChecklist, setDadosChecklist] = useState({});

  const toggleEmpresa = (nome) => {
    const existe = empresasSelecionadas.find((e) => e.nome === nome);
    let atualizadas;
    if (existe) {
      atualizadas = empresasSelecionadas.filter((e) => e.nome !== nome);
    } else {
      atualizadas = [
        ...empresasSelecionadas,
        {
          nome,
          ...empresasData[nome],
          dataInicio: "",
          dataFim: "",
        },
      ];
    }
    setEmpresasSelecionadas(atualizadas);

    const nomesUnidades = atualizadas.map((e) => e.nome).join(", ");
    setDadosRelatorio((prev) => ({ ...prev, unidadeConcedente: nomesUnidades }));
  };

  const handleEmpresaDateChange = (nomeEmpresa, tipoData, valor) => {
    setEmpresasSelecionadas((prevEmpresas) =>
      prevEmpresas.map((empresa) => {
        if (empresa.nome === nomeEmpresa) {
          const updatedEmpresa = { ...empresa, [tipoData]: valor };
          // Se a data de início for alterada e for maior que a data final atual,
          // ajusta a data final para ser igual à data de início para evitar inconsistência visual.
          if (tipoData === 'dataInicio' && updatedEmpresa.dataFim && new Date(valor) > new Date(updatedEmpresa.dataFim)) {
              updatedEmpresa.dataFim = valor; // Ajusta a data final para a nova data de início
          }
          return updatedEmpresa;
        }
        return empresa;
      })
    );
  };

  const handleGerarPDF = () => {
    let habilidades = [];
    let atitudes = [];

    // A validação de ordem de datas (fim < inicio) se torna redundante no momento da seleção com o 'min'
    // mas ainda é bom ter como uma checagem final, caso o usuário manipule o HTML ou utilize um navegador antigo.
    const errosDeDataOrdem = [];
    empresasSelecionadas.forEach(emp => {
      if (emp.dataInicio && emp.dataFim) {
        const inicio = new Date(emp.dataInicio);
        const fim = new Date(emp.dataFim);
        // Remove 'T00:00:00' para comparação de data apenas, ignorando fusos horários que podem causar 1 dia de diferença.
        // Ou, para ser mais preciso, compare as strings 'YYYY-MM-DD' diretamente se o formato for garantido.
        if (fim.getTime() < inicio.getTime()) { 
          errosDeDataOrdem.push(`A data final do estágio para "${emp.nome}" (${emp.dataFim}) não pode ser anterior à data de início (${emp.dataInicio}).`);
        }
      }
    });

    if (errosDeDataOrdem.length > 0) {
      alert("⚠️ Erro nas datas de estágio:\n\n" + errosDeDataOrdem.join("\n\n"));
      return;
    }


    if (abaAtiva === "Checklist") {
      const erros = validarChecklist(dadosChecklist);
      if (erros.length > 0) {
        alert("⚠️ Corrija os seguintes erros antes de gerar o PDF:\n\n" + erros.join("\n\n"));
        return;
      }
    }

    if (abaAtiva === "Relatório") {
      switch (ucSelecionada) {
        case "UC4":
          habilidades = habilidadesUC4;
          atitudes = atitudesUC4;
          break;
        case "UC7":
          habilidades = habilidadesUC7;
          atitudes = atitudesUC7;
          break;
        case "UC10":
          habilidades = habilidadesUC10;
          atitudes = atitudesUC10;
          break;
        case "UC17":
          habilidades = habilidadesUC17;
          atitudes = atitudesUC17;
          break;
        default:
          break;
      }

      const errosDeDataVazio = empresasSelecionadas.some(emp => !emp.dataInicio || !emp.dataFim);
      if (errosDeDataVazio) {
          alert("⚠️ Por favor, preencha as datas de início e fim para TODAS as empresas selecionadas.");
          return;
      }

      const erros = validarRelatorio(dadosRelatorio, habilidades, atitudes);
      if (erros.length > 0) {
        alert("⚠️ Corrija os seguintes erros antes de gerar o PDF:\n\n" + erros.join("\n\n"));
        return;
      }
    }

    gerarPDF({
      uc: ucSelecionada,
      empresa: empresasSelecionadas,
      relatorio: dadosRelatorio,
      checklist: dadosChecklist,
      tipo: abaAtiva,
    });
  };

  const renderRelatorioUC = () => {
    const props = {
      uc: ucSelecionada,
      dados: dadosRelatorio,
      setDados: setDadosRelatorio,
    };
    switch (ucSelecionada) {
      case "UC4": return <RelatorioUC4 {...props} />;
      case "UC7": return <RelatorioUC7 {...props} />;
      case "UC10": return <RelatorioUC10 {...props} />;
      case "UC17": return <RelatorioUC17 {...props} />;
      default: return null;
    }
  };

  return (
    <main className="extra">
      <div className="home-content-box">
        <div className="header-background">
          <header className="custom-header">
            <div className="dot_home">
              <Link to="/" className="bar-link-home" />
            </div>
            <div className="dot" /><div className="dot" />
            <Link to="/formulario" className="bar-link">Relatório de Estágio </Link>
            <div className="dot" /><div className="dot" />
            <Link to="/calculo" className="bar-link">Calculadora</Link>
            <div className="dot" /><div className="dot" />
            <Link to="/glossario" className="bar-link">Glossário </Link>
            <div className="dot" /><div className="dot" />
            <Link to="/quiz" className="bar-link">Quiz</Link>
            <div className="dot" /><div className="dot" />
            <div className="dot-about">
              <Link to="/sobre" className="bar-link-about" />
            </div>
          </header>
        </div>

        <Theme />

        <div className="formulario-container">
          <h2 className="titulo">Formulário de Estágio Supervisionado</h2>
          <div className="form-grid">
            <div className="col-esquerda">
              <label><strong>Empresa afiliada:</strong></label>
              <div className="lista-empresas">

                {Object.keys(empresasData).map((nome, i) => (
                  <label key={i} className="empresa-checkbox">
                    
                    <input
                      type="checkbox"
                      checked={empresasSelecionadas.some((e) => e.nome === nome)}
                      onChange={() => toggleEmpresa(nome)}
                    />
                    {nome}
                  </label>
                ))}
              
              </div>
            

              {empresasSelecionadas.map((empresa, index) => (
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
                    <label>
                      <strong>Início do Estágio em {empresa.nome}:</strong>
                    </label>
                    <input
                      type="date"
                      value={empresa.dataInicio || ""}
                      onChange={(e) =>
                        handleEmpresaDateChange(
                          empresa.nome,
                          "dataInicio",
                          e.target.value
                        )
                      }
                    />
                    <label>
                      <strong>Fim do Estágio em {empresa.nome}:</strong>
                    </label>
                    <input
                      type="date"
                      value={empresa.dataFim || ""}
                      onChange={(e) =>
                        handleEmpresaDateChange(
                          empresa.nome,
                          "dataFim",
                          e.target.value
                        )
                      }
                      min={empresa.dataInicio || ""} // NOVO: Restringe a data final
                    />
                  </div>
                  <hr style={{ margin: '15px 0' }}/>
                </div>
              ))}
            </div>

            <div className="col-direita">
              <div className="uc-tabs">
                {ucs.map((uc) => (
                  <button
                    key={uc}
                    onClick={() => setUcSelecionada(uc)}
                    className={ucSelecionada === uc ? "ativo" : ""}
                  >
                    {uc}
                  </button>
                ))}
              </div>

              <div className="aba-tabs">
                {abas.map((aba) => (
                  <button
                    key={aba}
                    onClick={() => setAbaAtiva(aba)}
                    className={abaAtiva === aba ? "ativo" : ""}
                  >
                    {aba}
                  </button>
                ))}
              </div>

              <div className="aba-conteudo">
                {abaAtiva === "Relatório" ? (
                  renderRelatorioUC()
                ) : (
                  <ChecklistUC
                    uc={ucSelecionada}
                    dados={dadosChecklist}
                    setDados={setDadosChecklist}
                  />
                )}
              </div>

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