// ===================================================================================
// ARQUIVO: RelatorioUC4.js (VERSÃO FINAL E CORRIGIDA PARA LAYOUT E PROPS)
// ===================================================================================

import React from "react";
import "../../components/Relatorios/relatorio.css";

// As listas de habilidades e atitudes ESPECÍFICAS desta UC.
// Elas são exportadas para serem importadas e passadas como props pelo componente pai (FormularioEstagio.jsx).
export const habilidadesUC4 = [
  "Higienizar as mãos conforme a OMS",
  "Utilizar equipamentos de proteção",
  "Comunicar-se de maneira assertiva",
  "Realizar anamnese e exame físico",
  "Administrar medicamentos por diversas vias",
  "Realizar curativos de diferentes complexidades",
  "Monitorar sinais vitais e registrar dados",
  "Prestar primeiros socorros em situações de urgência",
  "Auxiliar em procedimentos de pequeno, médio e grande porte",
  "Preparar e organizar o ambiente para procedimentos",
  "Esterilizar materiais e equipamentos",
  "Coletar amostras para exames laboratoriais",
  "Orientar pacientes e familiares sobre cuidados de saúde",
  "Participar da passagem de plantão e evolução do paciente",
  "Registrar informações de forma clara e precisa no prontuário",
  "Gerenciar resíduos de serviços de saúde",
  "Auxiliar na mobilização e transporte de pacientes",
  "Realizar cateterismo vesical (sonda de alívio e demora)",
  "Realizar aspiração de vias aéreas superiores",
  "Realizar eletrocardiograma (ECG) e interpretação básica",
  "Participar da assistência em parada cardiorrespiratória (PCR)",
  "Realizar banho no leito e higiene corporal do paciente",
  "Auxiliar na alimentação e hidratação do paciente",
  "Realizar controle hídrico",
  "Participar da punção venosa periférica",
  "Auxiliar na punção arterial",
  "Realizar balanço hídrico",
  "Prestar assistência em ventilação mecânica não invasiva",
  "Participar da assistência em ventilação mecânica invasiva",
  "Realizar coleta de gasometria arterial",
  "Prestar assistência em emergências cardiovasculares",
  "Participar da assistência em emergências respiratórias",
  "Realizar cálculo de medicação com precisão",
  "Utilizar sistemas informatizados de registro (se aplicável)",
  "Identificar e prevenir infecções relacionadas à assistência à saúde (IRAS)",
  "Participar de discussões de caso e planejamento do cuidado",
  "Realizar cuidados paliativos e de fim de vida",
  "Prestar assistência a pacientes com feridas crônicas",
  "Participar do processo de desospitalização",
  "Realizar testagem rápida (ex: glicemia capilar)",
  "Auxiliar na coleta de Papanicolau",
  "Realizar oximetria de pulso",
  "Prestar assistência a pacientes em isolamento",
  "Participar da administração de hemoderivados",
  "Realizar monitorização hemodinâmica básica",
  "Prestar assistência a pacientes com dispositivos invasivos (drenos, ostomias)",
  "Auxiliar na passagem de sondas nasogástricas/enterais",
  "Participar da reanimação neonatal (se aplicável)",
  "Realizar assistência perioperatória (pré, intra e pós-operatório)",
  "Participar de educação em saúde para pacientes e comunidade",
  "Aplicar técnicas de imobilização e transporte de trauma",
  "Realizar controle de dor",
  "Participar da administração de nutrição parenteral",
  "Prestar assistência a pacientes com doenças crônicas",
  "Realizar lavagem intestinal",
  "Auxiliar na instalação e manejo de cateter central",
  "Realizar desinfecção e limpeza de artigos",
  "Participar de auditorias internas de enfermagem",
  "Realizar leitura e interpretação de exames (básico)",
  "Prestar assistência a pacientes em cuidados intensivos",
  "Participar de campanhas de vacinação",
  "Realizar registro de enfermagem com base no processo de enfermagem",
  "Atender às chamadas de emergência",
  "Realizar transporte seguro de pacientes",
];

export const atitudesUC4 = [
  "Comprometimento com o atendimento humanizado",
  "Responsabilidade no uso dos recursos organizacionais",
  "Colaboração, flexibilidade e iniciativa no desenvolvimento do trabalho em equipe",
  "Proatividade na resolução de problemas",
  "Respeito à diversidade e aos valores morais, culturais e religiosos do cliente e da família",
  "Respeito ao limite da atuação profissional",
  "Responsabilidade no descarte de resíduos",
  "Sigilo no tratamento de dados e informações",
  "Zelo na apresentação pessoal e postura profissional",
  "Responsabilidade no cumprimento das normas de segurança",
  "Respeito às normas técnicas e legislações vigentes",
  "Escuta Ativa",
  "Registro das Ações de Enfermagem conforme a rotina e protocolo da Instituição",
];

// Opções de avaliação para os botões de rádio/selects
const opcoesDeAvaliacao = ["Sim", "Não", "Parcialmente", "N/A"];

// Componente RelatorioUC4 agora **RECEBE** habilidades e atitudes como props
export default function RelatorioUC4({ uc, dados, setDados, erros, handleChange, handleCPFChange, habilidades, atitudes }) {
    // ATENÇÃO: As variáveis 'habilidades' e 'atitudes' dentro deste escopo
    // AGORA SÃO AS PROPS RECEBIDAS DO PAI, e não as 'const' definidas acima.
    // Isso garante que a lista certa para a UC seja usada.

  const handleOpcao = (item, opcao) => {
    setDados({
      ...dados,
      habilidades: { // Continua salvando no objeto 'habilidades' do state do pai
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
           AGORA, MAPAMOS SOBRE AS PROPS 'habilidades' e 'atitudes'.
           E O ATRIBUTO 'name' DOS RADIO BUTTONS FOI REVERTIDO PARA O NOME DA HABILIDADE/ATITUDE
           PARA MANTER O LAYOUT QUE VOCÊ JÁ TINHA FUNCIONANDO.
      */}
      <h4>Habilidades Desenvolvidas</h4>
      <div className="tabela-habilidades">
        {habilidades.map((hab) => ( // AGORA USA A PROP 'habilidades'
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
        {atitudes.map((att) => ( // AGORA USA A PROP 'atitudes'
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