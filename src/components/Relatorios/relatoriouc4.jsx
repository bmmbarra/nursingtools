// ===================================================================================
// ARQUIVO: RelatorioUC4.js (VERSÃO CORRIGIDA COM LÓGICA DE CPF)
// ===================================================================================

import React from "react";
import "../../components/Relatorios/relatorio.css";

// As listas de habilidades e atitudes permanecem as mesmas
const habilidades = [
  "Higienizar as mãos conforme a OMS", "Utilizar equipamentos de proteção", "Comunicar-se de maneira assertiva", /* ...e todas as outras... */
];
const atitudes = [
  "Comprometimento com o atendimento humanizado", "Responsabilidade no uso dos recursos organizacionais", /* ...e todas as outras... */
];
const opcoes = ["Sim", "Não", "Parcialmente", "N/A"];

// ========================================================================
// 1. ATUALIZAMOS AS PROPS QUE O COMPONENTE RECEBE
// Agora ele recebe 'erros', 'handleChange' e 'handleCPFChange' do pai.
// ========================================================================
export default function RelatorioUC4({ uc, dados, setDados, erros, handleChange, handleCPFChange }) {

  // A função local 'handleChange' foi removida, pois agora usamos a que vem das props.

  // A função handleOpcao para os botões de rádio está correta e permanece.
  const handleOpcao = (habilidade, opcao) => {
    setDados({
      ...dados,
      habilidades: {
        ...(dados.habilidades || {}),
        [habilidade]: opcao,
      },
    });
  };

  return (
    <div className="relatorio-uc">
      <h3>Relatório da {uc}</h3>
      <h4>Identificação</h4>

      {/* ======================================================================== */}
      {/* 2. ATUALIZAMOS TODOS OS INPUTS PARA USAR AS NOVAS PROPS */}
      {/* ======================================================================== */}

      <label>Nome completo do(a) aluno(a):</label>
      <input
        type="text"
        name="nome" // O 'name' é importante para o handler genérico
        value={dados.nome || ""}
        onChange={handleChange} // Usa o handler genérico vindo do pai
        placeholder="Digite seu nome completo"
        className={erros?.nome ? 'campo-erro' : ''}
      />
      {erros?.nome && <p className="texto-erro">{erros.nome}</p>}


      <label>CPF do(a) aluno(a):</label>
      <input
        type="text" // Mudado para 'text' para aceitar a máscara
        name="cpf"
        value={dados.cpf || ""}
        onChange={handleCPFChange} // Usa o handler ESPECÍFICO de CPF vindo do pai
        placeholder="000.000.000-00"
        maxLength="14"
        className={erros?.cpf ? 'campo-erro' : ''}
      />
      {erros?.cpf && <p className="texto-erro">{erros.cpf}</p>}


      <label>Turma:</label>
      <input
        type="text"
        name="turma"
        value={dados.turma || ""}
        onChange={handleChange}
        placeholder="Digite sua turma"
        className={erros?.turma ? 'campo-erro' : ''}
      />
      {erros?.turma && <p className="texto-erro">{erros.turma}</p>}


      <label>Nome do(s) instrutor(es):</label>
      <input
        type="text"
        name="instrutores"
        value={dados.instrutores || ""}
        onChange={handleChange}
        placeholder="Digite o(s) nome(s) dos instrutores"
        className={erros?.instrutores ? 'campo-erro' : ''}
      />
      {erros?.instrutores && <p className="texto-erro">{erros.instrutores}</p>}


      <label>Conclusão:</label>
      <textarea
        rows={4}
        name="conclusao"
        value={dados.conclusao || ""}
        onChange={handleChange}
        placeholder="Relate o aprendizado e avaliação do estágio..."
        className={erros?.conclusao ? 'campo-erro' : ''}
      />
      {erros?.conclusao && <p className="texto-erro">{erros.conclusao}</p>}

      {/* O resto do seu JSX para Habilidades e Atitudes permanece o mesmo */}
      <h4>Habilidades Desenvolvidas</h4>
      <div className="tabela-habilidades">
        {habilidades.map((hab, idx) => (
          <div key={idx} className="linha-hab">
            <span className="hab-nome">{hab}</span>
            {opcoes.map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={`hab-${idx}`}
                  value={opcao}
                  checked={(dados.habilidades?.[hab] || "") === opcao}
                  onChange={() => handleOpcao(hab, opcao)}
                />
                {opcao}
              </label>
            ))}
          </div>
        ))}
      </div>

      <h4>Atitudes e Valores</h4>
      <div className="tabela-habilidades">
        {atitudes.map((att, idx) => (
          <div key={`att-${idx}`} className="linha-hab">
            <span className="hab-nome">{att}</span>
            {opcoes.map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={`att-${idx}`}
                  value={opcao}
                  checked={(dados.habilidades?.[att] || "") === opcao}
                  onChange={() => handleOpcao(att, opcao)}
                />
                {opcao}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// As exportações no final permanecem as mesmas
export const habilidadesUC4 = habilidades;
export const atitudesUC4 = atitudes;