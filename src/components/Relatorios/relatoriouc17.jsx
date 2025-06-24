import React from "react";
import "../../components/Relatorios/relatorio.css";

const habilidades = [
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

const atitudes = [
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

const opcoes = ["Sim", "Não", "Parcialmente", "N/A"];

export default function RelatorioUC17({ uc, dados, setDados }) {
  const handleChange = (campo, valor) => {
    setDados({ ...dados, [campo]: valor });
  };

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

export const habilidadesUC17 = habilidades;
export const atitudesUC17 = atitudes;
