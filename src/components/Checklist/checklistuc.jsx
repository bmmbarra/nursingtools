// ===================================================================================
// ARQUIVO: ChecklistUC.js
//
// PROPÓSITO GERAL:
// Este arquivo é o "modelo" para o formulário de Checklist, que é usado para
// todas as Unidades Curriculares. (...)
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Estilos ---
import React from "react";
import "../../components/Checklist/checklistuc.css";

// --- PASSO 2: A Estrutura do Checklist (O "Questionário Padrão") ---
const itensChecklist = [
  {
    titulo: "Cronograma de estágio",
    perguntas: [
      "Foi possível o acesso ao cronograma para realização da UC?",
    ],
  },
  {
    titulo: "Termo de Compromisso de Estágio",
    perguntas: [
      "Datas e horário conferem com o cronograma?",
      "Os campos de preenchimento estão corretos?",
      "Possui Termo aditivo?",
      "Estão devidamente assinados/carimbados?",
    ],
  },
  {
    titulo: "Ficha de Frequência",
    perguntas: [
      "Os dados estão de acordo com o TCE e cronograma?",
      "Carga horária diária registrada corretamente?",
      "Campos de assinatura e CH diária devidamente assinados?",
      "A ficha apresenta rasuras?",
    ],
  },
  {
    titulo: "Ficha de Avaliação e Acompanhamento",
    perguntas: [
      "Formulários condizentes/atualizados com a UC?",
      "Todos os campos preenchidos e assinados?",
    ],
  },
  {
    titulo: "Relatório",
    perguntas: [
      "Campos de assinaturas devidamente assinados/carimbados?",
    ],
  },
];

const opcoes = ["Sim", "Não"];
const status = ["Regular", "Irregular", "Pendente"];

// --- PASSO 3: Construindo o Modelo do Formulário de Checklist ---
export default function ChecklistUC({ uc, dados, setDados }) {

  // --- PASSO 4: As Funções de "Preenchimento" ---
  const handleChange = (campo, valor) => {
    setDados({ ...dados, [campo]: valor });
  };

  const handleItemChange = (item, pergunta, tipo, valor) => {
    setDados({
      ...dados,
      itens: {
        ...(dados.itens || {}),
        [item]: {
          ...(dados.itens?.[item] || {}),
          [pergunta]: {
            ...(dados.itens?.[item]?.[pergunta] || {}),
            [tipo]: valor,
          },
        },
      },
    });
  };

  // --- PASSO 5: Desenhando o Formulário na Tela (A "Planta Baixa") ---
  return (
    <div className="checklist-uc">
      <h3>Checklist da {uc}</h3>

      {/* --- Seção de Identificação do Checklist --- */}
      <div className="identificacao">
        
        {/* NOVO: Campo para o Nome do Aluno */}
        <div className="ident-row">
          <div className="ident-field full-width"> {/* Adicionei a classe "full-width" para melhor layout */}
            <label>Nome do Aluno:</label>
            <input
              type="text"
              value={dados.aluno || ""}
              onChange={(e) => handleChange("aluno", e.target.value)}
              placeholder="Digite o nome completo do aluno"
            />
          </div>
        </div>

        <div className="ident-row">
          <div className="ident-field">
            <label>Turma:</label>
            <input
              type="text"
              value={dados.turma || ""}
              onChange={(e) => handleChange("turma", e.target.value)}
            />
          </div>
          <div className="ident-field">
            <label>Matriz Curricular:</label>
            <input
              type="text"
              value={dados.matrizCurricular || ""}
              onChange={(e) => handleChange("matrizCurricular", e.target.value)}
            />
          </div>
        </div>

        <div className="ident-row">
            <div className="ident-field">
                <label>Unidade Curricular:</label>
                <input type="text" value={uc} disabled />
            </div>
            <div className="ident-field">
                <label>Carga Horária:</label>
                <input
                    type="text"
                    value={dados.cargaHoraria || ""}
                    onChange={(e) => handleChange("cargaHoraria", e.target.value)}
                    placeholder="Ex: 80 horas"
                />
            </div>
        </div>
      </div>

      {/* --- Fábrica de Itens do Checklist --- */}
      {itensChecklist.map((item, idx) => (
        <div key={idx} className="checklist-item">
          <h4>{item.titulo}</h4>
          {item.perguntas.map((pergunta, idp) => (
            <div key={idp} className="pergunta-bloco">
              <p><strong>{pergunta}</strong></p>
              <div className="radio-group">
                <span>Acessado:</span>
                {opcoes.map((op) => (
                  <label key={op}>
                    <input
                      type="radio"
                      name={`${idx}-${idp}-acesso`}
                      checked={(dados.itens?.[item.titulo]?.[pergunta]?.acesso || "") === op}
                      onChange={() => handleItemChange(item.titulo, pergunta, "acesso", op)}
                    />
                    {op}
                  </label>
                ))}
              </div>
              <div className="radio-group">
                <span>Status:</span>
                {status.map((s) => (
                  <label key={s}>
                    <input
                      type="radio"
                      name={`${idx}-${idp}-status`}
                      checked={(dados.itens?.[item.titulo]?.[pergunta]?.status || "") === s}
                      onChange={() => handleItemChange(item.titulo, pergunta, "status", s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* --- Seção Final do Checklist --- */}
      <div className="checklist-extra">
        <label>Resultado final:</label>
        <select
          value={dados.resultado || ""}
          onChange={(e) => handleChange("resultado", e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="Desenvolvida">Desenvolvida</option>
          <option value="Não Desenvolvida">Não Desenvolvida</option>
        </select>
      </div>
    </div>
  );
}

export const estruturaChecklist = itensChecklist;
export const opcoesChecklist = opcoes;
export const statusChecklist = status;
