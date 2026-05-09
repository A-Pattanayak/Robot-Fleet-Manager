import { render, screen } from '@testing-library/react';
import App from './App';

test('renders fleet dashboard', () => {
  render(<App />);
  const headingElement = screen.getByText(/fleet overview/i);
  expect(headingElement).toBeInTheDocument();
});
