import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

export const Button = styled.button<ThemeProps & { variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-weight: 500;

  ${props => props.variant === 'primary' && `
    background: ${props.$currentTheme === 'dark' ? theme.dark.gradients.primary : theme.light.gradients.primary};
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 191, 165, 0.3);
    }
  `}

  ${props => props.variant === 'secondary' && `
    border: 1px solid ${props.$currentTheme === 'dark' ? theme.dark.secondaryAccent : theme.light.secondaryAccent};
    background: transparent;
    color: ${props.$currentTheme === 'dark' ? theme.dark.secondaryAccent : theme.light.secondaryAccent};
    &:hover {
      background: ${props.$currentTheme === 'dark' ? 'rgba(233, 69, 96, 0.1)' : 'rgba(211, 47, 47, 0.1)'};
      box-shadow: 0 0 12px rgba(233, 69, 96, 0.3);
    }
  `}
`;

export const Card = styled.div<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark' ? theme.dark.surface : theme.light.surface};
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: ${props => props.$currentTheme === 'dark' ? theme.dark.shadows.default : theme.light.shadows.default};
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const Input = styled.input<ThemeProps>`
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.$currentTheme === 'dark' ? theme.dark.tertiaryAccent : theme.light.tertiaryAccent};
  background: ${props => props.$currentTheme === 'dark' ? theme.dark.surface : theme.light.surface};
  color: ${props => props.$currentTheme === 'dark' ? theme.dark.text.primary : theme.light.text.primary};
  transition: all 0.3s ease-in-out;

  &::placeholder {
    color: ${props => props.$currentTheme === 'dark' ? theme.dark.text.tertiary : theme.light.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.$currentTheme === 'dark' ? theme.dark.primaryAccent : theme.light.primaryAccent};
    box-shadow: 0 0 0 2px ${props => props.$currentTheme === 'dark' ? 'rgba(0, 191, 165, 0.2)' : 'rgba(0, 121, 107, 0.2)'};
  }
`;

export const GlassPanel = styled.div<ThemeProps>`
  background: ${props => props.$currentTheme === 'dark' ? 'rgba(42, 42, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.$currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

export const Text = styled.p<ThemeProps & { variant?: 'primary' | 'secondary' | 'tertiary' }>`
  margin: 0;
  color: ${props => {
    const themeColors = props.$currentTheme === 'dark' ? theme.dark.text : theme.light.text;
    switch (props.variant) {
      case 'secondary':
        return themeColors.secondary;
      case 'tertiary':
        return themeColors.tertiary;
      default:
        return themeColors.primary;
    }
  }};
`; 
