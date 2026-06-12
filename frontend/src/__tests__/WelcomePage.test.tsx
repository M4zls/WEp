import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '../pages/home/index';

const renderWelcomePage = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <WelcomePage />
    </MemoryRouter>,
  );

describe('WelcomePage', () => {
  it('should render the school name', () => {
    renderWelcomePage();
    expect(screen.getByText("Colegio Bernardo O'Higgins")).toBeInTheDocument();
  });

  it('should render both student and teacher sections', () => {
    renderWelcomePage();
    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Docentes')).toBeInTheDocument();
  });

  it('should have a login button', () => {
    renderWelcomePage();
    expect(screen.getByText('Ingresar al Portal')).toBeInTheDocument();
  });

  it('should navigate to /login on button click', async () => {
    const user = userEvent.setup();
    renderWelcomePage();

    await user.click(screen.getByText('Ingresar al Portal'));
  });
});
