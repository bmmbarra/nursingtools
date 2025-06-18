// ARQUIVO: validarChecklist.js
import { estruturaChecklist } from "../../components/Checklist/checklistuc";

export function validarChecklist(dados) {
  const erros = [];

  if (!dados.aluno || dados.aluno.trim() === "") {
    erros.push("Informe o nome do aluno.");
  }

  if (!dados.turma || dados.turma.trim() === "") {
    erros.push("Informe a turma.");
  }

  if (!dados.matrizCurricular || dados.matrizCurricular.trim() === "") {
    erros.push("Informe a matriz curricular.");
  }

  if (!dados.cargaHoraria || dados.cargaHoraria.trim() === "") {
    erros.push("Informe a carga horária.");
  }

  if (!dados.resultado) {
    erros.push("Selecione o resultado final do checklist.");
  }

  estruturaChecklist.forEach((item) => {
    item.perguntas.forEach((pergunta) => {
      const resposta = dados.itens?.[item.titulo]?.[pergunta];

      if (!resposta?.acesso) {
        erros.push(`Marque a opção "Acessado" para: ${pergunta}`);
      }

      if (!resposta?.status) {
        erros.push(`Marque o "Status" para: ${pergunta}`);
      }
    });
  });

  return erros;
}
