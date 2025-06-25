// ===================================================================================
// ARQUIVO: RelatorioUC17.js (VERSÃO CORRIGIDA - HABILIDADES/ATITUDES VIA PROPS E LAYOUT RESTAURADO)
// ===================================================================================

import React from "react";
import "../../components/Relatorios/relatorio.css";

// 1. Defina e exporte as habilidades e atitudes ESPECÍFICAS desta UC.
//    Estas listas SÃO APENAS DEFINIDAS AQUI e exportadas para serem importadas
//    e passadas como props pelo componente pai (FormularioEstagio.jsx).
export const habilidadesUC17 = [
    "Zelar pela apresentação pessoal e postura profissional",
    "Higienizar as mãos conforme a OMS",
    "Utilizar equipamentos de proteção",
    "Comunicar-se de maneira assertiva",
    "Selecionar materiais, equipamentos e instrumental",
    "Utilizar técnicas assépticas",
    "Auxiliar no processo de acolhimento e classificação de risco",
    "Identificar reações, sinais e sintomas do cliente",
    "Monitorar parâmetros vitais em situações de urgência e emergência",
    "Auxiliar em procedimentos invasivos",
    "Organizar carro de emergência",
    "Identificar parada cardiorrespiratória",
    "Atender PCR conforme suporte básico e avançado",
    "Auxiliar no transporte do cliente crítico",
    "Acomodar cliente crítico em ambiente de alta complexidade",
    "Mensurar balanço hídrico",
    "Identificar sinais de agravo clínico",
    "Aspirar vias aéreas superiores ou cânula orotraqueal",
    "Adotar medidas de precaução e isolamento",
    "Identificar medidas de prevenção de doenças",
    "Adotar boas práticas na promoção e recuperação da saúde",
    "Preparar o ambiente para cuidados paliativos",
    "Atender necessidades do cliente conforme Política Nacional de Cuidados Paliativos",
    "Realizar medidas de conforto e bem-estar",
    "Monitorar estado clínico com base no cuidado humanizado",
    "Prestar cuidados ao cliente no pós-morte",
    "Organizar o ambiente e processos de trabalho",
    "Operar recursos tecnológicos aplicados à saúde",
    "Interpretar documentos técnicos",
    "Utilizar termos técnicos na rotina de trabalho",
    "Identificar interferências do próprio trabalho no serviço",
    "Mediar conflitos nas situações de trabalho"
];

export const atitudesUC17 = [
    "Comprometimento com o atendimento humanizado",
    "Comprometimento com o cuidado prestado",
    "Escuta ativa",
    "Responsabilidade no uso dos recursos organizacionais",
    "Colaboração, flexibilidade e iniciativa no trabalho em equipe",
    "Proatividade na resolução de problemas",
    "Respeito à diversidade e valores culturais e religiosos",
    "Respeito ao limite da atuação profissional",
    "Responsabilidade no descarte de resíduos",
    "Sigilo no tratamento de dados e informações",
    "Registro das ações conforme rotina da instituição",
    "Responsabilidade no cumprimento das normas de segurança",
    "Respeito às normas técnicas e legislações vigentes"
];

const opcoesDeAvaliacao = ["Sim", "Não", "Parcialmente", "N/A"]; // Mantido 'N/A' conforme seu código original

// 2. O COMPONENTE AGORA RECEBE 'habilidades' e 'atitudes' COMO PROPS.
export default function RelatorioUC17({ uc, dados, setDados, erros, handleChange, handleCPFChange, habilidades, atitudes }) {

  // A função handleOpcao para os botões de rádio permanece.
  const handleOpcao = (item, opcao) => { // 'item' agora pode ser tanto habilidade quanto atitude
    setDados({
      ...dados,
      habilidades: { // A propriedade 'habilidades' em 'dados' armazena tanto habilidades quanto atitudes
        ...(dados.habilidades || {}),
        [item]: opcao,
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

      {/* SEÇÕES DE HABILIDADES E ATITUDES:
           3. AGORA, MAPAMOS SOBRE AS PROPS 'habilidades' e 'atitudes'
           4. REVERTIDO: O 'name' dos radio buttons volta a ser o nome da habilidade/atitude,
              para manter o layout que você já tinha funcionando.
      */}
      <h4>Habilidades Desenvolvidas</h4>
      <div className="tabela-habilidades">
        {habilidades.map((hab) => ( // Usa a prop 'habilidades'
          <div key={hab} className="linha-hab"> {/* Usar 'hab' como key é mais estável */}
            <span className="hab-nome">{hab}</span>
            {opcoesDeAvaliacao.map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={hab} // REVERTIDO: Usa o nome da habilidade diretamente como 'name' do grupo de rádio
                  value={opcao}
                  checked={(dados.habilidades?.[hab] || "") === opcao}
                  onChange={() => handleOpcao(hab, opcao)}
                />
                {opcao}
              </label>
            ))}
            {erros?.[hab] && <p className="texto-erro">{erros[hab]}</p>}
          </div>
        ))}
      </div>

      <h4>Atitudes e Valores</h4>
      <div className="tabela-habilidades">
        {atitudes.map((att) => ( // Usa a prop 'atitudes'
          <div key={att} className="linha-hab"> {/* Usar 'att' como key é mais estável */}
            <span className="hab-nome">{att}</span>
            {opcoesDeAvaliacao.map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={att} // REVERTIDO: Usa o nome da atitude diretamente como 'name' do grupo de rádio
                  value={opcao}
                  checked={(dados.habilidades?.[att] || "") === opcao}
                  onChange={() => handleOpcao(att, opcao)}
                />
                {opcao}
              </label>
            ))}
            {erros?.[att] && <p className="texto-erro">{erros[att]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}