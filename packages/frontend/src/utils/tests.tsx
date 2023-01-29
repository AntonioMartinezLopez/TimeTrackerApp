import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { theme } from '../theme';
import { ThemeProvider } from 'styled-components';

const AllProviders: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
