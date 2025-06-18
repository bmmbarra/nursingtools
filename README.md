
# 🩺 Projeto Interativo de Enfermagem

Este é um sistema web interativo voltado para profissionais e estudantes da área da saúde, especialmente da Enfermagem. Ele oferece funcionalidades educativas e operacionais, como glossário de termos, calculadora de indicadores, formulários com checklist, quiz interativo e geração de relatórios em PDF.

---

## 🔗 Funcionalidades Principais

- **📖 Glossário:** Termos técnicos explicados de forma simples.
- **🧮 Calculadora:** Ferramenta para cálculo de indicadores e métricas da enfermagem.
- **📋 Checklist/Formulário:** Formulários para preenchimento rápido com dados estruturados.
- **❓ Quiz:** Teste de conhecimento com perguntas de múltipla escolha.
- **🧾 Gerador de PDF:** Relatórios personalizados baseados no checklist preenchido.
- **ℹ️ Página Sobre:** Informações sobre o projeto e instruções de uso.

---

## 🗂️ Estrutura de Pastas

```
src/
├── components/         # Componentes reutilizáveis (Checklist, ReportGenerator, etc.)
├── views/              # Páginas principais (Glossário, Quiz, Formulário, etc.)
├── data/               # Dados fixos como listas de termos, questões e checklists
├── utils/              # Funções auxiliares e constantes gerais
├── routes/             # Configuração das rotas do app
├── assets/             # Imagens, ícones e estilos
```

---

## 🧾 Tecnologias Utilizadas

- **React.js** – Biblioteca principal para construção da interface.
- **React Router DOM** – Gerenciamento das rotas.
- **jsPDF** – Biblioteca para geração de arquivos PDF.
- **JavaScript/JSX** – Linguagem principal do projeto.
- **CSS** – Estilização dos componentes.

---

## 🚀 Como Executar o Projeto

### 1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Inicie o projeto:
```bash
npm start
```

O sistema estará disponível em `http://localhost:3000`.

---

## 📦 Geração de Relatórios (PDF)

A geração de relatórios é feita automaticamente após o preenchimento do formulário. Os dados são processados e renderizados usando `jsPDF`, e o arquivo pode ser baixado localmente pelo usuário.

---

## 💡 Melhorias Futuras

- Integração com banco de dados (Firebase, MongoDB, etc.)
- Autenticação de usuários
- Histórico de relatórios
- Exportação em outros formatos (Excel, CSV)
- Suporte multilíngue

---

## 👥 Equipe

- **leo** – Desenvolvedor(a)
- **Colaboradores (se houver)**

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🩺 Feito com dedicação para a área da saúde
