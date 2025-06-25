// ===================================================================================
// ARQUIVO: pdfgenerator.js (VERSÃO FINAL UNIFICADA E CORRIGIDA)
//
// PROPÓSITO GERAL:
// Gera um PDF (Checklist ou Relatório) com base no tipo selecionado,
// preservando a formatação original de cada um e com lógica ABNT avançada.
// ===================================================================================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/Images/senac-logo.png";

// --- Funções Auxiliares Globais ---

function marcarOpcoes(valor, opcoes) {
  return opcoes.map((op) => (valor?.toLowerCase() === op.toLowerCase() ? `(X) ${op}` : `( ) ${op}`)).join("   ");
}

function validarCamposObrigatorios({ uc, empresa, relatorio, checklist, tipo }) {
  const camposFaltantes = [];
  if (tipo === "Relatório") {
    if (!relatorio.nome) camposFaltantes.push("Nome do(a) aluno(a)");
    if (!relatorio.cpf) camposFaltantes.push("CPF do(a) aluno(a)");
    if (!relatorio.turma) camposFaltantes.push("Turma");
    if (!relatorio.instrutores) camposFaltantes.push("Nome do(s) instrutor(es)");
    if (!relatorio.habilidades || Object.keys(relatorio.habilidades).length === 0)
      camposFaltantes.push("Avaliação de Habilidades e Atitudes");
    if (!relatorio.conclusao) camposFaltantes.push("Conclusão do aluno");
  } else if (tipo === "Checklist") {
    if (!checklist.turma) camposFaltantes.push("Turma");
    if (!checklist.aluno) camposFaltantes.push("Nome do Aluno");
    if (!checklist.itens || Object.keys(checklist.itens).length === 0) camposFaltantes.push("Itens do Checklist");
    if (!checklist.resultado) camposFaltantes.push("Resultado Final");
  }
  if (camposFaltantes.length > 0) {
    alert(
      "Por favor, preencha os seguintes campos obrigatórios antes de gerar o PDF:\n\n- " +
        camposFaltantes.join("\n- ")
    );
    return false;
  }
  return true;
}

// --- Função Principal de Geração de PDF ---

export default async function gerarPDF({ uc, empresa, relatorio, checklist, tipo }) {
  empresa = Array.isArray(empresa) ? empresa : [empresa];
  if (!validarCamposObrigatorios({ uc, empresa, relatorio, checklist, tipo })) {
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const logoImg = new Image();
  logoImg.src = logo;
  await new Promise((resolve) => (logoImg.onload = resolve));
  
  // << CORREÇÃO >>: Lista movida para dentro da função para garantir o escopo correto.
  const atitudesList = [
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


  // ===================================================================================
  // --- LÓGICA PARA O CHECKLIST (CÓDIGO ORIGINAL PRESERVADO) ---
  // ===================================================================================
  if (tipo === "Checklist") {

    const inserirCabecalhoChecklist = () => {
        const centerX = pageWidth / 2;
        let posY = 15;
        doc.addImage(logoImg, "PNG", 8, 9, 22, 22);
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        doc.text("SERVIÇO NACIONAL DE APRENDIZAGEM COMERCIAL – SENAC EM MINAS", centerX, posY, { align: "center" });
        doc.text("Estágio Profissional Supervisionado", centerX, (posY += 6), { align: "center" });
        doc.setFont("times", "normal");

        let tituloUC = "";
        let carga = "";

        switch (uc) {
            case 'UC4': tituloUC = "Promoção à Saúde"; carga = "80 horas"; break;
            case 'UC7': tituloUC = "Cuidado Integral de Enfermagem"; carga = "120 horas"; break;
            case 'UC10': tituloUC = "Cuidado Especializado de Enfermagem"; carga = "100 horas"; break;
            case 'UC17': tituloUC = "Cuidado Crítico, Urgência e Emergência de Enfermagem"; carga = "100 horas"; break;
            default: tituloUC = "Título não definido"; carga = "Carga não definida";
        }

        doc.text(`Unidade Curricular ${uc} – ${tituloUC}`, centerX, (posY += 6), { align: "center" });
        doc.text(`Carga horária: ${empresa?.[0]?.cargaHoraria || checklist?.cargaHoraria || carga}`, centerX, (posY += 6), { align: "center" });
        posY += 6;
        doc.text("Unidade de Ensino Técnico do CEP de Poços de Caldas", centerX, (posY += 6), { align: "center" });
        doc.setFontSize(11);
    };

    inserirCabecalhoChecklist();

    const dadosTopo = [
        ["Turma:", checklist.turma || "", "Matriz Curricular:", checklist.matrizCurricular || ""],
        ["Aluno:", checklist.aluno || "", "", ""],
        ["Unidade Curricular:", `${uc}`, "Carga Horária:", checklist.cargaHoraria || ""],
    ];
    autoTable(doc, {
        startY: 55,
        body: dadosTopo,
        styles: { font: "times", fontSize: 10, cellPadding: 1 },
        theme: "grid",
        columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 40 } },
    });

    const corpoTabela = [];
    for (const [titulo, perguntas] of Object.entries(checklist.itens || {})) {
        corpoTabela.push([{ content: titulo, colSpan: 3, styles: { halign: "left", fontStyle: "bold" } }]);
        for (const [pergunta, respostas] of Object.entries(perguntas)) {
            corpoTabela.push([
                { content: pergunta },
                { content: marcarOpcoes(respostas.acesso, ["Sim", "Não"]), styles: { halign: "center" } },
                { content: marcarOpcoes(respostas.status, ["Regular", "Irregular", "Pendente"]), styles: { halign: "center", cellWidth: 60 } },
            ]);
        }
    }

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 5,
        head: [["Registro/Formulário", "Análise do Registro/Formulário", "Status"]],
        body: corpoTabela,
        styles: { font: "times", fontSize: 9, textColor: [0, 0, 0], cellPadding: 2 },
        headStyles: { fillColor: [230, 230, 230], halign: 'center', fontStyle: 'bold', fontSize: 8, valign: 'middle' },
        theme: "grid",
        columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 30 }, 2: { cellWidth: 40 } },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const resultadoFinal = marcarOpcoes(checklist.resultado, ["Desenvolvida", "Não Desenvolvida"]);
    doc.text(`Resultado Final: ${resultadoFinal}`, 15, finalY);
    doc.text(`Carga Horária realizada: ______________________`, 120, finalY);

    doc.save(`Checklist_Estagio_${uc}.pdf`);
    return;
  } 
  // ===================================================================================
  // --- LÓGICA PARA O RELATÓRIO (CÓDIGO ABNT AVANÇADO) ---
  // ===================================================================================
  else if (tipo === "Relatório") {
    
    const marginInferior = 20;
    const marginEsquerda = 30;
    const marginDireita = 20;
    const contentStartY = 66;

    function inserirCabecalho(titulo = "") {
        doc.setFont("arial", "normal");
        doc.setFontSize(12);
        doc.addImage(logoImg, "PNG", 8, 9, 22, 22);

        doc.setFont("arial", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let currentY = 18;
        doc.text("SERVIÇO NACIONAL DE APRENDIZAGEM COMERCIAL – SENAC EM MINAS", pageWidth / 2 + 10, currentY, { align: "center" });
        currentY += 8;
        doc.text("Estágio Profissional Supervisionado", pageWidth / 2 + 10, currentY, { align: "center" });

        doc.setFont("arial", "normal");
        doc.setFontSize(12);

        let tituloUC = "";
        let carga = "";
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
            doc.setFont("arial", "bold");
            doc.setFontSize(12);
            doc.text(titulo.toUpperCase(), marginEsquerda, currentY + 14); 
            doc.setFont("arial", "normal");
            doc.setFontSize(12);
        }
    }

    function iniciarNovaPagina(titulo) {
        doc.addPage();
        inserirCabecalho(titulo);
    }

    function corTexto(valor) {
        const v = valor?.toLowerCase();
        if (v === "sim") return [0, 128, 0];
        if (v === "não") return [255, 0, 0];
        if (v === "parcialmente") return [255, 165, 0];
        return [0, 0, 0];
    }

    function renderJustifiedText(doc, text, x, y, maxWidth, lineHeight) {
        const paragraphs = text.split('\n\n');
        let currentY = y;

        doc.setFont("arial", "normal");
        doc.setFontSize(12);

        paragraphs.forEach((paragraph, pIndex) => {
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
        doc.setFont("arial", "bold");
        doc.setFontSize(12);
        doc.text("Relatório de Estágio Obrigatório", centerX, 160, { align: "center" });
        doc.text("Técnico em Enfermagem", centerX, 167, { align: "center" });
    }

    function gerarIdentificacao() {
        iniciarNovaPagina("IDENTIFICAÇÃO");
        const nomesUnidades = Array.isArray(empresa) ? empresa.map((e) => e.nome).join(", ") : "";
        const dataEntregaFormatada = "";
        const greyFill = [200, 200, 200];
        const whiteFill = [255, 255, 255];
        const tableBody = [
            [{ content: "Nome do(a) aluno(a):", colSpan: 3, styles: { fillColor: greyFill, fontStyle: "bold" } }],
            [{ content: relatorio.nome || "", colSpan: 3, styles: { fillColor: whiteFill } }],
            [{ content: "CPF do(a) aluno(a):", styles: { fillColor: greyFill, fontStyle: "bold" } }, { content: "Turma:", styles: { fillColor: greyFill, fontStyle: "bold" } }, { content: "Data da entrega:", styles: { fillColor: greyFill, fontStyle: "bold" } } ],
            [{ content: relatorio.cpf || "" }, { content: relatorio.turma || "" }, { content: dataEntregaFormatada }],
            [{ content: "Unidade concedente:", colSpan: 3, styles: { fillColor: greyFill, fontStyle: "bold" } }],
            [{ content: nomesUnidades, colSpan: 3, styles: { fillColor: whiteFill } }],
            [{ content: "Nome do(s) instrutor(es) de estágio em enfermagem:", colSpan: 3, styles: { fillColor: greyFill, fontStyle: "bold" } }],
            [{ content: relatorio.instrutores || "", colSpan: 3, styles: { fillColor: whiteFill } }],
        ];

        autoTable(doc, {
            body: tableBody,
            styles: { font: "arial", fontSize: 12, cellPadding: 2, lineColor: greyFill, lineWidth: 0.1, valign: "middle", textColor: [0,0,0] },
            theme: "grid",
            margin: { top: contentStartY, left: marginEsquerda, right: marginDireita, bottom: marginInferior },
            didDrawPage: (data) => {
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
                } catch (error) { console.error("Erro ao formatar datas do estágio:", error); }
            }
            if (periodoEstagioEmpresaTexto) partesTextoEmpresa.push(periodoEstagioEmpresaTexto);
            textoIntroducao.push(partesTextoEmpresa.join("\n\n"));
        });
        const textoCompleto = textoIntroducao.join("\n\n");
        const lineHeight = 12 * 0.352778 * 1.5;
        const maxWidth = pageWidth - marginEsquerda - marginDireita;
        renderJustifiedText(doc, textoCompleto, marginEsquerda, contentStartY, maxWidth, lineHeight);
    }

function gerarHabilidades() {
    // Mantém o título principal no cabeçalho da página
    iniciarNovaPagina("RELATÓRIO DE ATIVIDADES REALIZADAS NO CAMPO DE ESTÁGIO");

    const greyFill = [200, 200, 200]; 
    const whiteFill = [255, 255, 255];
    const minCellPadding = 0.5;

    const tableMaxWidth = pageWidth - marginEsquerda - marginDireita;
    const colRealizadoWidth = 85;
    const colAtividadesWidth = tableMaxWidth - colRealizadoWidth;

    const sharedColumnStyles = {
        0: { cellWidth: colAtividadesWidth },
        1: { cellWidth: colRealizadoWidth }
    };

    // Corpo da primeira tabela (cabeçalho customizado)
    const nomeAlunoBody = [
        [{ content: 'Nome do(a) aluno(a):', colSpan: 2, styles: { fillColor: greyFill, fontStyle: 'bold' } }],
        [{ 
            content: relatorio.nome || '', 
            colSpan: 2, 
            styles: { 
                fillColor: whiteFill,
                minCellHeight: 10
            } 
        }],
        [{ content: 'Habilidades', colSpan: 2, styles: { fillColor: greyFill, fontStyle: 'bold', halign: 'center' } }]
    ];

    autoTable(doc, {
        startY: contentStartY,
        body: nomeAlunoBody,
        theme: 'grid',
        styles: { font: "arial", fontSize: 12, cellPadding: minCellPadding, lineColor: greyFill, lineWidth: 0.1, valign: "middle", textColor: [0, 0, 0] },
        columnStyles: sharedColumnStyles,
        tableWidth: tableMaxWidth,
        margin: { left: marginEsquerda, right: marginDireita }
    });

    const lastTableY = doc.lastAutoTable.finalY;

    const habilidades = Object.entries(relatorio.habilidades || {})
        .filter(([h]) => !atitudesList.includes(h));

    if (habilidades.length === 0) {
        doc.setFont("arial", "normal");
        doc.setFontSize(12);
        doc.text("Nenhuma habilidade foi avaliada neste relatório.", marginEsquerda, lastTableY + 10);
        return;
    }

    const opcoesDeAvaliacao = ["Sim", "Não", "Parcialmente", "Não se aplica"];
    const tableHead = [["Atividades", "Realizado"]];
    const tableBody = habilidades.map(([habilidade, resposta]) => {
        const opcoesMarcadas = marcarOpcoes(resposta, opcoesDeAvaliacao);
        return [habilidade, opcoesMarcadas];
    });

    autoTable(doc, {
        startY: lastTableY, 
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        styles: { font: "arial", fontSize: 11, valign: 'middle', cellPadding: minCellPadding, textColor: [0, 0, 0] },
        headStyles: { 
          // << CORREÇÃO AQUI >>: Usando um tom de cinza mais claro (230)
          fillColor: [230, 230, 230], 
          fontStyle: 'bold', 
          halign: 'center', 
          fontSize: 12,
          textColor: [0, 0, 0]
        },
        columnStyles: sharedColumnStyles,
        tableWidth: tableMaxWidth,
        margin: { top: 60, left: marginEsquerda, right: marginDireita, bottom: marginInferior },
        didDrawPage: (data) => {
            inserirCabecalho();
        },
    });
}
    function gerarAtitudes() {
        if (!relatorio.habilidades) return;
        const atitudesLinhas = atitudesList.map((a) => [a, relatorio.habilidades[a] || "Não informado"]);
        if (atitudesLinhas.length === 0) return;
        iniciarNovaPagina("ATITUDES / VALORES");
        autoTable(doc, {
            head: [["Atitude / Valor", "Avaliação"]],
            body: atitudesLinhas,
            styles: { font: "arial", fontSize: 12, lineHeightFactor: 1.5, textColor: [0, 0, 0] },
            headStyles: { fillColor: [230, 230, 230], fontStyle: "bold", textColor: [0,0,0], fontSize: 12, font: "arial" },
            columnStyles: { 1: { halign: "center", didParseCell: (data) => { data.cell.styles.textColor = corTexto(data.cell.raw); } } },
            theme: "grid",
            margin: { top: contentStartY, left: marginEsquerda, right: marginDireita, bottom: marginInferior },
            didDrawPage: (data) => {
                inserirCabecalho("ATITUDES / VALORES");
            },
        });
    }

    function gerarConclusao() {
        iniciarNovaPagina("CONCLUSÃO");
        const texto = relatorio.conclusao || "";
        const textoFormatado = texto.replace(/\n/g, '\n\n');
        const lineHeight = 12 * 0.352778 * 1.5;
        const maxWidth = pageWidth - marginEsquerda - marginDireita;
        renderJustifiedText(doc, textoFormatado, marginEsquerda, contentStartY, maxWidth, lineHeight);
    }
    
    gerarCapa();
    gerarIdentificacao();
    gerarIntroducao();
    gerarHabilidades();
    gerarAtitudes();
    gerarConclusao();
    doc.save(`${tipo}_Estagio_${uc}.pdf`);
  }
}