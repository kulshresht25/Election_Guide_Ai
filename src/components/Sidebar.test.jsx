import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  const mockProps = {
    activePage: 'chat',
    onPageChange: vi.fn(),
    darkMode: true,
    onToggleDark: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
    language: 'en-US',
    onLanguageChange: vi.fn(),
    dictionary: null
  };

  it('renders correctly', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('ElectionGuide')).toBeInTheDocument();
    expect(screen.getByText('chat')).toBeInTheDocument();
  });

  it('calls onPageChange when an item is clicked', () => {
    render(<Sidebar {...mockProps} />);
    fireEvent.click(screen.getByText('dashboard'));
    expect(mockProps.onPageChange).toHaveBeenCalledWith('dashboard');
  });

  it('calls onToggleDark when theme switch is clicked', () => {
    render(<Sidebar {...mockProps} />);
    fireEvent.click(screen.getByText('🌙 Dark Mode'));
    expect(mockProps.onToggleDark).toHaveBeenCalled();
  });
});
