
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface CodeRecord {
  id: string;
  name: string;
  code: string;
  user_name: string;
  createdAt: Date;
}

interface CodeOptions {
  empresas: { value: string; label: string }[];
  localidades: { value: string; label: string }[];
  servicos: { value: string; label: string }[];
  sistemas: { value: string; label: string }[];
  componentes: { value: string; label: string }[];
  etapas: { value: string; label: string }[];
  disciplinas: { value: string; label: string }[];
  tipoDocumento: { value: string; label: string }[];
}

interface CodeContextType {
  codes: CodeRecord[];
  codeOptions: CodeOptions;
  loading: boolean;
  addCode: (codeData: {
    name: string;
    code: string;
    empresa: string;
    localidade: string;
    servico: string;
    sistema: string;
    componente: string;
    etapa: string;
    disciplina: string;
    tipo_documento: string;
    numero: string;
    data: Date;
    versao: string;
  }) => Promise<void>;
  deleteCode: (codeId: string) => Promise<void>;
  loadCodes: () => Promise<void>;
  loadCodeOptions: () => Promise<void>;
  getNextSequentialNumber: () => Promise<string>;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [codes, setCodes] = useState<CodeRecord[]>([]);
  const [codeOptions, setCodeOptions] = useState<CodeOptions>({
    empresas: [],
    localidades: [],
    servicos: [],
    sistemas: [],
    componentes: [],
    etapas: [],
    disciplinas: [],
    tipoDocumento: []
  });
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const loadCodeOptions = async () => {
    try {
      console.log('Loading code options...');
      const { data, error } = await supabase
        .from('code_options')
        .select('*')
        .eq('is_active', true)
        .order('label');

      if (error) {
        console.error('Error loading code options:', error);
        throw error;
      }

      console.log('Code options data:', data);

      const options: CodeOptions = {
        empresas: [],
        localidades: [],
        servicos: [],
        sistemas: [],
        componentes: [],
        etapas: [],
        disciplinas: [],
        tipoDocumento: []
      };

      data?.forEach(option => {
        const { category, value, label } = option;
        if (category in options) {
          (options as any)[category].push({ value, label });
        }
      });

      console.log('Processed options:', options);
      setCodeOptions(options);
    } catch (error) {
      console.error('Error loading code options:', error);
    }
  };

  const loadCodes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCodes = data?.map(code => ({
        id: code.id,
        name: code.name,
        code: code.code,
        user_name: code.user_name,
        createdAt: new Date(code.created_at)
      })) || [];

      setCodes(formattedCodes);
    } catch (error) {
      console.error('Error loading codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCode = async (codeData: {
    name: string;
    code: string;
    empresa: string;
    localidade: string;
    servico: string;
    sistema: string;
    componente: string;
    etapa: string;
    disciplina: string;
    tipo_documento: string;
    numero: string;
    data: Date;
    versao: string;
  }) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('project_codes')
        .insert({
          user_id: user.id,
          user_name: profile.name,
          name: codeData.name,
          code: codeData.code,
          empresa: codeData.empresa,
          localidade: codeData.localidade,
          servico: codeData.servico,
          sistema: codeData.sistema,
          componente: codeData.componente,
          etapa: codeData.etapa,
          disciplina: codeData.disciplina,
          tipo_documento: codeData.tipo_documento,
          numero: codeData.numero,
          data: codeData.data.toISOString().split('T')[0],
          versao: codeData.versao
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newCode: CodeRecord = {
          id: data.id,
          name: data.name,
          code: data.code,
          user_name: data.user_name,
          createdAt: new Date(data.created_at)
        };
        setCodes(prev => [newCode, ...prev]);
      }
    } catch (error) {
      console.error('Error saving code:', error);
      throw error;
    }
  };

  const getNextSequentialNumber = async (): Promise<string> => {
    try {
      // Buscar todos os códigos para contar quantos existem
      const { data, error } = await supabase
        .from('project_codes')
        .select('id')
        .eq('user_id', user?.id || '');

      if (error) {
        console.error('Error fetching codes count:', error);
        return '0001';
      }

      // O próximo número é sempre a quantidade atual + 1
      const nextNumber = (data?.length || 0) + 1;
      
      // Formatar com zeros à esquerda (4 dígitos)
      return nextNumber.toString().padStart(4, '0');
    } catch (error) {
      console.error('Error generating next number:', error);
      return '0001';
    }
  };

  const deleteCode = async (codeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('project_codes')
        .delete()
        .eq('id', codeId)
        .eq('user_id', user.id); // Garantir que só o usuário pode deletar seus próprios códigos

      if (error) {
        console.error('Error deleting code:', error);
        throw error;
      }

      // Remover da lista local
      setCodes(prev => prev.filter(code => code.id !== codeId));
    } catch (error) {
      console.error('Error deleting code:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadCodeOptions();
  }, []);

  useEffect(() => {
    if (user) {
      loadCodes();
    } else {
      setCodes([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <CodeContext.Provider value={{ 
      codes, 
      codeOptions, 
      loading, 
      addCode, 
      deleteCode,
      loadCodes, 
      loadCodeOptions,
      getNextSequentialNumber
    }}>
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
