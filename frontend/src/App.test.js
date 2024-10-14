import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import YesAndNo from './app/components/common/YesAndNo';

describe('YesAndNo Component', () => {
  const yesMock = jest.fn();
  const noMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls and instances
  });

  beforeEach(() => {
    render(
      <YesAndNo
        heading="Confirm Action"
        para="Are you sure you want to proceed with this action?"
        yes={yesMock}
        no={noMock}
        action="Delete"
        loading={false}
      />
    );
  });

  it('renders the heading and paragraph', () => {
    expect(screen.getByText(/Confirm Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to proceed with this action?/i)).toBeInTheDocument();
  });

  it('calls the no function when the No button is clicked', () => {
    fireEvent.click(screen.getByText(/No/i));
    expect(noMock).toHaveBeenCalledTimes(1);
  });

  it('calls the yes function when the Yes button is clicked', () => {
    fireEvent.click(screen.getByText(/Yes, Delete Project/i));
    expect(yesMock).toHaveBeenCalledTimes(1);
  });

  it('disables the Yes button when loading is true', () => {
    render(
      <YesAndNo
        heading="Confirm Action"
        para="Are you sure you want to proceed with this action?"
        yes={yesMock}
        no={noMock}
        action="Delete"
        loading={true}
      />
    );
    expect(screen.getByRole('button', { name: /Yes, Delete Project/i })).toBeDisabled();
  });

  it('calls the no function when the close button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(noMock).toHaveBeenCalledTimes(1);
  });
});
