// ARQUIVO: validadorRelatorio.js

export function validarRelatorio(dados, habilidades, atitudes) {
  const erros = [];

  if (!dados.nome) erros.push("Nome do(a) aluno(a) está vazio.");
  if (!dados.cpf) erros.push("CPF do(a) aluno(a) está vazio.");
  if (!dados.turma) erros.push("Turma está vazia.");
  //if (!dados.dataEntrega) erros.push("Data de entrega está vazia.");
 // if (!dados.empresa) erros.push("Unidade concedente está vazia.");
  if (!dados.instrutores) erros.push("Nome dos instrutores está vazio.");
  if (!dados.conclusao) erros.push("Campo de conclusão está vazio.");

  const respostas = dados.habilidades || {};

  const faltamHab = habilidades.filter((h) => !respostas[h]);
  if (faltamHab.length > 0) {
    erros.push(`Faltam ${faltamHab.length} habilidade(s) para avaliar.`);
  }

  const faltamAtt = atitudes.filter((a) => !respostas[a]);
  if (faltamAtt.length > 0) {
    erros.push(`Faltam ${faltamAtt.length} atitude(s) para avaliar.`);
  }

  return erros;
}
