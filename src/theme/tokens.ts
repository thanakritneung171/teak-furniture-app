// Empty Chair design tokens ported from the design system (tokens/colors.css).
export const colors = {
  // brand
  forest900: '#1f3530',
  forest800: '#243f3a',
  forest700: '#2e4b45',
  forest500: '#3f645c',
  forestTint: '#eef4f2',
  gold500: '#d4b46a',
  gold600: '#c4a050',
  gold300: '#e0d985',
  sand100: '#e3ded1',
  sand200: '#d5cfbf',
  bark600: '#8b5e3c',
  white: '#ffffff',
  ink900: '#2c2c2c',
  line100: '#f0ebe3',
  line200: '#e8e2d9',
  line300: '#cdc6ba',
  mute: '#9e958a',

  // semantic aliases
  page: '#e3ded1',
  card: '#ffffff',
  dark: '#1f3530',
  textBody: '#2e4b45',
  textStrong: '#1f3530',
  textMuted: 'rgba(46,75,69,0.6)',
  textOnDark: '#d1d5db',
  textOnDarkStrong: '#ffffff',
  accent: '#d4b46a',
  border: '#e8e2d9',

  // status
  danger: '#ef4444',
  success: '#7cb342',
  warn: '#b45309',
};

// สีประจำ stage (สำหรับ badge/board)
export const stageColor: Record<string, string> = {
  DESIGN: '#9e7b50',
  WAITING: '#b45309',
  ASSEMBLY: '#3f645c',
  PAINT: '#b8762a',
  SHIP: '#2e4b45',
  SHIPPED: '#7cb342',
};

export const font = {
  regular: 'BaiJamjuree-Regular',
  medium: 'BaiJamjuree-Medium',
  semibold: 'BaiJamjuree-SemiBold',
  bold: 'BaiJamjuree-Bold',
  light: 'BaiJamjuree-Light',
};

export const space = (n: number) => n * 4;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };
