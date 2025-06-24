// ===================================================================================
// ARQUIVO: RelatorioUC4.js
//
// PROPÓSITO GERAL:
// Este arquivo é o "modelo" específico para o formulário de relatório da Unidade
// Curricular 4 (UC4). Ele não é uma página completa, mas sim uma "peça de encaixe"
// que é carregada dentro da página principal do "Formulário de Estágio" quando
// o usuário seleciona a UC4. Ele contém todos os campos e perguntas
// pertinentes a esta Unidade Curricular.
// ===================================================================================

// --- PASSO 1: Reunindo as Ferramentas e Estilos ---
import React from "react";
import "../../components/Relatorios/relatorio.css"; // O "manual de estilo" que define a aparência dos campos deste formulário.


// --- PASSO 2: As Listas de Verificação (Questionários) ---
// Para manter o código organizado, definimos as listas de perguntas (habilidades e atitudes)
// aqui no topo. Isso facilita a manutenção e a adição de novos itens no futuro.

// A lista de todas as HABILIDADES que serão avaliadas no relatório da UC4.
const habilidades = [
  "Higienizar as mãos conforme a OMS",
  "Utilizar equipamentos de proteção",
  "Comunicar-se de maneira assertiva",
  "Selecionar materiais, equipamentos e instrumental",
  "Utilizar técnicas assépticas",
  "Monitorar parâmetros clínicos dos clientes",
  "Identificar reações, sinais e sintomas do cliente",
  "Identificar prioridades durante o atendimento",
  "Identificar situações de emergência e de risco",
  "Executar manobras de suporte básico de vida",
  "Realizar punção venosa periférica",
  "Realizar cálculos farmacológicos",
  "Administrar medicamentos VO, SL, ID, inalatória, EV",
  "Administrar alimentação por via oral",
  "Realizar bandagens e curativos",
  "Adotar boas práticas na promoção da saúde e prevenção de doenças",
  "Realizar visitas domiciliares",
  "Identificar aspectos socioeconômicos e de saúde dos grupos atendidos",
  "Identificar situações de vulnerabilidade",
  "Identificar sinais de violência",
  "Participar de atividade de acompanhamento a Grupos de Hiperdia",
  "Participar de atividade de acompanhamento da rotina de cuidados a idosos",
  "Participar de atividade de acompanhamento de consulta ginecológica",
  "Coletar dados para subsidiar ações educativas (Planejamento Familiar, DST etc.)",
  "Participar de atividades de grupos de gestantes",
  "Participar de atividade de acompanhamento de puericultura",
  "Acompanhar o manuseio, armazenamento, conservação e transporte de imunobiológicos",
  "Acompanhar o preenchimento do cartão de vacina",
  "Participar de campanhas de vacinação",
  "Interpretar documentos técnicos",
  "Utilizar termos técnicos na rotina de trabalho",
  "Operar recursos tecnológicos aplicados à saúde",
  "Realizar registros de enfermagem",
  "Preencher formulários de notificação compulsória",
  "Identificar os aspectos do próprio trabalho que interferem no serviço",
  "Mediar conflitos nas situações de trabalho",
];

// A lista de todas as ATITUDES e VALORES que serão avaliados.
const atitudes = [
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
];

// As opções de resposta padrão para cada item das listas.
const opcoes = ["Sim", "Não", "Parcialmente", "N/A"];

// --- PASSO 3: Construindo o Modelo do Formulário UC4 ---
// Aqui começa a definição do nosso componente de formulário.
// Ele é um "componente filho", recebendo informações e canais de comunicação (`props`) do "componente pai".
// `uc`: O nome da UC ("UC4"), usado para o título.
// `dados`: A "pasta" com todas as respostas já salvas, para que o formulário possa exibir os dados atuais.
// `setDados`: O "canal de comunicação" para enviar novas respostas ou alterações de volta ao componente pai.
export default function RelatorioUC4({ uc, dados, setDados }) {

  // --- PASSO 4: As Funções de "Preenchimento" ---

  // Esta função é o "anotador" para os campos de texto simples (como nome, CPF, etc.).
  // Sempre que o usuário digita algo em um desses campos, esta função é chamada.
  const handleChange = (campo, valor) => {
    // Ela usa o "canal de comunicação" (`setDados`) para atualizar a "pasta de dados"
    // principal com a nova informação, no campo correto (ex: "nome", "cpf").
    setDados({ ...dados, [campo]: valor });
  };

  // Esta função é o "marcador de opções" para as tabelas de habilidades e atitudes.
  // Quando o usuário clica em uma das opções ("Sim", "Não", etc.) para uma pergunta...
  const handleOpcao = (habilidade, opcao) => {
    // ...esta função salva a escolha na "subpasta" de 'habilidades' dentro da "pasta de dados" principal.
    // Ela garante que a resposta seja salva para a pergunta correta, sem apagar as outras.
    setDados({
      ...dados,
      habilidades: {
        ...(dados.habilidades || {}),
        [habilidade]: opcao,
      },
    });
  };

  // --- PASSO 5: Desenhando o Formulário na Tela (A "Planta Baixa") ---
  // O `return` descreve a estrutura visual deste formulário específico.
  return (
    <div className="relatorio-uc">
      {/* Título dinâmico que usa o nome da UC recebido do componente pai. */}
      <h3>Relatório da {uc}</h3>

      {/* --- Seção de Identificação do Aluno e Estágio --- */}
      <h4>Identificação</h4>

      <label>Nome completo do(a) aluno(a):</label>
      <input
        type="text"
        value={dados.nome || ""} // O campo sempre mostra o valor que está salvo na "pasta de dados".
        onChange={(e) => handleChange("nome", e.target.value)} // A cada letra digitada, chama o "anotador".
        placeholder="Digite seu nome completo"
      />

      <label>CPF do(a) aluno(a):</label>
      <input
        type="text"
        value={dados.cpf || ""}
        onChange={(e) => handleChange("cpf", e.target.value)}
        placeholder="Digite seu CPF"
      />

      <label>Turma:</label>
      <input
        type="text"
        value={dados.turma || ""}
        onChange={(e) => handleChange("turma", e.target.value)}
        placeholder="Digite sua turma"
      />

     

     

      <label>Nome do(s) instrutor(es):</label>
      <input
        type="text"
        value={dados.instrutores || ""}
        onChange={(e) => handleChange("instrutores", e.target.value)}
        placeholder="Digite o(s) nome(s) dos instrutores"
      />

    

      <label>Conclusão:</label>
      <textarea
        rows={4}
        value={dados.conclusao || ""}
        onChange={(e) => handleChange("conclusao", e.target.value)}
        placeholder="Relate o aprendizado e avaliação do estágio..."
      />

      {/* --- Seção de Avaliação das Habilidades Desenvolvidas --- */}
      <h4>Habilidades Desenvolvidas</h4>
      <div className="tabela-habilidades">
        {/* A "Fábrica de Perguntas": Em vez de escrever cada pergunta à mão,
            usamos um laço (`map`) que pega nossa lista de `habilidades`... */}
        {habilidades.map((hab, idx) => (
          // ...e para cada habilidade na lista, ele constrói uma linha na tela.
          <div key={idx} className="linha-hab">
            {/* O nome da habilidade. */}
            <span className="hab-nome">{hab}</span>
            {/* A "Fábrica de Opções": Cria os 4 botões de rádio ("Sim", "Não", etc.). */}
            {opcoes.map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={`hab-${idx}`} // Garante que só se pode marcar uma opção por linha.
                  value={opcao}
                  // O botão certo já vem marcado se a resposta estiver salva na "pasta de dados".
                  checked={(dados.habilidades?.[hab] || "") === opcao}
                  // Ao clicar, chama o nosso "marcador de opções".
                  onChange={() => handleOpcao(hab, opcao)}
                />
                {opcao}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* --- Seção de Avaliação de Atitudes e Valores --- */}
      <h4>Atitudes e Valores</h4>
      <div className="tabela-habilidades">
        {/* A "Fábrica de Perguntas" agora usa a lista de `atitudes`. */}
        {atitudes.map((att, idx) => (
          <div key={`att-${idx}`} className="linha-hab">
            <span className="hab-nome">{att}</span>
            {/* A "Fábrica de Opções" para cada atitude. */}
            {opcoes.map((opcao) => (
              <label key={opcao}>
                <input
                  type="radio"
                  name={`att-${idx}`}
                  value={opcao}
                  // Usa a mesma "subpasta" `habilidades` para guardar as respostas das atitudes.
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


export const habilidadesUC4 = habilidades;
export const atitudesUC4 = atitudes;