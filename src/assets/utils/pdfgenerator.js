// ===================================================================================
// ARQUIVO: pdfgenerator.js
//
// PROPÓSITO GERAL:
// Este arquivo é a nossa "Gráfica Digital". Sua única função é receber um
// conjunto de informações (os dados do estágio) e usar essas informações para
// construir e formatar um documento PDF profissional, pronto para ser salvo ou impresso.
// Ele sabe criar dois tipos de documentos: um "Checklist" e um "Relatório".
// ===================================================================================

// --- PASSO 1: Importando as Ferramentas da Gráfica ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/Images/senac-logo.png";

// --- PASSO 2: Listas e Assistentes de Formatação ---

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
  "Registro das Ações de Enfermagem conforme a rotina e protocolo da Instituição"
];

function gerarTextoIntroducao(empresa) {
  return [
    `Este relatório tem como objetivo descrever as atividades realizadas, observadas e acompanhadas durante o estágio curricular no campo ${empresa.nome} no período de ${empresa.periodoEstagio || empresa.periodo}.`,
    empresa.info,
    empresa.plano,
    empresa.descricao
  ].filter(Boolean).join("\n\n");
}

function marcarOpcoes(valor, opcoes) {
  return opcoes.map(op => (valor?.toLowerCase() === op.toLowerCase() ? `(X) ${op}` : `( ) ${op}`)).join("   ");
}

function validarCamposObrigatorios({ uc, empresa, relatorio, checklist, tipo }) {
  const camposFaltantes = [];

  if (tipo === "Relatório") {
    if (!relatorio.nome) camposFaltantes.push("Nome do(a) aluno(a)");
    if (!relatorio.cpf) camposFaltantes.push("CPF do(a) aluno(a)");
    if (!relatorio.turma) camposFaltantes.push("Turma");
    // if (!empresa.nome && !relatorio.empresa) camposFaltantes.push("Unidade concedente (Empresa)");
    if (!relatorio.instrutores) camposFaltantes.push("Nome do(s) instrutor(es)");
    if (!relatorio.habilidades || Object.keys(relatorio.habilidades).length === 0) {
      camposFaltantes.push("Avaliação de Habilidades e Atitudes");
    }
    if (!relatorio.conclusao) camposFaltantes.push("Conclusão do aluno");
  } else if (tipo === "Checklist") {
    if (!checklist.turma) camposFaltantes.push("Turma");
    if (!checklist.aluno) camposFaltantes.push("Nome do Aluno");
    if (!checklist.itens || Object.keys(checklist.itens).length === 0) {
      camposFaltantes.push("Itens do Checklist");
    }
    if (!checklist.resultado) camposFaltantes.push("Resultado Final");
  }

  if (camposFaltantes.length > 0) {
    const mensagem = "Por favor, preencha os seguintes campos obrigatórios antes de gerar o PDF:\n\n- " + camposFaltantes.join("\n- ");
    alert(mensagem);
    return false;
  }

  return true;
}

// --- PASSO 2.1: Ferramenta de Justificação de Texto ---
/**
 * Adiciona texto justificado a um documento jsPDF.
 * @param {jsPDF} doc O objeto jsPDF.
 * @param {string} text O texto a ser justificado.
 * @param {number} x A coordenada X inicial.
 * @param {number} y A coordenada Y inicial.
 * @param {number} maxWidth A largura máxima da linha.
 * @param {number} lineHeight A altura de cada linha de texto.
 * @returns {number} A nova coordenada Y após adicionar o texto.
 */
function addJustifiedText(doc, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    // Quebra o texto em linhas que cabem na largura máxima
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        // Calcula a largura real da linha de teste
        const testWidth = doc.getStringUnitWidth(testLine) * doc.internal.getFontSize() / doc.internal.scaleFactor;

        if (testWidth > maxWidth && line !== '') {
            lines.push(line);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line); // Adiciona a última linha

    // Itera sobre as linhas para justificar e adicionar ao documento
    lines.forEach((currentLine, index) => {
        if (index === lines.length - 1) { // Última linha de um parágrafo, alinha à esquerda
            doc.text(currentLine.trim(), x, y);
        } else {
            const wordsInLine = currentLine.trim().split(' ');
            if (wordsInLine.length === 1) { // Linha com apenas uma palavra, alinha à esquerda
                doc.text(wordsInLine[0], x, y);
            } else {
                // Calcula a largura atual da linha e o espaço necessário para justificar
                const lineWidth = doc.getStringUnitWidth(currentLine.trim()) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const spaceToAdd = maxWidth - lineWidth;
                const numSpaces = wordsInLine.length - 1;
                const spaceWidth = doc.getStringUnitWidth(' ') * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const additionalSpace = spaceToAdd / numSpaces;

                let justifiedLine = wordsInLine[0];
                for (let i = 1; i < wordsInLine.length; i++) {
                    // Adiciona espaços extras para justificar
                    justifiedLine += ' '.repeat(Math.floor(additionalSpace / spaceWidth) + 1) + wordsInLine[i];
                }
                doc.text(justifiedLine, x, y);
            }
        }
        y += lineHeight; // Avança para a próxima linha
    });
    return y; // Retorna a nova posição Y para continuar adicionando texto
}

export default async function gerarPDF({ uc, empresa, relatorio, checklist, tipo }) {
  empresa = Array.isArray(empresa) ? empresa : [empresa];
  const dadosParaValidar = { uc, empresa, relatorio, checklist, tipo };
  if (!validarCamposObrigatorios(dadosParaValidar)) {
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const logoImg = new Image();
  logoImg.src = logo;
  await new Promise((resolve) => (logoImg.onload = resolve));

  const inserirCabecalho = () => {
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
      case 'UC4':
        tituloUC = "Promoção à Saúde";
        carga = "80 horas";
        break;
      case 'UC7':
        tituloUC = "Cuidado Integral de Enfermagem";
        carga = "120 horas";
        break;
      case 'UC10':
        tituloUC = "Cuidado Especializado de Enfermagem";
        carga = "100 horas";
        break;
      case 'UC17':
        tituloUC = "Cuidado Crítico, Urgência e Emergência de Enfermagem";
        carga = "100 horas";
        break;
      default:
        tituloUC = "Título não definido";
        carga = "Carga não definida";
    }

    doc.text(`Unidade Curricular ${uc} – ${tituloUC}`, centerX, (posY += 6), { align: "center" });
    doc.text(`Carga horária: ${empresa.cargaHoraria || checklist?.cargaHoraria || carga}`, centerX, (posY += 6), { align: "center" });

    posY += 6;
    doc.text("Unidade de Ensino Técnico do CEP de Poços de Caldas", centerX, (posY += 6), { align: "center" });
    doc.setFontSize(11);
  };

  const corTexto = (valor) => {
    if (!valor) return [0, 0, 0];
    const v = valor.toLowerCase();
    if (v === "sim") return [0, 128, 0];
    if (v === "não") return [255, 0, 0];
    if (v === "parcialmente") return [255, 165, 0];
    return [0, 0, 0];
  };

  if (tipo === "Checklist") {
    const gerarTabelaChecklist = () => {
      inserirCabecalho();

      const dadosTopo = [
        ["Turma:", checklist.turma || "", "Matriz Curricular:", checklist.matrizCurricular || ""],
        ["Aluno:", checklist.aluno || "", "", ""],
        ["Unidade Curricular:", `${uc}`, "Carga Horária:", checklist.cargaHoraria || ""]
      ];
      autoTable(doc, {
        startY: 35,
        body: dadosTopo,
        styles: { font: "times", fontSize: 10, cellPadding: 1 },
        theme: "grid",
        columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 40 } }
      });

      const corpoTabela = [];
      for (const [titulo, perguntas] of Object.entries(checklist.itens || {})) {
        corpoTabela.push([{ content: titulo, colSpan: 3, styles: { halign: "left", fontStyle: "bold" } }]);
        for (const [pergunta, respostas] of Object.entries(perguntas)) {
          corpoTabela.push([
            { content: pergunta },
            { content: marcarOpcoes(respostas.acesso, ["Sim", "Não"]), styles: { halign: "center" } },
            { content: marcarOpcoes(respostas.status, ["Regular", "Irregular", "Pendente"]), styles: { halign: "center", cellWidth: 60 } }
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
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 30 },
          2: { cellWidth: 40 }
        }
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      const resultadoFinal = marcarOpcoes(checklist.resultado, ["Desenvolvida", "Não Desenvolvida"]);
      doc.text(`Resultado Final: ${resultadoFinal}`, 15, finalY);
      doc.text(`Carga Horária realizada: ______________________`, 120, finalY);
    };

    // CORREÇÃO: Nome da função 'gerarTabelaChecklist' corrigido
    gerarTabelaChecklist();
    doc.save(`Checklist_Estagio_${uc}.pdf`);
    return;
  }

  const gerarCapa = () => {
    inserirCabecalho();
    const centerX = pageWidth / 2;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("Relatório de Estágio Obrigatório", centerX, 160, { align: "center" });
    doc.text("Técnico em Enfermagem", centerX, 167, { align: "center" });
  };

  const gerarIdentificacao = () => {
    doc.addPage();
    inserirCabecalho();
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("IDENTIFICAÇÃO", 15, 65);

    const nomesUnidades = empresa.map((e) => e.nome).join(", ");

    const info = [
      [`Nome do(a) aluno(a): ${relatorio.nome || ""}`],
      [`CPF do(a) aluno(a): ${relatorio.cpf || ""}`],
      [`Turma: ${relatorio.turma || ""}`],
      [`Data da entrega: ${relatorio.dataEntrega || ""}`],
      [`Unidade concedente: ${nomesUnidades}`],
      [`Nome do(s) instrutor(es): ${relatorio.instrutores || ""}`],
    ];

    autoTable(doc, {
      startY: 75,
      body: info.map(i => [i]),
      styles: { font: "times", fontSize: 11, cellPadding: 3, halign: "left" },
    });
  };

  const gerarIntroducao = () => {
    doc.addPage();
    inserirCabecalho();

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("INTRODUÇÃO", 15, 65);

    doc.setFont("times", "normal");
    doc.setFontSize(11);

    let y = 75; // posição inicial após o título
    const marginX = 15; // Margem esquerda
    const contentWidth = pageWidth - (marginX * 2); // Largura disponível para o texto
    const lineHeight = 6; // Altura da linha para fontSize 11

    // Lista os nomes das empresas
    const nomesEmpresas = empresa.map(e => e.nome).filter(Boolean);
    const nomesJuntos = nomesEmpresas.join(" e ");

    // Assume o período da primeira empresa (se todas forem iguais)
    const periodo = empresa[0]?.periodoEstagio || empresa[0]?.periodo || "";

    // Frase introdutória única
    const textoInicial = `Este relatório tem como objetivo descrever as atividades realizadas, observadas e acompanhadas durante o estágio curricular no campo ${nomesJuntos} no período de ${periodo}.`;

    // Usa a nova função para justificar o texto
    y = addJustifiedText(doc, textoInicial, marginX, y, contentWidth, lineHeight);
    y += 5; // Espaçamento extra após o parágrafo inicial

    // Agora, adiciona os blocos individuais de cada empresa (sem repetir a frase inicial)
    empresa.forEach((emp, index) => {
        const texto = [emp.info, emp.plano, emp.descricao].filter(Boolean).join("\n\n");

        // Quebra o texto em parágrafos para tratar cada um separadamente com a justificação
        const paragrafos = texto.split('\n\n').filter(Boolean);

        paragrafos.forEach(paragrafo => {
            // Estima a altura do parágrafo para verificar se cabe na página atual
            const alturaEstimativaParagrafo = (doc.splitTextToSize(paragrafo, contentWidth).length) * lineHeight + 5;

            if (y + alturaEstimativaParagrafo > 280) { // Se não couber, adiciona nova página
                doc.addPage();
                inserirCabecalho();
                doc.setFont("times", "bold");
                doc.setFontSize(14);
                doc.text("INTRODUÇÃO", 15, 65);
                doc.setFont("times", "normal");
                doc.setFontSize(11);
                y = 75; // Reseta Y para o início da nova página
            }

            y = addJustifiedText(doc, paragrafo, marginX, y, contentWidth, lineHeight);
            y += 5; // Espaçamento entre parágrafos
        });
    });
  };

  const gerarHabilidades = () => {
    const habilidades = Object.entries(relatorio.habilidades || {}).filter(
      ([h]) => !atitudesList.includes(h)
    );
    if (habilidades.length === 0) return;

    doc.addPage();
    inserirCabecalho();
    doc.text("HABILIDADES", 15, 65);
    const linhas = habilidades.map(([titulo, val]) => [titulo, val]);
    autoTable(doc, {
      startY: 75,
      head: [["Habilidade", "Avaliação"]],
      body: linhas,
      styles: { font: "times", fontSize: 10, textColor: [0, 0, 0] },
      headStyles: { fillColor: [230, 230, 230] },
      columnStyles: {
        1: {
          halign: "center",
          textColor: (data) => corTexto(data.cell.raw)
        }
      }
    });
  };

  const gerarAtitudes = () => {
    if (!relatorio.habilidades) return;
    const atitudesLinhas = atitudesList.map(a => [a, relatorio.habilidades[a] || "Não informado"]);
    if (atitudesLinhas.length === 0) return;

    doc.addPage();
    inserirCabecalho();
    doc.text("ATITUDES / VALORES", 15, 65);
    autoTable(doc, {
      startY: 75,
      head: [["Atitude / Valor", "Avaliação"]],
      body: atitudesLinhas,
      styles: { font: "times", fontSize: 10, textColor: [0, 0, 0] },
      headStyles: { fillColor: [230, 230, 230] },
      columnStyles: {
        1: {
          halign: "center",
          textColor: (data) => corTexto(data.cell.raw)
        }
      }
    });
  };

  const gerarConclusao = () => {
    doc.addPage();
    inserirCabecalho();
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("CONCLUSÃO", 15, 65);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const texto = relatorio.conclusao || "";
    const marginX = 15;
    const contentWidth = pageWidth - (marginX * 2);
    const lineHeight = 6; // Mesma altura de linha da introdução

    // Quebra o texto em parágrafos para justificar cada um
    const paragrafos = texto.split('\n\n').filter(Boolean);
    let y = 75;

    paragrafos.forEach(paragrafo => {
        y = addJustifiedText(doc, paragrafo, marginX, y, contentWidth, lineHeight);
        y += 5; // Espaçamento entre parágrafos
    });
  };

  gerarCapa();
  gerarIdentificacao();
  gerarIntroducao();
  gerarHabilidades();
  gerarAtitudes();
  gerarConclusao();

  doc.save(`${tipo}_Estagio_${uc}.pdf`);
}