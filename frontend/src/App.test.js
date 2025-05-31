import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PellSolverApp from './App';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('displays error for negative input', async () => {
  render(<PellSolverApp />);
  fireEvent.change(screen.getByPlaceholderText('Enter n'), {
    target: { value: '-1' },
  });
  fireEvent.click(screen.getByText(/Calculate/i));
  expect(await screen.findByText(/positive squarefree integer/i)).toBeInTheDocument();
});

test('displays error for non-squarefree input (e.g. 12)', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({ success: 'NotSquarefree' })
  });
  render(<PellSolverApp />);
  fireEvent.change(screen.getByPlaceholderText('Enter n'), {
    target: { value: '12' },
  });
  fireEvent.click(screen.getByText(/Calculate/i));
  expect(await screen.findByText(/positive squarefree integer/i)).toBeInTheDocument();
});

test('calculation steps are not shown when solver fails', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({ success: 'NotSquarefree' })
  });
  render(<PellSolverApp />);
  fireEvent.change(screen.getByPlaceholderText('Enter n'), {
    target: { value: '12' },
  });
  fireEvent.click(screen.getByText(/Calculate/i));
  await waitFor(() => {
    expect(screen.queryByText(/Show Calculation Steps/)).not.toBeInTheDocument();
  });
});
