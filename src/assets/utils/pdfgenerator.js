// ===================================================================================
// ARQUIVO: pdfgenerator.js (VERSÃO FINAL CONSOLIDADA)
//
// PROPÓSITO GERAL:
// Gera um PDF (Checklist ou Relatório) com base nos dados fornecidos.
// Esta versão inclui todas as melhorias de layout, formatação e a lógica de
// validação ajustada para integração com React.
// ===================================================================================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/Images/senac-logo.png";

function marcarOpcoes(valor, opcoes) {
    return opcoes.map((op) => (valor?.toLowerCase() === op.toLowerCase() ? `(X) ${op}` : `( ) ${op}`)).join(" ");
}

function validarCamposObrigatorios({ uc, empresa, relatorio, checklist, tipo, habilidadesExigidas, checklistEstrutura }) {
    if (tipo === "Relatório") {
        // --- VALIDAÇÕES DO RELATÓRIO ---
        if (!empresa || empresa.length === 0) {
            throw new Error("Pelo menos uma unidade concedente deve ser selecionada para gerar o Relatório.");
        }
        const algumaDataFaltando = empresa.some(e => !e.dataInicio || !e.dataFim);
        if (algumaDataFaltando) {
            throw new Error("Por favor, preencha as datas de início e fim para TODAS as unidades selecionadas.");
        }
        const camposFaltantesRelatorio = ["nome", "cpf", "turma", "instrutores", "conclusao"].filter(campo => !relatorio[campo]);
        if (camposFaltantesRelatorio.length > 0) {
            const error = new Error("Campos de identificação obrigatórios não preenchidos.");
            error.campos = camposFaltantesRelatorio;
            throw error;
        }
        if (habilidadesExigidas && habilidadesExigidas.length > 0) {
            const habilidadesRespondidas = relatorio.habilidades || {};
            const algumaHabilidadeFaltando = habilidadesExigidas.some(h => !habilidadesRespondidas[h]);
            if (algumaHabilidadeFaltando) {
                throw new Error("Todas as habilidades e atitudes devem ser preenchidas. Por favor, revise a lista.");
            }
        }

    } else if (tipo === "Checklist") {
        // ==========================================================
        // LÓGICA DO CHECKLIST CORRIGIDA E ROBUSTA
        // ==========================================================
        const camposFaltantesChecklist = ["aluno", "turma", "resultado"].filter(campo => !checklist[campo]);
        if (camposFaltantesChecklist.length > 0) {
            const error = new Error("Campos obrigatórios do checklist não preenchidos.");
            error.campos = camposFaltantesChecklist;
            throw error;
        }

        if (!checklist.itens || !checklistEstrutura) {
            throw new Error("A estrutura ou os itens do checklist estão faltando. Não é possível validar.");
        }
        
        // Itera pela estrutura MESTRA e verifica se CADA item foi respondido
        for (const secao of checklistEstrutura) {
            for (const pergunta of secao.perguntas) {
                const resposta = checklist.itens[secao.titulo]?.[pergunta];
                // Falha se a resposta não existir, ou se 'acesso' ou 'status' não tiverem sido marcados
                if (!resposta || !resposta.acesso || !resposta.status) {
                    // Lança um erro específico informando qual item está faltando
                    throw new Error(`O item "${pergunta}" na seção "${secao.titulo}" precisa ser preenchido completamente (Análise e Status).`);
                }
            }
        }
    }
}

export default async function gerarPDF({ uc, empresa, relatorio, checklist, tipo, habilidadesExigidas, checklistEstrutura }) {
    // A validação rigorosa acontece aqui, agora recebendo a estrutura do checklist
    validarCamposObrigatorios({ uc, empresa, relatorio, checklist, tipo, habilidadesExigidas, checklistEstrutura });

    empresa = Array.isArray(empresa) ? empresa : [empresa];
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoImg = new Image();
    logoImg.src = logo;
    await new Promise((resolve) => (logoImg.onload = resolve));

    const atitudesList = [
        "Comprometimento com o atendimento humanizado", "Responsabilidade no uso dos recursos organizacionais", "Colaboração, flexibilidade e iniciativa no desenvolvimento do trabalho em equipe", "Proatividade na resolução de problemas", "Respeito à diversidade e aos valores morais, culturais e religiosos do cliente e da família", "Respeito ao limite da atuação profissional", "Responsabilidade no descarte de resíduos", "Sigilo no tratamento de dados e informações", "Zelo na apresentação pessoal e postura profissional", "Responsabilidade no cumprimento das normas de segurança", "Respeito às normas técnicas e legislações vigentes", "Escuta Ativa", "Registro das Ações de Enfermagem conforme a rotina e protocolo da Instituição",
    ];


if (tipo === "Checklist") {
    // ---- 1. AJUSTES PARA CONDENSAR EM UMA PÁGINA ----
    const marginH = 15;
    const marginV = 15;
    const tableMaxWidth = pageWidth - marginH * 2;
    const baseFontSize = 9;    // Reduzido para melhor ajuste
    const headerFontSize = 10;  // Reduzido para melhor ajuste
    const smallFontSize = 8;   // Reduzido para melhor ajuste
    const cellPadding = 1.5;

    // ---- 2. CORES RESTAURADAS E PADRONIZADAS (baseado no relatório) ----
    const titleFillColor = [188, 189, 176];   // Cor principal para títulos de seção
    const headerFillColor = [230, 230, 230]; // Cinza claro para cabeçalhos de tabela
    const blackColor = [0, 0, 0];            // Cor preta para fontes e linhas
    const whiteFill = [255, 255, 255];       // Adicionado para preenchimento de células como no relatório
    const greyLineColor = [200, 200, 200];   // Adicionado para linhas como no relatório

    // A função marcarOpcoes permanece inalterada, pois os valores já vêm de outro lugar.

    const inserirCabecalhoChecklist = () => {
        let posY = marginV;
        doc.addImage(logoImg, "PNG", marginH, marginV - 5, 18, 18);
        doc.setFont("times", "bold");
        doc.setFontSize(headerFontSize);
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]); // Fonte preta
        doc.text("SERVIÇO NACIONAL DE APRENDIZAGEM COMERCIAL – SENAC EM MINAS", pageWidth / 2, posY, { align: "center" });
        doc.setFontSize(baseFontSize);
        doc.text("Estágio Profissional Supervisionado", pageWidth / 2, (posY += 4), { align: "center" });
        doc.setFont("times", "normal");
        let tituloUC = "", carga = "";
        switch (uc) {
            case 'UC4': tituloUC = "Promoção à Saúde"; carga = "80 horas"; break;
            case 'UC7': tituloUC = "Cuidado Integral de Enfermagem"; carga = "120 horas"; break;
            case 'UC10': tituloUC = "Cuidado Especializado de Enfermagem"; carga = "100 horas"; break;
            case 'UC17': tituloUC = "Cuidado Crítico, Urgência e Emergência de Enfermagem"; carga = "100 horas"; break;
            default: tituloUC = "Título não definido"; carga = "Carga não definida";
        }
        doc.text(`Unidade Curricular ${uc} – ${tituloUC}`, pageWidth / 2, (posY += 5), { align: "center" });
        doc.text(`Carga horária: ${empresa?.[0]?.cargaHoraria || checklist?.cargaHoraria || carga}`, pageWidth / 2, (posY += 5), { align: "center" });
        doc.text("Unidade de Ensino Técnico do CEP de Poços de Caldas", pageWidth / 2, (posY += 5), { align: "center" });
    };

    inserirCabecalhoChecklist();
    const startY = 50;

    // --- Tabela de dados do aluno (Topo) ---
    // Estrutura similar ao cabeçalho do relatório para padronização.
    const cabecalhoChecklistBody = [
        [{ content: 'Aluno(a):', colSpan: 2, styles: { fillColor: titleFillColor, fontStyle: 'bold' } }],
        [{ content: checklist.aluno || '', colSpan: 2, styles: { fillColor: whiteFill, minCellHeight: 10 } }],
        [{ content: 'Turma:', styles: { fillColor: titleFillColor, fontStyle: 'bold' } }, { content: 'Unidade Curricular:', styles: { fillColor: titleFillColor, fontStyle: 'bold' } }],
        [{ content: checklist.turma || '', styles: { fillColor: whiteFill } }, { content: `${uc}`, styles: { fillColor: whiteFill } }],
        [{ content: 'Carga Horária:', colSpan: 2, styles: { fillColor: titleFillColor, fontStyle: 'bold' } }],
        [{ content: checklist.cargaHoraria || '', colSpan: 2, styles: { fillColor: whiteFill, minCellHeight: 10 } }],
        [{ content: 'ITENS DE AVALIAÇÃO', colSpan: 3, styles: { fillColor: titleFillColor, fontStyle: 'bold', halign: 'center', fontSize: baseFontSize } }] // ColSpan 3 para ajustar às colunas da tabela principal
    ];

    autoTable(doc, {
        startY: startY,
        body: cabecalhoChecklistBody,
        theme: 'grid',
        styles: { font: "times", fontSize: baseFontSize, cellPadding: cellPadding, textColor: blackColor, lineColor: greyLineColor, lineWidth: 0.1, valign: "middle" },
        columnStyles: { 
            0: { cellWidth: (tableMaxWidth / 2) }, // Divide igualmente as duas colunas principais
            1: { cellWidth: (tableMaxWidth / 2) }
        },
        tableWidth: tableMaxWidth,
        margin: { left: marginH, right: marginH }
    });

    let lastTableY = doc.lastAutoTable.finalY;

    // --- Corpo da tabela do checklist ---
    const corpoTabelaChecklist = [];
    for (const secao of checklistEstrutura) {
        if (checklist.itens[secao.titulo]) {
            corpoTabelaChecklist.push([{ content: secao.titulo, colSpan: 3, styles: { halign: 'center', fontStyle: 'bold', fillColor: titleFillColor, fontSize: baseFontSize, textColor: blackColor } }]);
            for (const pergunta of secao.perguntas) {
                const respostas = checklist.itens[secao.titulo][pergunta] || {};
                corpoTabelaChecklist.push([
                    { content: pergunta },
                    { content: marcarOpcoes(respostas.acesso, ["Sim", "Não"]), styles: { halign: 'center' } }, // Usando a função original
                    { content: marcarOpcoes(respostas.status, ["Regular", "Irregular", "Pendente"]), styles: { halign: 'center' } }, // Usando a função original
                ]);
            }
        }
    }
    
    // Ajuste das larguras das colunas para a tabela de itens
    // Estas larguras precisam ser balanceadas para caberem na página
    const colStatusWidth = 45; // Largura para 'Status'
    const colAcessoWidth = 45; // Largura para 'Análise'
    const colRegistroWidth = tableMaxWidth - colStatusWidth - colAcessoWidth; // O restante para 'Registro/Formulário'

    autoTable(doc, {
        startY: lastTableY,
        head: [["Registro/Formulário", "Análise", "Status"]],
        body: corpoTabelaChecklist,
        theme: 'grid',
        styles: { font: "times", fontSize: smallFontSize, valign: 'middle', cellPadding: cellPadding, textColor: blackColor, lineColor: greyLineColor, lineWidth: 0.1 },
        headStyles: { fillColor: headerFillColor, halign: 'center', fontStyle: 'bold', fontSize: baseFontSize, textColor: blackColor, lineColor: greyLineColor },
        columnStyles: { 
            0: { cellWidth: colRegistroWidth }, 
            1: { cellWidth: colAcessoWidth, halign: 'center' }, 
            2: { cellWidth: colStatusWidth, halign: 'center' } 
        },
        tableWidth: tableMaxWidth,
        margin: { left: marginH, right: marginH },
        pageBreak: 'avoid', // Ajuda a manter seções na mesma página
        willDrawCell: (data) => {
            // Lógica para quebrar a página antes de uma célula que não caberia
            const cellHeight = data.cell.height;
            const currentY = data.cursor.y;
            const pageBreakThreshold = pageHeight - marginV - 10; // Margem inferior de 10mm

            if (currentY + cellHeight > pageBreakThreshold && data.section === 'body') {
                doc.addPage();
                inserirCabecalhoChecklist(); // Adiciona o cabeçalho novamente na nova página
                data.cursor.y = startY; // Reinicia o cursor Y para o topo da nova página
            }
        }
    });

    const finalY = doc.lastAutoTable.finalY + 8;
    
    doc.setFont("times", "normal");
    doc.setFontSize(baseFontSize);
    doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    
    const resultadoFinalText = `Resultado Final: ${marcarOpcoes(checklist.resultado, ["Desenvolvida", "Não Desenvolvida"])}`;
    const cargaHorariaText = "Carga Horária realizada: ___________________";
    
    doc.text(resultadoFinalText, marginH, finalY);
    
    const cargaHorariaWidth = doc.getStringUnitWidth(cargaHorariaText) * doc.getFontSize() / doc.internal.scaleFactor;
    const rightX = pageWidth - marginH - cargaHorariaWidth;
    
    doc.text(cargaHorariaText, rightX, finalY);
    
    doc.save(`Checklist_Estagio_${uc}.pdf`);
    return;
}
    // ===================================================================================
    // --- LÓGICA PARA O RELATÓRIO ---
    // ===================================================================================
    else if (tipo === "Relatório") {

        const marginInferior = 20;
        const marginEsquerda = 30;
        const marginDireita = 20;
        const contentStartY = 66;

        function inserirCabecalho(titulo = "") {
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            doc.addImage(logoImg, "PNG", 8, 9, 22, 22);
            doc.setFont("times", "bold");
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            let currentY = 18;
            doc.text("SERVIÇO NACIONAL DE APRENDIZAGEM COMERCIAL – SENAC EM MINAS", pageWidth / 2 + 10, currentY, { align: "center" });
            currentY += 8;
            doc.text("Estágio Profissional Supervisionado", pageWidth / 2 + 10, currentY, { align: "center" });
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            let tituloUC = "", carga = "";
            switch (uc) {
                case 'UC4': tituloUC = "Promoção à Saúde"; carga = "80 horas"; break;
                case 'UC7': tituloUC = "Cuidado Integral de Enfermagem"; carga = "120 horas"; break;
                case 'UC10': tituloUC = "Cuidado Especializado de Enfermagem"; carga = "100 horas"; break;
                case 'UC17': tituloUC = "Cuidado Crítico, Urgência e Emergência de Enfermagem"; carga = "100 horas"; break;
                default: tituloUC = "Título não definido"; carga = "Carga não definida";
            }
            currentY += 8;
            doc.text(`Unidade Curricular ${uc} – ${tituloUC}`, pageWidth / 2, currentY, { align: "center" });
            currentY += 6;
            doc.text(`Carga horária: ${empresa?.[0]?.cargaHoraria || relatorio?.cargaHoraria || carga}`, pageWidth / 2, currentY, { align: "center" });
            currentY += 6;
            doc.text("Unidade de Ensino Técnico do CEP de Poços de Caldas", pageWidth / 2, currentY, { align: "center" });
            if (titulo) {
                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text(titulo.toUpperCase(), marginEsquerda, contentStartY - 10);
                doc.setFont("times", "normal");
                doc.setFontSize(12);
            }
        }

        function iniciarNovaPagina(titulo) {
            doc.addPage();
            inserirCabecalho(titulo);
        }

        function renderJustifiedText(doc, text, x, y, maxWidth, lineHeight) {
            const paragraphs = text.split('\n');
            let currentY = y;
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            paragraphs.forEach((paragraph, pIndex) => {
                if (paragraph.trim() === '') return;
                if (currentY > pageHeight - marginInferior - lineHeight) {
                    doc.addPage();
                    inserirCabecalho();
                    currentY = contentStartY;
                }
                const words = paragraph.split(' ');
                let line = '';
                const lines = [];
                for (const word of words) {
                    const testLine = line + word + ' ';
                    const testWidth = doc.getStringUnitWidth(testLine) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                    if (testWidth > maxWidth && line.length > 0) {
                        lines.push(line.trim());
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line.trim());
                lines.forEach((lineText, lIndex) => {
                    if (currentY > pageHeight - marginInferior - lineHeight) {
                        doc.addPage();
                        inserirCabecalho();
                        currentY = contentStartY;
                    }
                    const isLastLineOfParagraph = (lIndex === lines.length - 1);
                    const lineWords = lineText.split(' ');
                    if (isLastLineOfParagraph || lineWords.length === 1) {
                        doc.text(lineText, x, currentY);
                    } else {
                        const totalWidth = lineWords.reduce((sum, w) => sum + doc.getStringUnitWidth(w) * doc.internal.getFontSize() / doc.internal.scaleFactor, 0);
                        const totalSpaces = lineWords.length - 1;
                        const spaceWidth = (maxWidth - totalWidth) / totalSpaces;
                        let currentX = x;
                        for (const word of lineWords) {
                            doc.text(word, currentX, currentY);
                            currentX += doc.getStringUnitWidth(word) * doc.internal.getFontSize() / doc.internal.scaleFactor + spaceWidth;
                        }
                    }
                    currentY += lineHeight;
                });
                if (pIndex < paragraphs.length - 1) {
                    currentY += lineHeight / 2;
                }
            });
            return currentY;
        }

        function gerarCapa() {
            inserirCabecalho();
            const centerX = pageWidth / 2;
            doc.setFont("times", "bold");
            doc.setFontSize(12);
            doc.text("Relatório de Estágio Obrigatório", centerX, 160, { align: "center" });
            doc.text("Técnico em Enfermagem", centerX, 167, { align: "center" });
        }

        function gerarIdentificacao() {
            iniciarNovaPagina("IDENTIFICAÇÃO");
            const nomesUnidades = Array.isArray(empresa) ? empresa.map((e) => e.nome).join(", ") : "";
            const dataEntregaFormatada = "";
            const titleFillColor = [188, 189, 176];
            const whiteFill = [242, 242, 242];
            const tableBody = [
                [{ content: "Nome do(a) aluno(a):", colSpan: 3, styles: { fillColor: titleFillColor, fontStyle: "bold" } }],
                [{ content: relatorio.nome || "", colSpan: 3, styles: { fillColor: whiteFill } }],
                [{ content: "CPF do(a) aluno(a):", styles: { fillColor: titleFillColor, fontStyle: "bold" } }, { content: "Turma:", styles: { fillColor: titleFillColor, fontStyle: "bold" } }, { content: "Data da entrega:", styles: { fillColor: titleFillColor, fontStyle: "bold" } }],
                [{ content: relatorio.cpf || "" }, { content: relatorio.turma || "" }, { content: dataEntregaFormatada }],
                [{ content: "Unidade concedente:", colSpan: 3, styles: { fillColor: titleFillColor, fontStyle: "bold" } }],
                [{ content: nomesUnidades, colSpan: 3, styles: { fillColor: whiteFill } }],
                [{ content: "Nome do(s) instrutor(es) de estágio em enfermagem:", colSpan: 3, styles: { fillColor: titleFillColor, fontStyle: "bold" } }],
                [{ content: relatorio.instrutores || "", colSpan: 3, styles: { fillColor: whiteFill } }],
            ];

            autoTable(doc, {
                body: tableBody, styles: { font: "times", fontSize: 12, cellPadding: 2, lineColor: titleFillColor, lineWidth: 0.1, valign: "middle", textColor: [0, 0, 0] }, theme: "grid", margin: { top: contentStartY, left: marginEsquerda, right: marginDireita, bottom: marginInferior }, didDrawPage: (data) => {
                    inserirCabecalho("IDENTIFICAÇÃO");
                },
            });
        }

        function gerarIntroducao() {
            iniciarNovaPagina("INTRODUÇÃO");
            const nomesEmpresas = empresa.map((e) => e.nome).filter(Boolean).join(" e ");
            let textoIntroducao = [`Este relatório tem como objetivo descrever as atividades realizadas, observadas e acompanhadas durante o estágio curricular no campo ${nomesEmpresas}.`];
            empresa.forEach((emp) => {
                const partesTextoEmpresa = [emp.info, emp.plano, emp.descricao].filter(Boolean);
                let periodoEstagioEmpresaTexto = "";
                if (emp.dataInicio && emp.dataFim) {
                    try {
                        const inicio = new Date(emp.dataInicio + "T00:00:00");
                        const fim = new Date(emp.dataFim + "T00:00:00");
                        if (!isNaN(inicio.getTime()) && !isNaN(fim.getTime())) {
                            const dataInicioFormatada = inicio.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                            const dataFimFormatada = fim.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                            periodoEstagioEmpresaTexto = `O estágio nesta unidade foi realizado de ${dataInicioFormatada} a ${dataFimFormatada}.`;
                        }
                    } catch (error) {
                        console.error("Erro ao formatar datas do estágio:", error);
                    }
                }
                if (periodoEstagioEmpresaTexto) partesTextoEmpresa.push(periodoEstagioEmpresaTexto);
                textoIntroducao.push(partesTextoEmpresa.join("\n\n"));
            });
            const textoCompleto = textoIntroducao.join("\n\n");
            const lineHeight = 12 * 0.352778 * 1.5;
            const maxWidth = pageWidth - marginEsquerda - marginDireita;
            renderJustifiedText(doc, textoCompleto, marginEsquerda, contentStartY, maxWidth, lineHeight);
        }

        function gerarRelatorioHabilidadesEAtitudes() {
            iniciarNovaPagina("RELATÓRIO DE ATIVIDADES REALIZADAS NO CAMPO DE ESTÁGIO");
            const titleFillColor = [188, 189, 176];
            const subtitleFillColor = [242, 242, 242];
            const whiteFill = [255, 255, 255];
            const greyLineColor = [200, 200, 200];
            const minCellPadding = 1.5;
            const tableMaxWidth = pageWidth - marginEsquerda - marginDireita;
            const colRealizadoWidth = 95;
            const colAtividadesWidth = tableMaxWidth - colRealizadoWidth;
            const sharedColumnStyles = {
                0: { cellWidth: colAtividadesWidth, valign: "middle" },
                1: { cellWidth: colRealizadoWidth, halign: 'left', valign: "middle" }
            };
            const opcoesDeAvaliacao = ["Sim", "Não", "Parcialmente", "Não se aplica"];
            const cabecalhoBody = [
                [{ content: 'Nome do(a) aluno(a):', colSpan: 2, styles: { fillColor: titleFillColor, fontStyle: 'bold' } }],
                [{ content: relatorio.nome || '', colSpan: 2, styles: { fillColor: whiteFill, minCellHeight: 10 } }],
                [{ content: 'Habilidades', colSpan: 2, styles: { fillColor: titleFillColor, fontStyle: 'bold', halign: 'center', fontSize: 12 } }]
            ];

            autoTable(doc, {
                startY: contentStartY, body: cabecalhoBody, theme: 'grid', styles: { font: "times", fontSize: 12, cellPadding: minCellPadding, lineColor: greyLineColor, lineWidth: 0.1, valign: "middle", textColor: [0, 0, 0] }, tableWidth: tableMaxWidth, margin: { left: marginEsquerda, right: marginDireita }
            });

            let lastTableY = doc.lastAutoTable.finalY;

            const habilidades = Object.entries(relatorio.habilidades || {})
                .filter(([h]) => !atitudesList.includes(h));

            if (habilidades.length > 0) {
                const tableHead = [['Atividades', 'Realizado']];
                const tableBody = habilidades.map(([habilidade, resposta]) => {
                    return [habilidade, marcarOpcoes(resposta, opcoesDeAvaliacao)];
                });
                autoTable(doc, {
                    startY: lastTableY, head: tableHead, body: tableBody, theme: 'grid', styles: { font: "times", fontSize: 12, valign: 'middle', cellPadding: minCellPadding, textColor: [0, 0, 0], lineColor: greyLineColor, lineWidth: 0.1 }, headStyles: { fillColor: subtitleFillColor, fontStyle: 'bold', fontSize: 12, font: "times", textColor: [0, 0, 0], lineColor: greyLineColor, halign: 'center' }, columnStyles: sharedColumnStyles, tableWidth: tableMaxWidth, margin: { top: contentStartY, left: marginEsquerda, right: marginDireita, bottom: marginInferior }, didDrawPage: (data) => {
                        inserirCabecalho();
                    },
                    willDrawCell: (data) => {
                        const rowHeight = data.row.height;
                        if (data.cursor.y + rowHeight > pageHeight - marginInferior) {
                            data.row.pageBreak = 'before';
                        }
                    },
                });
                lastTableY = doc.lastAutoTable.finalY;
            }

            const atitudes = Object.entries(relatorio.habilidades || {})
                .filter(([h]) => atitudesList.includes(h));

            if (atitudes.length > 0) {
                const atitudesBody = [
                    [{ content: 'ATITUDES/VALORES', colSpan: 2, styles: { fillColor: titleFillColor, fontStyle: 'bold', halign: 'center', fontSize: 12 } }]
                ];
                atitudes.forEach(([atitude, resposta]) => {
                    atitudesBody.push([atitude, marcarOpcoes(resposta, opcoesDeAvaliacao)]);
                });
                autoTable(doc, {
                    startY: lastTableY, body: atitudesBody, theme: 'grid', styles: { font: "times", fontSize: 12, valign: 'middle', cellPadding: minCellPadding, textColor: [0, 0, 0], lineColor: greyLineColor, lineWidth: 0.1 }, columnStyles: sharedColumnStyles, tableWidth: tableMaxWidth, margin: { top: contentStartY, left: marginEsquerda, right: marginDireita, bottom: marginInferior }, didDrawPage: (data) => {
                        inserirCabecalho();
                    },
                    willDrawCell: (data) => {
                        const rowHeight = data.row.height;
                        if (data.cursor.y + rowHeight > pageHeight - marginInferior) {
                            data.row.pageBreak = 'before';
                        }
                    },
                });
            }
        }
        function gerarConclusao() {
            iniciarNovaPagina("CONCLUSÃO");
            const texto = relatorio.conclusao || "";
            const lineHeight = 12 * 0.352778 * 1.5;
            const maxWidth = pageWidth - marginEsquerda - marginDireita;
            renderJustifiedText(doc, texto, marginEsquerda, contentStartY, maxWidth, lineHeight);
        }

        gerarCapa();
        gerarIdentificacao();
        gerarIntroducao();
        gerarRelatorioHabilidadesEAtitudes();
        gerarConclusao();

        doc.save(`${tipo}_Estagio_${uc}.pdf`);
    }
}