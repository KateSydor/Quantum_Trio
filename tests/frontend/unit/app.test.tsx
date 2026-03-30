/**
 * Unit Tests — App Component
 * Тести головного компонента App
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../../UI_prototype/src/App';

describe('App Component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  // UT-APP-001
  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  // UT-APP-002
  test('default route renders Landing page', () => {
    render(<App />);
    expect(screen.getByText(/Готуй розумніше/)).toBeInTheDocument();
  });

  // UT-APP-003
  test('renders RouterProvider wrapper', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.page')).toBeInTheDocument();
  });

  // UT-APP-004
  test('renders navigation bar', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.navbar')).toBeInTheDocument();
  });

  // UT-APP-005
  test('renders footer on landing page', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.footer')).toBeInTheDocument();
  });
});

