// ===================================================================================
// ARQUIVO: RelatorioUC10.js (VERSÃO CORRIGIDA)
// ===================================================================================

import React from "react";
import "../../components/Relatorios/relatorio.css";

const habilidades = [
  "Higienizar as mãos conforme a OMS",
  "Utilizar equipamentos de proteção",
  "Comunicar-se de maneira assertiva",
  "Selecionar materiais, equipamentos e instrumental",
  "Utilizar técnicas assépticas",
  "Orientar gestante e puérpera conforme protocolos",
  "Admitir o cliente cirúrgico",
  "Preparar o cliente no pré-operatório conforme protocolos",
  "Posicionar o cliente para cirurgias e exames",
  "Transportar o cliente entre períodos cirúrgicos com segurança",
  "Circular sala de parto/cirúrgica conforme protocolos",
  "Prestar cuidados no pós-operatório conforme condição clínica",
  "Monitorar parâmetros na recuperação anestésica",
  "Manusear equipamentos no berçário e centro obstétrico",
  "Recepcionar o recém-nascido com segurança",
  "Prestar cuidados ao RN no parto e berçário",
  "Prestar cuidados à mulher no pré-parto, parto e pós-parto",
  "Auxiliar no aleitamento materno",
  "Realizar cuidados de higiene e conforto",
  "Executar desinfecção e esterilização de artigos e superfícies",
  "Identificar e adotar medidas de prevenção de doenças",
  "Adotar boas práticas na promoção e recuperação da saúde",
  "Identificar prioridades no atendimento",
  "Identificar reações e sintomas do cliente",
  "Monitorar débitos de sondas e drenos",
  "Reconhecer e atender intercorrências cirúrgico-anestésicas",
  "Identificar sinais do binômio mãe-bebê",
  "Realizar reanimação neonatal",
  "Interpretar documentos técnicos",
  "Utilizar termos técnicos",
  "Operar recursos tecnológicos aplicados à saúde",
  "Organizar processos de trabalho",
  "Realizar registros de enfermagem",
  "Identificar os aspectos do próprio trabalho",
  "Mediar conflitos"
];

const atitudes = [
  "Zelo na apresentação pessoal e postura profissional",
  "Comprometimento com o atendimento humanizado",
  "Responsabilidade no uso dos recursos organizacionais",
  "Colaboração, flexibilidade e iniciativa no trabalho em equipe",
  "Proatividade na resolução de problemas",
  "Respeito à diversidade e aos valores culturais e religiosos",
  "Respeito ao limite da atuação profissional",
  "Responsabilidade no descarte de resíduos",
  "Sigilo no tratamento de dados e informações",
  "Responsabilidade no cumprimento das normas de segurança",
  "Respeito às normas técnicas e legislações vigentes"
];

const opcoes = ["Sim", "Não", "Parcialmente", "N/A"];

// Componente atualizado para receber as props do pai
export default function RelatorioUC10({ uc, dados, setDados, erros, handleChange, handleCPFChange }) {

  // A função handleOpcao para os botões de rádio permanece, pois está correta.
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

      <label>Nome completo do(a) aluno(a):</label>
      <input
        type="text"
        name="nome"
        value={dados.nome || ""}
        onChange={handleChange}
        placeholder="Digite seu nome completo"
        className={erros?.nome ? 'campo-erro' : ''}
      />
      {erros?.nome && <p className="texto-erro">{erros.nome}</p>}

      <label>CPF do(a) aluno(a):</label>
      <input
        type="text"
        name="cpf"
        value={dados.cpf || ""}
        onChange={handleCPFChange}
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

      {/* Seções de Habilidades e Atitudes permanecem inalteradas */}
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

export const habilidadesUC10 = habilidades;
export const atitudesUC10 = atitudes;