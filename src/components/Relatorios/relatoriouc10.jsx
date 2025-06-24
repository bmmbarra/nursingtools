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

export default function RelatorioUC10({ uc, dados, setDados }) {
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
export const habilidadesUC10 = habilidades;
export const atitudesUC10 = atitudes;