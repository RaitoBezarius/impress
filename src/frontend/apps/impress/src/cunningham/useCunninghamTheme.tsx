import merge from 'lodash/merge';
import { create } from 'zustand';

import { tokens } from './cunningham-tokens';

type Tokens = typeof tokens.themes.default & Partial<typeof tokens.themes.dsfr>;
type ColorsTokens = Tokens['theme']['colors'];
type ComponentTokens = Tokens['components'];
type Theme = 'default' | 'dsfr';

interface AuthStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeTokens: () => Partial<Tokens['theme']>;
  colorsTokens: () => Partial<ColorsTokens>;
  componentTokens: () => ComponentTokens;
}

const useCunninghamTheme = create<AuthStore>((set, get) => {
  const currentTheme = () =>
    merge(tokens.themes['default'], tokens.themes[get().theme]) as Tokens;

  return {
    theme: (process.env.NEXT_PUBLIC_THEME as Theme) || 'dsfr',
    themeTokens: () => currentTheme().theme,
    colorsTokens: () => currentTheme().theme.colors,
    componentTokens: () => currentTheme().components,
    setTheme: (theme: Theme) => {
      set({ theme });
    },
  };
});

export default useCunninghamTheme;
