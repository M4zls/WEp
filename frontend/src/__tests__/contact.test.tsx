/**
 * Tests for ContactoPage component.
 *
 * @module contacto.test.tsx
 */

import { render, screen } from '@testing-library/react';
import ContactPage from '../pages/contact/index';

describe('ContactPage', () => {
  /**
   * Should render the main heading.
   */
  it('should render heading', () => {
    render(<ContactPage />);
    expect(screen.getByText('Contactos')).toBeInTheDocument();
  });

  /**
   * Should render the school name.
   */
  it('should render school name', () => {
    render(<ContactPage />);
    expect(screen.getByText('Colegio Bernando O\'Higgins')).toBeInTheDocument();
  });

  /**
   * Should render school info such as address and schedule.
   */
  it('should render school info', () => {
    render(<ContactPage />);
    expect(screen.getByText(/Av\. Libertador Bernardo O'Higgins 1234/)).toBeInTheDocument();
    expect(screen.getByText(/08:00 - 17:00/)).toBeInTheDocument();
  });

  /**
   * Should render emergency contact numbers.
   */
  it('should render emergency contacts', () => {
    render(<ContactPage />);
    expect(screen.getByText('133')).toBeInTheDocument();
    expect(screen.getByText('131')).toBeInTheDocument();
    expect(screen.getByText('132')).toBeInTheDocument();
    expect(screen.getByText('134')).toBeInTheDocument();
  });

  /**
   * Should render the inspectors section with names.
   */
  it('should render inspectors section', () => {
    render(<ContactPage />);
    expect(screen.getByText('Roberto Muñoz')).toBeInTheDocument();
    expect(screen.getByText('Carolina Rivas')).toBeInTheDocument();
    expect(screen.getByText('Felipe Soto')).toBeInTheDocument();
  });

  /**
   * Should render the secretaries section with names.
   */
  it('should render secretaries section', () => {
    render(<ContactPage />);
    expect(screen.getByText('María José Torres')).toBeInTheDocument();
    expect(screen.getByText('Patricia Vega')).toBeInTheDocument();
  });

  /**
   * Should render email links for inspectors and secretaries.
   */
  it('should render email links', () => {
    render(<ContactPage />);
    expect(screen.getByText('roberto.munoz@colegiobo.cl')).toBeInTheDocument();
    expect(screen.getByText('maria.torres@colegiobo.cl')).toBeInTheDocument();
  });
});
