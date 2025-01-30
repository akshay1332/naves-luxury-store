import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../styles/theme';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

const ToggleButton = styled.button<ThemeProps>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background: ${props => props.$currentTheme === 'dark' ? theme.dark.elevatedSurface : theme.light.elevatedSurface};
  color: ${props => props.$currentTheme === 'dark' ? theme.dark.text.primary : theme.light.text.primary};
  box-shadow: ${props => props.$currentTheme === 'dark' ? theme.dark.shadows.default : theme.light.shadows.default};

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const ThemeToggle: React.FC = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();

  return (
    <ToggleButton $currentTheme={currentTheme} onClick={toggleTheme}>
      {currentTheme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </ToggleButton>
  );
}; 
