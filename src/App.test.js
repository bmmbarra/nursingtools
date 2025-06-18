/**
 * ================================================
 * 🧪 TESTE DO COMPONENTE PRINCIPAL (APP.TEST.JS)
 * ================================================
 * 
 * Este arquivo verifica se o componente App está funcionando corretamente.
 * É um teste automatizado que roda sempre que o código é alterado.
 * 
 * O que este teste específico verifica:
 * - Se a página renderiza um link com o texto "learn react"
 * - Se esse link está visível na tela
 */

// Ferramentas para teste:
import { render, screen } from '@testing-library/react'; // Biblioteca de testes
import App from './App'; // Componente que será testado

/**
 * Teste: Verifica se o link "learn react" existe no componente App
 * 
 * Como funciona:
 * 1. Renderiza o componente <App> em um ambiente virtual de teste
 * 2. Busca na "tela virtual" por qualquer elemento que contenha o texto "learn react"
 *    (a expressão /learn react/i significa "busca sem diferenciar maiúsculas/minúsculas")
 * 3. Verifica se o elemento foi encontrado no documento
 */
test('Verifica se o link "learn react" existe', () => {
  // 1. Renderiza o componente
  render(<App />);
  
  // 2. Busca o elemento pelo texto
  const linkElement = screen.getByText(/learn react/i);
  
  // 3. Verifica se o elemento está presente
  expect(linkElement).toBeInTheDocument();
});

/**
 * ================================================
 * 📝 GUIA PARA NÃO-PROGRAMADORES
 * ================================================
 * 
 * Imagine este teste como um "fiscal de qualidade" que:
 * 
 * 1. Monta o aplicativo em um ambiente de teste (como um laboratório)
 * 2. Procura por um elemento específico (no caso, um link com o texto "learn react")
 * 3. Dá um ✅ (passou) se encontrar, ou um ❌ (falhou) se não encontrar
 * 
 * Por que isso é importante?
 * - Garante que partes críticas do aplicativo não quebrem sem aviso
 * - Roda automaticamente sempre que o código é alterado
 * - Ajuda a encontrar erros antes dos usuários finais
 * 
 * Este é um teste básico - aplicações reais teriam dezenas ou centenas deles!
 */

/**
 * Símbolos usados:
 * 🧪 = Testes/verificação
 * 📝 = Explicação para não-técnicos
 */