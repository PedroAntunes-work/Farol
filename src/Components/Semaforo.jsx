import Luz from './Luz';

// Ordem de exibição das luzes do semáforo, de cima para baixo.
const cores = ['vermelho', 'amarelo', 'verde'];

function Semaforo({ corAtiva }) {
  return (
    <div className="traffic-signal" aria-label="Semáforo">
      {cores.map((cor) => (
        <Luz key={cor} cor={cor} ativa={corAtiva === cor} />
      ))}
    </div>
  );
}

export default Semaforo;
