export const theme = {
  dark: {
    background: '#1A1A1A',
    surface: '#2D2D2D',
    elevatedSurface: '#3A3A3A',
    primaryAccent: '#00BFA5',
    secondaryAccent: '#E94560',
    tertiaryAccent: '#8A8A8A',
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      tertiary: '#666666'
    },
    overlay: 'rgba(26,26,26,0.8)',
    gradients: {
      primary: 'linear-gradient(135deg, #00BFA5 0%, #00E5FF 100%)'
    },
    shadows: {
      default: '0 4px 12px rgba(0,0,0,0.25)'
    }
  },
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    elevatedSurface: '#F0F0F0',
    primaryAccent: '#00796B',
    secondaryAccent: '#D32F2F',
    tertiaryAccent: '#757575',
    text: {
      primary: '#212121',
      secondary: '#616161',
      tertiary: '#9E9E9E'
    },
    overlay: 'rgba(255,255,255,0.8)',
    gradients: {
      primary: 'linear-gradient(135deg, #00796B 0%, #009688 100%)'
    },
    shadows: {
      default: '0 4px 12px rgba(0,0,0,0.1)'
    }
  }
};

export const commonStyles = {
  typography: {
    headlineShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  glassmorphism: {
    dark: {
      background: 'rgba(42, 42, 42, 0.6)',
      backdropFilter: 'blur(12px)'
    },
    light: {
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)'
    }
  },
  transitions: {
    default: 'all 0.3s ease-in-out'
  }
}; 