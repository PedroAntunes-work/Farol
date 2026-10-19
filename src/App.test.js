import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach } from '@jest/globals';
import App from './App';

afterEach(() => {
  jest.useRealTimers();
});

function expectOnlyLightOn(activeColor) {
  const colors = ['Vermelha', 'Amarela', 'Verde'];

  colors.forEach((color) => {
    const state = color === activeColor ? 'acesa' : 'apagada';
    expect(
      screen.getByRole('img', { name: `${color}: ${state}` })
    ).toBeInTheDocument();
  });
}

test('starts with the red light active and its meaning displayed', () => {
  render(<App />);

  expectOnlyLightOn('Vermelha');
  expect(screen.getByRole('status')).toHaveTextContent('PARE');
  expect(screen.getByRole('img', { name: 'Carro parado. Pedestre caminhando.' }))
    .toBeInTheDocument();
});

test('advances through red, green, yellow, then red', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /próxima luz/i }));
  expectOnlyLightOn('Verde');
  expect(screen.getByRole('status')).toHaveTextContent('SIGA');

  fireEvent.click(screen.getByRole('button', { name: /próxima luz/i }));
  expectOnlyLightOn('Amarela');
  expect(screen.getByRole('status')).toHaveTextContent('ATENÇÃO');

  fireEvent.click(screen.getByRole('button', { name: /próxima luz/i }));
  expectOnlyLightOn('Vermelha');
  expect(screen.getByRole('status')).toHaveTextContent('PARE');
});

test('selects a color directly and exposes the selected state', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Amarelo' }));

  expectOnlyLightOn('Amarela');
  expect(screen.getByRole('status')).toHaveTextContent('ATENÇÃO');
  expect(screen.getByRole('img', { name: 'Carro parado.' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Amarelo' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );

  fireEvent.click(screen.getByRole('button', { name: 'Verde' }));

  expect(screen.getByRole('img', { name: 'Carro passando.' })).toBeInTheDocument();
  expect(
    screen.queryByRole('img', { name: 'Carro parado. Pedestre caminhando.' })
  ).not.toBeInTheDocument();
});

test('automatically advances according to the selected interval in milliseconds', () => {
  jest.useFakeTimers();
  render(<App />);

  fireEvent.change(screen.getByLabelText(/intervalo da troca automática/i), {
    target: { value: '2' },
  });
  fireEvent.click(screen.getByRole('button', { name: /iniciar automático/i }));

  expectOnlyLightOn('Vermelha');
  act(() => {
    jest.advanceTimersByTime(1999);
  });
  expectOnlyLightOn('Vermelha');

  act(() => {
    jest.advanceTimersByTime(1);
  });
  expectOnlyLightOn('Verde');

  act(() => {
    jest.advanceTimersByTime(2000);
  });
  expectOnlyLightOn('Amarela');
});

test('requires a positive integer interval in milliseconds before starting automatic mode', () => {
  render(<App />);

  const intervalo = screen.getByLabelText(/intervalo da troca automática/i);
  fireEvent.change(intervalo, { target: { value: '0' } });

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Informe um intervalo válido em milissegundos.'
  );
  expect(
    screen.getByRole('button', { name: /iniciar automático/i })
  ).toBeDisabled();
});

test('stops advancing after automatic mode is stopped', () => {
  jest.useFakeTimers();
  render(<App />);

  fireEvent.change(screen.getByLabelText(/intervalo da troca automática/i), {
    target: { value: '1000' },
  });
  fireEvent.click(screen.getByRole('button', { name: /iniciar automático/i }));
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expectOnlyLightOn('Verde');

  fireEvent.click(screen.getByRole('button', { name: /parar automático/i }));
  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expectOnlyLightOn('Verde');
  expect(screen.getByText('Troca automática parada.')).toBeInTheDocument();
});
