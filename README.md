# Semáforo interativo

Aplicação de demonstração em React com três luzes, troca manual ou automática das cores e indicação do significado de cada sinal.

## Executar

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm start
```

Abra [http://localhost:3000](http://localhost:3000). Para executar os testes:

```bash
npm test -- --watchAll=false
```

Para gerar a versão de produção:

```bash
npm run build
```

## Como funciona

- `src/Components/App.jsx` guarda a cor ativa com `useState`, inicia em vermelho e controla o avanço e a seleção direta. `src/App.js` apenas reexporta esse componente para a entrada do Create React App.
- `Semaforo` recebe a cor ativa por `props` e cria uma `Luz` para cada cor.
- `Luz` também recebe props e apresenta a aparência e o rótulo acessível de luz acesa ou apagada.
- O botão **Próxima luz** segue a sequência vermelho → verde → amarelo → vermelho. Os outros botões permitem selecionar uma cor diretamente.
- A ilustração ao lado do semáforo mostra o carro passando no verde e parado no vermelho ou amarelo; no vermelho, também mostra um pedestre caminhando.
- O modo automático começa parado. Digite um número inteiro de milissegundos entre 1 e 2.147.483.647 e use **Iniciar automático**/**Parar automático** para controlar o ciclo.
- A mensagem muda para **PARE**, **SIGA** ou **ATENÇÃO** conforme a luz selecionada.

O estado React atualiza a interface automaticamente após cada interação. O `useEffect` configura o temporizador quando o modo automático está ativo e o limpa ao parar ou ao alterar o intervalo, evitando temporizadores duplicados. Não há manipulação direta do DOM.
