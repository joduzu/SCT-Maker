import React, { createContext, useContext, useMemo } from 'react';
import { useLayoutEditor } from '../hooks/useLayoutEditor';
import { HospitalLayout } from '../types/layout.types';
import { EMPTY_LAYOUT } from '../constants/defaultLayouts';

interface LayoutContextValue extends ReturnType<typeof useLayoutEditor> {
  layoutState: HospitalLayout;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const editor = useLayoutEditor(EMPTY_LAYOUT);

  const value = useMemo<LayoutContextValue>(
    () => ({
      ...editor,
      layoutState: editor.layout
    }),
    [editor]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayoutContext = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within LayoutProvider');
  }
  return context;
};
