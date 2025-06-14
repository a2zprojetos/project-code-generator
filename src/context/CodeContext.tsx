
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface CodeRecord {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
}

interface CodeContextType {
  codes: CodeRecord[];
  addCode: (code: Omit<CodeRecord, 'id' | 'createdAt'>) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [codes, setCodes] = useState<CodeRecord[]>(() => {
    try {
      const localData = localStorage.getItem('generatedCodes');
      if (localData) {
        const parsedData = JSON.parse(localData);
        // Garante que as datas sejam objetos Date
        return parsedData.map((item: CodeRecord) => ({...item, createdAt: new Date(item.createdAt)}));
      }
      return [];
    } catch (error) {
      console.error("Could not parse codes from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('generatedCodes', JSON.stringify(codes));
    } catch (error) {
      console.error("Could not save codes to localStorage", error);
    }
  }, [codes]);

  const addCode = (code: Omit<CodeRecord, 'id' | 'createdAt'>) => {
    const newCode: CodeRecord = { ...code, id: uuidv4(), createdAt: new Date() };
    setCodes(prevCodes => [newCode, ...prevCodes]);
  };

  return (
    <CodeContext.Provider value={{ codes, addCode }}>
      {children}
    </CodeContext.Provider>
  );
};

export const useCodes = () => {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error('useCodes must be used within a CodeProvider');
  }
  return context;
};
