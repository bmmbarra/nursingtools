import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Theme from "../../components/Tema/tema";
import empresasData from "../../components/Const/empresas";
import RelatorioUC4 from "../../components/Relatorios/relatoriouc4";
import RelatorioUC7 from "../../components/Relatorios/relatoriouc7";
import RelatorioUC10 from "../../components/Relatorios/relatoriouc10";
import RelatorioUC17 from "../../components/Relatorios/relatoriouc17";
import ChecklistUC from "../../components/Checklist/checklistuc";
import gerarPDF from "../../assets/utils/pdfgenerator";

// NOVO: Importar 'toast' de react-toastify
import { toast } from 'react-toastify';
import "../Formulário/form-index.css"; // Certifique-se de que este caminho está correto

// Importa as listas de habilidades de cada UC
import { habilidadesUC4, atitudesUC4 } from "../../components/Relatorios/relatoriouc4";
import { habilidadesUC7, atitudesUC7 } from "../../components/Relatorios/relatoriouc7";
import { habilidadesUC10, atitudesUC10 } from "../../components/Relatorios/relatoriouc10";
import { habilidadesUC17, atitudesUC17 } from "../../components/Relatorios/relatoriouc17";

// Importa a estrutura mestra do Checklist para a validação
import { estruturaChecklist } from "../../components/Checklist/checklistuc";


// --- Funções Auxiliares para CPF (dentro do escopo do formulário) ---
function mascararCPF(valor) {
    return valor.replace(/\D/g, '').substring(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
    return true;
}
// ------------------------------------

const ucs = ["UC4", "UC7", "UC10", "UC17"];
const abas = ["Relatório", "Checklist"];

export default function FormularioEstagio() {
    const [ucSelecionada, setUcSelecionada] = useState("UC4");
    const [abaAtiva, setAbaAtiva] = useState("Relatório");
    const [empresasSelecionadas, setEmpresasSelecionadas] = useState([]);
    const [dadosRelatorio, setDadosRelatorio] = useState({
        nome: '', cpf: '', turma: '', instrutores: '', conclusao: '', habilidades: {}
    });
    const [dadosChecklist, setDadosChecklist] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({}); // Mantemos este state para validação de campos visuais

    const toggleEmpresa = (nome) => {
        const existe = empresasSelecionadas.find((e) => e.nome === nome);
        let atualizadas;
        if (existe) {
            atualizadas = empresasSelecionadas.filter((e) => e.nome !== nome);
        } else {
            // Ao adicionar, copiamos todos os dados de 'empresasData' para o objeto selecionado
            atualizadas = [
                ...empresasSelecionadas,
                { nome, ...empresasData[nome], dataInicio: "", dataFim: "" },
            ];
        }
        setEmpresasSelecionadas(atualizadas);
    };

    const handleEmpresaDateChange = (nomeEmpresa, tipoData, valor) => {
        setEmpresasSelecionadas((prevEmpresas) =>
            prevEmpresas.map((empresa) => {
                if (empresa.nome === nomeEmpresa) {
                    const updatedEmpresa = { ...empresa, [tipoData]: valor };
                    if (tipoData === 'dataInicio' && updatedEmpresa.dataFim && new Date(valor) > new Date(updatedEmpresa.dataFim)) {
                        updatedEmpresa.dataFim = valor;
                    }
                    return updatedEmpresa;
                }
                return empresa;
            })
        );
    };

    const handleChangeRelatorio = (e) => {
        const { name, value } = e.target;
        setDadosRelatorio(prevState => ({ ...prevState, [name]: value }));
        // Limpa o erro específico do campo quando o usuário começa a digitar
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleCPFChange = (e) => {
        const valorFormatado = mascararCPF(e.target.value);
        setDadosRelatorio(prevState => ({ ...prevState, cpf: valorFormatado }));
        // Limpa o erro de CPF quando o usuário começa a digitar
        if (errors.cpf) {
            setErrors(prevErrors => ({ ...prevErrors, cpf: null }));
        }
    };

    const validarFormularioRelatorio = () => {
        const novosErros = {};
        if (!dadosRelatorio.nome) novosErros.nome = "O nome do aluno é obrigatório.";
        if (!dadosRelatorio.turma) novosErros.turma = "A turma é obrigatória.";
        if (!dadosRelatorio.instrutores) novosErros.instrutores = "O nome do(s) instrutor(es) é obrigatório.";
        if (!dadosRelatorio.cpf) {
            novosErros.cpf = "O CPF é obrigatório.";
        } else if (!validarCPF(dadosRelatorio.cpf)) {
            novosErros.cpf = "O CPF digitado é inválido.";
        }
        // Atualiza o state de erros para que os campos visuais possam mostrar o feedback
        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleGerarPDF = async () => {
        setErrors({}); // Sempre limpa os erros visuais antes de uma nova tentativa

        // --- Validação de Formulário (UI-side) ---
        if (abaAtiva === 'Relatório' && !validarFormularioRelatorio()) {
            const camposComErro = Object.keys(errors).filter(key => errors[key]); // Filtra apenas os campos que têm mensagem de erro
            
            let mensagemErroToast = "Por favor, corrija os seguintes campos:";
            if (camposComErro.length > 0) {
                mensagemErroToast += "\n- " + camposComErro.map(campo => {
                    // Formata o nome do campo para ser mais amigável
                    switch(campo) {
                        case 'nome': return 'Nome do Aluno';
                        case 'cpf': return 'CPF do Aluno';
                        case 'turma': return 'Turma';
                        case 'instrutores': return 'Nome do(s) Instrutor(es)';
                        case 'conclusao': return 'Conclusão';
                        default: return campo; 
                    }
                }).join('\n- ');
            } else {
                mensagemErroToast = "Por favor, preencha todos os campos obrigatórios.";
            }
            
            toast.error(mensagemErroToast, { autoClose: 7000 }); // Exibe o toast com a lista
            return;
        }

        setIsLoading(true);

        setTimeout(async () => {
            try {
                let habilidadesRelatorio = [];
                let atitudesRelatorio = [];

                if (abaAtiva === "Relatório") {
                    switch (ucSelecionada) {
                        case "UC4": 
                            habilidadesRelatorio = habilidadesUC4; 
                            atitudesRelatorio = atitudesUC4; 
                            break;
                        case "UC7": 
                            habilidadesRelatorio = habilidadesUC7; 
                            atitudesRelatorio = atitudesUC7; 
                            break;
                        case "UC10": 
                            habilidadesRelatorio = habilidadesUC10; 
                            atitudesRelatorio = atitudesUC10; 
                            break;
                        case "UC17": 
                            habilidadesRelatorio = habilidadesUC17; 
                            atitudesRelatorio = atitudesUC17; 
                            break;
                        default: break;
                    }
                }

                const dadosParaPDF = {
                    uc: ucSelecionada,
                    empresa: empresasSelecionadas, // Todas as informações da empresa (incluindo detalhes) ainda estão aqui
                    relatorio: dadosRelatorio,
                    checklist: dadosChecklist,
                    tipo: abaAtiva,
                    habilidadesRelatorio: habilidadesRelatorio,
                    atitudesRelatorio: atitudesRelatorio,
                    checklistEstrutura: estruturaChecklist,
                };

                // Chama a função de geração de PDF.
                // A validação de campos obrigatórios dentro de gerarPDF.js agora também
                // lança erros específicos que podem ser pegos aqui.
                await gerarPDF(dadosParaPDF);

                toast.success('PDF gerado e salvo com sucesso!');

            } catch (error) {
                console.error("Falha na validação ou geração do PDF:", error);
                let errorMessage = error.message || "Ocorreu um erro inesperado na geração do PDF.";
                
                // Verifica se há uma lista de campos específicos no erro vindo de 'validarCamposObrigatorios' do pdfgenerator.js
                if (error.campos && Array.isArray(error.campos) && error.campos.length > 0) {
                    errorMessage = "Erro de validação: Por favor, preencha completamente os itens:";
                    error.campos.forEach(campo => {
                        errorMessage += `\n- ${campo}`; // Lista os campos específicos que faltaram
                    });
                }
                
                toast.error(errorMessage, { autoClose: 7000 }); // Exibe o toast com a mensagem de erro detalhada
            } finally {
                setIsLoading(false);
            }
        }, 0);
    };

    const renderRelatorioUC = () => {
        const commonProps = {
            uc: ucSelecionada,
            dados: dadosRelatorio,
            setDados: setDadosRelatorio,
            erros: errors, // Passa o state de erros para os componentes de relatório
            handleChange: handleChangeRelatorio,
            handleCPFChange: handleCPFChange,
        };
        switch (ucSelecionada) {
            case "UC4": return <RelatorioUC4 {...commonProps} habilidades={habilidadesUC4} atitudes={atitudesUC4} />;
            case "UC7": return <RelatorioUC7 {...commonProps} habilidades={habilidadesUC7} atitudes={atitudesUC7} />;
            case "UC10": return <RelatorioUC10 {...commonProps} habilidades={habilidadesUC10} atitudes={atitudesUC10} />;
            case "UC17": return <RelatorioUC17 {...commonProps} habilidades={habilidadesUC17} atitudes={atitudesUC17} />;
            default: return null;
        }
    };

    return (
        <main className="extra">
            <div className="home-content-box">
                <div className="header-background">
                    <header className="custom-header">
                        <div className="dot_home"><Link to="/" className="bar-link-home" /></div>
                        <div className="dot" /><div className="dot" />
                        <Link to="/formulario" className="bar-link">Relatório de Estágio </Link>
                        <div className="dot" /><div className="dot" />
                        <Link to="/calculo" className="bar-link">Calculadora</Link>
                        <div className="dot" /><div className="dot" />
                        <Link to="/glossario" className="bar-link">Glossário </Link>
                        <div className="dot" /><div className="dot" />
                        <Link to="/quiz" className="bar-link">Quiz</Link>
                        <div className="dot" /><div className="dot" />
                        <div className="dot-about"><Link to="/sobre" className="bar-link-about" /></div>
                    </header>
                </div>

                <Theme />

                <div className="formulario-container">
                    <h2 className="titulo">Formulário de Estágio Supervisionado</h2>
                    <div className="form-grid">
                        <div className="col-esquerda">
                            <label><strong>Unidade(s) Concedente(s):</strong></label>
                            <div className="lista-empresas">
                                {Object.keys(empresasData).map((nome, i) => {
                                    // Verifica se a empresa atual está selecionada
                                    const isSelected = empresasSelecionadas.some((e) => e.nome === nome);
                                    // Encontra os dados completos da empresa selecionada (para as datas)
                                    const empresaAtual = empresasSelecionadas.find((e) => e.nome === nome);

                                    return (
                                        <div key={nome} className="empresa-item">
                                            <label className="empresa-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleEmpresa(nome)} // Gerencia a seleção/desseleção
                                                />
                                                {nome}
                                            </label>

                                            {/* Renderiza os campos de data SOMENTE se a empresa estiver selecionada */}
                                            {isSelected && (
                                                <div 
                                                    className="periodo-estagio-empresa" 
                                                    style={{ 
                                                        marginBottom: '15px', 
                                                        marginTop: '5px', 
                                                        border: '1px solid #ddd', 
                                                        padding: '10px', 
                                                        borderRadius: '5px',
                                                        backgroundColor: '#f9f9f9' 
                                                    }}
                                                >
                                                    <label><strong>Início do Estágio:</strong></label>
                                                    <input 
                                                        type="date" 
                                                        value={empresaAtual?.dataInicio || ""} // Usa optional chaining para evitar erro se empresaAtual for undefined
                                                        onChange={(e) => handleEmpresaDateChange(nome, "dataInicio", e.target.value)} 
                                                    />
                                                    <label><strong>Fim do Estágio:</strong></label>
                                                    <input 
                                                        type="date" 
                                                        value={empresaAtual?.dataFim || ""} 
                                                        onChange={(e) => handleEmpresaDateChange(nome, "dataFim", e.target.value)} 
                                                        min={empresaAtual?.dataInicio || ""} // Garante que a data fim não seja anterior à data início
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-direita">
                            <div className="uc-tabs">
                                {ucs.map((uc) => (<button key={uc} onClick={() => setUcSelecionada(uc)} className={ucSelecionada === uc ? "ativo" : ""}>{uc}</button>))}
                            </div>
                            <div className="aba-tabs">
                                {abas.map((aba) => (<button key={aba} onClick={() => setAbaAtiva(aba)} className={abaAtiva === aba ? "ativo" : ""}>{aba}</button>))}
                            </div>
                            <div className="aba-conteudo">
                                {abaAtiva === "Relatório" ? renderRelatorioUC() : (<ChecklistUC uc={ucSelecionada} dados={dadosChecklist} setDados={setDadosChecklist} />)}
                            </div>
                            
                            <div className="acoes">
                                <button className="btn-enviar" onClick={handleGerarPDF} disabled={isLoading}>
                                    {isLoading ? 'Gerando PDF...' : 'Salvar PDF'}
                                </button>
                                {isLoading && <div className="spinner"></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}