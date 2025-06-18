/**
 * ================================================
 * 🚀 PONTO DE ENTRADA DO APLICATIVO (MAIN.JS)
 * ================================================
 * 
 * Este é o arquivo principal que inicia toda a aplicação React.
 * Funciona como o "motor de arranque" do sistema.
 * 
 * O que ele faz:
 * 1. Encontra o elemento HTML com id="root" (onde o app será renderizado)
 * 2. Monta o componente principal <App> dentro dele
 * 3. Ativa verificações extras de desenvolvimento (StrictMode)
 */

// Importa as bibliotecas necessárias
import React from 'react'; // Biblioteca principal
import ReactDOM from 'react-dom/client'; // Ferramentas para renderizar na web

// Importa o componente principal do aplicativo
import App from './App';

/**
 * 1. Localiza a "div" onde o aplicativo será montado
 * (No arquivo public/index.html existe uma div com id="root")
 */
const rootElement = document.getElementById('root');

/**
 * 2. Cria a "raiz" do React nesse elemento
 * (Prepara o terreno para renderizar componentes)
 */
const root = ReactDOM.createRoot(rootElement);

/**
 * 3. Renderiza o aplicativo dentro da raiz
 * - <React.StrictMode> ativa verificações extras para evitar bugs
 * - <App /> é o componente principal que contém toda a aplicação
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * DICA PARA NÃO-PROGRAMADORES:
 * 
 * Imagine este arquivo como:
 * - O "motor de partida" de um carro (inicia todo o sistema)
 * - A "planta baixa" que diz onde o prédio (app) será construído
 * 
 * Todo aplicativo React tem um arquivo similar a este!
 */