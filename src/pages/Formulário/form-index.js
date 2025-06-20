
// ===================================================================================
// ARQUIVO: FormularioEstagio.js
// ===================================================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import Theme from "../../components/Tema/tema";
import empresas from "../../components/Const/empresas";
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
      atualizadas = [...empresasSelecionadas, { nome, ...empresas[nome], periodoEstagio: "" }];
    }
    setEmpresasSelecionadas(atualizadas);

    const nomesUnidades = atualizadas.map((e) => e.nome).join(", ");
    setDadosRelatorio((prev) => ({ ...prev, unidadeConcedente: nomesUnidades }));
  };

  const handleGerarPDF = () => {
    let habilidades = [];
    let atitudes = [];

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

                {Object.keys(empresas).map((nome, i) => (
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
                <div key={index} className="info-empresa">
                  <p><strong>{empresa.nome}</strong></p>
                  <p><strong>RA:</strong> {empresa.ra}</p>
                  <p><strong>Polo:</strong> {empresa.polo}</p>
                  <p><strong>Período:</strong> {empresa.periodo}</p>
                  <p><strong>Ano Letivo:</strong> {empresa.anoLetivo}</p>
                  <p><strong>Setor:</strong> {empresa.setor}</p>
                  <p><strong>Info:</strong> {empresa.info}</p>
                  <p><strong>Plano:</strong> {empresa.plano}</p>
                  <label><strong>Período do Estágio:</strong></label>
                  <input
                    type="text"
                    placeholder="Ex: 05/08/2024 a 06/09/2024"
                    value={empresa.periodoEstagio || ""}
                    onChange={(e) => {
                      const novasEmpresas = [...empresasSelecionadas];
                      novasEmpresas[index].periodoEstagio = e.target.value;
                      setEmpresasSelecionadas(novasEmpresas);
                    }}
                  />
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
