// ===================================================================================
// ARQUIVO: RelatorioUC10.js (VERSÃO CORRIGIDA - HABILIDADES/ATITUDES VIA PROPS E LAYOUT RESTAURADO)
// ===================================================================================

import React from "react";
import "../../components/Relatorios/relatorio.css";

// 1. Defina e exporte as habilidades e atitudes ESPECÍFICAS desta UC.
//    Estas listas SÃO APENAS DEFINIDAS AQUI e exportadas para serem importadas
//    e passadas como props pelo componente pai (FormularioEstagio.jsx).
export const habilidadesUC10 = [
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

export const atitudesUC10 = [
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

const opcoesDeAvaliacao = ["Sim", "Não", "Parcialmente", "N/A"]; // Mantido 'N/A' conforme seu código original

// 2. O COMPONENTE AGORA RECEBE 'habilidades' e 'atitudes' COMO PROPS.
export default function RelatorioUC10({ uc, dados, setDados, erros, handleChange, handleCPFChange, habilidades, atitudes }) {

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