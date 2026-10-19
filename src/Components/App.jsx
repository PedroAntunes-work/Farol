import { useEffect, useState } from 'react';
import Semaforo from './Semaforo';
import '../App.css';

const cores = ['vermelho', 'verde', 'amarelo'];
const intervaloMaximo = 100000;

const significados = {
  vermelho: 'PARE',
  amarelo: 'ATENÇÃO',
  verde: 'SIGA',
};

function proximaCor(corAtual) {
  const indiceAtual = cores.indexOf(corAtual);
  return cores[(indiceAtual + 1) % cores.length];
}

function App() {
  const [corAtiva, setCorAtiva] = useState('vermelho');
  const [intervalo, setIntervalo] = useState('3000');
  const [automatico, setAutomatico] = useState(false);
  const intervaloEmMilissegundos = Number(intervalo);
  const intervaloValido =
    /^\d+$/.test(intervalo) &&
    Number.isSafeInteger(intervaloEmMilissegundos) &&
    intervaloEmMilissegundos > 0 &&
    intervaloEmMilissegundos <= intervaloMaximo;

  useEffect(() => {
    if (!automatico || !intervaloValido) {
      return undefined;
    }

    const temporizador = window.setInterval(() => {
      setCorAtiva((corAtual) => proximaCor(corAtual));
    }, intervaloEmMilissegundos);

    return () => window.clearInterval(temporizador);
  }, [automatico, intervaloEmMilissegundos, intervaloValido]);

  function avancarCor() {
    setCorAtiva((corAtual) => proximaCor(corAtual));
  }

  return (
    <main className="traffic-page">
      <section className="traffic-card" aria-labelledby="page-title">
        <p className="traffic-eyebrow">EXERCÍCIO REACT</p>
        <h1 id="page-title">Semáforo interativo</h1>
        <p className="traffic-intro">
          Escolha uma cor ou avance para a próxima luz.
        </p>

        <Semaforo corAtiva={corAtiva} />

        <div
          className={`traffic-scene traffic-scene--${corAtiva}`}
          role="img"
          aria-label={
            corAtiva === 'verde'
              ? 'Carro passando.'
              : `Carro parado.${
                  corAtiva === 'vermelho' ? ' Pedestre caminhando.' : ''
                }`
          }
        >
          <span className="traffic-car" aria-hidden="true">
            🚗
          </span>
          {corAtiva === 'vermelho' && (
            <span className="traffic-pedestrian" aria-hidden="true">
              🚶
            </span>
          )}
          <span className="traffic-road" aria-hidden="true" />
        </div>

        <p className="traffic-status" role="status" aria-live="polite">
          {significados[corAtiva]}
        </p>

        <div className="traffic-controls" aria-label="Controles do semáforo">
          <button
            className="advance-button"
            type="button"
            onClick={avancarCor}
          >
            Próxima luz
          </button>

          <div className="color-buttons" aria-label="Selecionar uma cor">
            {cores.map((cor) => (
              <button
                key={cor}
                className={`color-button color-button--${cor}`}
                type="button"
                aria-pressed={corAtiva === cor}
                onClick={() => setCorAtiva(cor)}
              >
                {cor[0].toUpperCase() + cor.slice(1)}
              </button>
            ))}
          </div>

          <div className="automatic-controls">
            <label className="interval-label" htmlFor="intervalo-semaforo">
              Intervalo da troca automática (milissegundos)
            </label>
            <input
              id="intervalo-semaforo"
              type="number"
              min="1"
              max={intervaloMaximo}
              step="1"
              inputMode="numeric"
              aria-describedby="intervalo-ajuda"
              aria-invalid={!intervaloValido}
              value={intervalo}
              onChange={(event) => setIntervalo(event.target.value)}
            />
            <p id="intervalo-ajuda" className="interval-help">
              Digite um número inteiro entre 1 e {intervaloMaximo} milissegundos.
            </p>
            {!intervaloValido && (
              <p className="interval-error" role="alert">
                Informe um intervalo válido em milissegundos.
              </p>
            )}
            <button
              className="automatic-button"
              type="button"
              aria-pressed={automatico}
              disabled={!automatico && !intervaloValido}
              onClick={() => setAutomatico((ativo) => !ativo)}
            >
              {automatico ? 'Parar automático' : 'Iniciar automático'}
            </button>
            <p className="automatic-status" aria-live="polite">
              {automatico && intervaloValido
                ? `Troca automática a cada ${intervaloEmMilissegundos} ${
                    intervaloEmMilissegundos === 1
                      ? 'milissegundo'
                      : 'milissegundos'
                  }.`
                : automatico
                  ? 'Ajuste o intervalo para continuar a troca automática.'
                  : 'Troca automática parada.'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
