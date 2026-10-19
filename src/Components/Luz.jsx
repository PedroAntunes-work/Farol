function Luz({ cor, ativa }) {
  const nomesDasCores = {
    vermelho: 'Vermelha',
    amarelo: 'Amarela',
    verde: 'Verde',
  };

  return (
    <div
      className={`traffic-bulb traffic-bulb--${cor}${ativa ? ' is-active' : ''}`}
      role="img"
      aria-label={`${nomesDasCores[cor]}: ${ativa ? 'acesa' : 'apagada'}`}
    />
  );
}

export default Luz;
