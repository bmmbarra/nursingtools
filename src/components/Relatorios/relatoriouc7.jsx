// ===================================================================================
// ARQUIVO: RelatorioUC7.js (VERSÃO CORRIGIDA - HABILIDADES/ATITUDES VIA PROPS E LAYOUT RESTAURADO)
// ===================================================================================

import React from "react";
import "../../components/Relatorios/relatorio.css";

// 1. Defina e exporte as habilidades e atitudes ESPECÍFICAS desta UC.
//    Estas listas SÃO APENAS DEFINIDAS AQUI e exportadas para serem importadas
//    e passadas como props pelo componente pai (FormularioEstagio.jsx).
export const habilidadesUC7 = [
    "Higienizar as mãos conforme a OMS",
    "Utilizar equipamentos de proteção",
    "Comunicar-se de maneira assertiva",
    "Selecionar materiais, equipamentos e instrumental",
    "Utilizar técnicas assépticas",
    "Acomodar o cliente conforme ambiência, segurança e Política Nacional de Humanização",
    "Adotar estratégias de comunicação terapêutica como recurso para vínculo, de acordo com o quadro clínico do cliente",
    "Transportar o cliente de acordo com os recursos disponíveis e protocolo da instituição",
    "Mobilizar o cliente para manter a dinâmica corporal de acordo com a prescrição médica e de enfermagem",
    "Preparar o cliente de acordo com os procedimentos necessários para a realização dos exames solicitados",
    "Coletar materiais biológicos conforme os protocolos institucionais",
    "Realizar banho ou higiene, considerando o ciclo vital e o grau de dependência do cliente",
    "Avaliar a dor conforme escala preconizada pela instituição",
    "Instalar oxigenoterapia de acordo com a prescrição médica",
    "Aspirar vias aéreas superiores de acordo com a necessidade do cliente, prescrição e legislação",
    "Instalar dieta de acordo com a prescrição médica e o tipo de dispositivo",
    "Realizar curativos conforme necessidade, prescrição e protocolo",
    "Realizar procedimentos de calor e frio conforme prescrição",
    "Participar no desenvolvimento do projeto terapêutico",
    "Realizar contenção conforme intercorrências, protocolo e prescrição",
    "Administrar psicofármacos conforme prescrição e protocolo",
    "Sinalizar situações de risco conforme sintomas",
    "Preparar o corpo pós-morte respeitando aspectos religiosos e culturais",
    "Registrar atividades conforme protocolo institucional",
    "Adotar boas práticas na promoção da saúde e prevenção de doenças",
    "Identificar medidas de prevenção de doenças",
    "Identificar situações de vulnerabilidade",
    "Identificar alterações comportamentais",
    "Identificar a necessidade de contenção",
    "Identificar os aspectos do próprio trabalho que interferem no serviço",
    "Mediar conflitos nas situações de trabalho"
];

export const atitudesUC7 = [
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
    "Respeito às normas técnicas e legislações vigentes"
];

const opcoesDeAvaliacao = ["Sim", "Não", "Parcialmente", "N/A"]; // Mantido 'N/A' conforme seu código original

// 2. O COMPONENTE AGORA RECEBE 'habilidades' e 'atitudes' COMO PROPS.
export default function RelatorioUC7({ uc, dados, setDados, erros, handleChange, handleCPFChange, habilidades, atitudes }) {
    
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