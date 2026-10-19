# Como funciona o semáforo interativo

## 1. Qual componente é responsável pelo estado?

O componente `App`, em `src/Components/App.jsx`, é responsável pelos estados da aplicação. Ele usa o hook `useState` para guardar:

- `corAtiva`: a cor do semáforo que está acesa. O valor inicial é `vermelho`.
- `intervalo`: o intervalo de troca automática, em milissegundos. O valor inicial é `3000`.
- `automatico`: indica se a troca automática está ligada. Começa como `false`.

Manter esses estados em `App` permite que o componente controle as interações e passe a informação necessária aos componentes filhos.

## 2. Como as props são utilizadas?

Props são valores que um componente pai fornece a um componente filho.

1. `App` passa a cor atual a `Semaforo`:

   ```jsx
   <Semaforo corAtiva={corAtiva} />
   ```

2. `Semaforo` percorre as cores e cria uma `Luz` para cada uma. Passa a cor da luz e se ela está ativa:

   ```jsx
   <Luz key={cor} cor={cor} ativa={corAtiva === cor} />
   ```

3. `Luz` usa as props `cor` e `ativa` para escolher suas classes CSS e informar, pelo rótulo acessível, se está acesa ou apagada.

Assim, `App` mantém o estado, enquanto `Semaforo` e `Luz` exibem a interface com base nas props que recebem.

## 3. O que acontece quando o usuário clica no botão?

Ao clicar em **Próxima luz**, o manipulador `avancarCor` chama `setCorAtiva` para passar à próxima cor. A sequência é vermelho → verde → amarelo → vermelho.

Ao clicar em um botão de cor, o manipulador desse botão chama `setCorAtiva(cor)` diretamente, selecionando a cor correspondente.

O botão de troca automática liga ou desliga o ciclo. Quando ligado, um `useEffect` configura `setInterval` para avançar o semáforo no período informado em milissegundos. Quando o modo é desligado ou o intervalo muda, o efeito limpa o temporizador anterior.

## 4. Por que a interface é atualizada automaticamente?

Quando `setCorAtiva`, `setIntervalo` ou `setAutomatico` altera um estado React, o React renderiza novamente o componente que depende dele. Com os novos valores, a aplicação atualiza as props das luzes, a cor ativa, o significado exibido e os elementos associados à cena.

Não é necessário alterar o HTML manualmente: a interface é declarada a partir do estado e o React mantém a tela sincronizada com ele.
