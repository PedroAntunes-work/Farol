# Documentação do projeto

Este documento explica a estrutura do projeto **Semáforo interativo**, como a
aplicação funciona e os principais conceitos de React usados na implementação.

## 1. O que a aplicação faz

A página mostra um semáforo com luzes vermelha, amarela e verde. A luz vermelha
fica ativa inicialmente. O usuário pode:

- usar **Próxima luz** para percorrer a sequência vermelho → verde → amarelo →
  vermelho;
- escolher diretamente uma cor pelos botões;
- ver o significado da cor ativa: **PARE**, **SIGA** ou **ATENÇÃO**.

A interface é atualizada a partir do estado do React. O código não altera
diretamente os elementos do DOM.

## 2. Estrutura de pastas e arquivos

```text
farol/
├── README.md
├── DOCUMENTACAO.md
├── package.json
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── robots.txt
├── src/
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   └── Components/
│       ├── App.jsx
│       ├── Luz.jsx
│       └── Semaforo.jsx
└── build/
    └── arquivos gerados para produção
```

### Arquivos da raiz

- **`package.json`**: descreve o projeto, suas dependências e comandos. `react`
  e `react-dom` fornecem o React; `react-scripts` oferece os comandos do Create
  React App; as bibliotecas `@testing-library/*` são usadas nos testes; e
  `web-vitals` coleta métricas de desempenho.
- **`README.md`**: introdução e instruções rápidas de execução.
- **`DOCUMENTACAO.md`**: este guia mais detalhado.

### Pasta `public/`

Contém arquivos estáticos usados como base pelo navegador e pelo processo de
build.

- **`index.html`**: página HTML inicial. O elemento `<div id="root"></div>` é o
  ponto onde o React monta a aplicação.
- **`manifest.json`**: metadados e ícones usados quando a aplicação é instalada
  como uma aplicação web.
- **`favicon.ico`, `logo192.png` e `logo512.png`**: ícones da aplicação.
- **`robots.txt`**: instruções para rastreadores de mecanismos de busca.

### Pasta `src/`

Contém o código-fonte JavaScript/JSX, os estilos e os testes.

- **`index.js`**: ponto de entrada. Cria a raiz React no elemento `#root` e
  renderiza `<App />` dentro de `<React.StrictMode>`. Também importa os estilos
  globais e inicializa a chamada de métricas.
- **`App.js`**: reexporta o componente principal definido em
  `Components/App.jsx`. Essa pequena camada mantém o caminho de importação
  esperado pelo Create React App (`./App`).
- **`Components/App.jsx`**: coordena a tela, o estado da cor ativa, os controles
  e o texto que descreve o significado do sinal.
- **`Components/Semaforo.jsx`**: representa o conjunto das três luzes e escolhe
  qual delas recebe o estado ativo.
- **`Components/Luz.jsx`**: representa uma luz individual, com seu estilo e
  descrição acessível.
- **`App.css`**: estilos da tela do semáforo, do cartão, das luzes e dos
  botões, incluindo estados de foco e um ajuste para telas estreitas.
- **`index.css`**: regras globais, como fonte, margens e `box-sizing`.
- **`App.test.js`**: verifica o estado inicial, a sequência de avanço e a
  seleção direta de uma cor.
- **`setupTests.js`**: carrega os matchers do `jest-dom` usados para testar
  elementos renderizados.
- **`reportWebVitals.js`**: configura a coleta de métricas de desempenho do
  navegador quando recebe uma função de callback. No estado atual, `index.js`
  chama `reportWebVitals()` sem callback, portanto não envia nem registra
  métricas.
- **`logo.svg`**: imagem SVG padrão do Create React App; não é utilizada pela
  interface atual do semáforo.

### Pasta `build/`

Armazena a versão compilada e otimizada para publicação. Os arquivos JavaScript,
CSS, mapas de código e manifesto são produzidos por `npm run build`; em geral,
não se edita essa pasta manualmente. As alterações devem ser feitas em `src/`
ou `public/` e então compiladas novamente.

## 3. Como a aplicação funciona

### 3.1 Inicialização

O navegador carrega `public/index.html`. Em `src/index.js`, o React encontra
`document.getElementById('root')`, cria a raiz com `ReactDOM.createRoot` e
renderiza o componente principal.

`React.StrictMode` ajuda a identificar padrões problemáticos durante o
desenvolvimento. Ele não é um elemento visual da página.

### 3.2 Estado e significado da cor

Em `Components/App.jsx`, a linha:

```jsx
const [corAtiva, setCorAtiva] = useState('vermelho');
```

cria o estado `corAtiva`, iniciado com `"vermelho"`, e a função `setCorAtiva`
que permite atualizá-lo. O objeto `significados` associa cada cor à mensagem
exibida. Assim, tanto a luz selecionada como o texto dependem do mesmo estado,
evitando que as duas partes da interface fiquem dessincronizadas.

### 3.3 Avançar e selecionar cores

A função `avancarCor` procura a posição atual no array `cores` e escolhe o
próximo elemento. O operador de resto (`%`) faz a sequência voltar ao início
depois da última cor. Os botões de seleção direta chamam `setCorAtiva(cor)`
para escolher a cor correspondente sem percorrer as outras.

Os eventos são associados com `onClick`. Em React, passa-se uma função para
`onClick`; não se chama a função durante a renderização. Por isso, o avanço é
escrito como `onClick={avancarCor}` e a escolha direta usa
`onClick={() => setCorAtiva(cor)}`.

### 3.4 Renderizar as luzes

`Semaforo` recebe `corAtiva` como propriedade e percorre seu array de cores com
`map`. Para cada cor, cria um componente `<Luz />`, passando a cor e um booleano
`ativa` que indica se aquela luz corresponde à cor ativa.

O valor `key={cor}` identifica de forma estável cada item da lista para o React.
As chaves ajudam o React a comparar renderizações e atualizar a lista
corretamente.

`Luz` usa essas propriedades para construir suas classes CSS e seu texto
acessível. Quando `ativa` é verdadeiro, adiciona a classe `is-active`.

### 3.5 Atualização da interface

Ao clicar em um botão, a função de atualização modifica o estado. O React
renderiza novamente os componentes que dependem desse estado. Isso atualiza
automaticamente a luz acesa, o significado e o estado pressionado do botão; não
é necessário procurar elementos HTML ou alterar suas classes manualmente.

## 4. Conceitos React envolvidos

- **Componentes funcionais**: `App`, `Semaforo` e `Luz` são funções que
  descrevem partes da interface. Separar responsabilidades torna o código mais
  simples de compreender e reutilizar.
- **JSX**: sintaxe semelhante a HTML escrita dentro de JavaScript. O JSX de um
  componente é transformado em instruções que o React usa para criar a
  interface.
- **Props (propriedades)**: dados enviados de um componente pai para um filho.
  `App` envia `corAtiva` para `Semaforo`; `Semaforo` envia `cor` e `ativa` para
  cada `Luz`. O filho recebe esses valores e os utiliza para renderizar, em vez
  de alterá-los.
- **Estado com `useState`**: valor que pode mudar durante o uso da página.
  Atualizar o estado com `setCorAtiva` solicita uma nova renderização. O valor
  de estado não deve ser alterado diretamente.
- **Renderização declarativa**: o código descreve como a interface deve ser
  para cada valor de estado. O React cuida das alterações necessárias no DOM.
- **Renderização de listas e `key`**: `map` cria elementos a partir das cores,
  enquanto `key` dá uma identidade estável a cada elemento da lista.
- **Expressões condicionais no JSX**: `corAtiva === cor` calcula se uma luz
  está ativa; o operador ternário em `Luz` decide se inclui a classe CSS
  `is-active`.
- **Eventos**: `onClick` conecta os botões às funções que atualizam o estado.
- **Renderização no DOM**: `createRoot` conecta a árvore de componentes React
  ao elemento `#root` da página HTML.
- **`StrictMode`**: modo de desenvolvimento que ajuda a encontrar certos
  problemas, sem adicionar conteúdo visual à aplicação.

Este projeto não precisa de `useEffect`: não há sincronização com serviços,
temporizadores ou outros sistemas externos. As mudanças apresentadas decorrem
diretamente do estado e das propriedades.

## 5. Acessibilidade

A interface inclui alguns recursos para leitores de tela e navegação por
teclado:

- Cada luz tem `role="img"` e um `aria-label` que comunica a cor e se está acesa
  ou apagada.
- A mensagem de situação usa `role="status"` e `aria-live="polite"` para que
  leitores de tela possam anunciar atualizações sem interromper o usuário.
- O botão da cor selecionada comunica seu estado com `aria-pressed`.
- Os botões são elementos HTML nativos e os estilos destacam o foco visível
  (`:focus-visible`).

## 6. Testes

`src/App.test.js` usa React Testing Library para renderizar a aplicação,
encontrar elementos por seus papéis e nomes acessíveis, clicar nos botões e
verificar o resultado. Os testes cobrem:

1. início com a luz vermelha acesa e a mensagem **PARE**;
2. avanço na ordem vermelho → verde → amarelo → vermelho;
3. seleção direta da luz amarela, sua mensagem e o atributo `aria-pressed`.

Para executar os testes sem iniciar o modo de observação:

```bash
npm test -- --watchAll=false
```

## 7. Comandos úteis

Execute os comandos a partir da pasta `farol/`:

```bash
npm install
npm start
npm test -- --watchAll=false
npm run build
```

- `npm install`: instala as dependências descritas em `package.json`.
- `npm start`: inicia o servidor de desenvolvimento.
- `npm test -- --watchAll=false`: executa os testes uma vez.
- `npm run build`: gera a versão de produção na pasta `build/`.
