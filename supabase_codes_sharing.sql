-- Script para configurar compartilhamento de códigos no Supabase

-- 1. Verificar estrutura da tabela codes (se não existir, criar)
CREATE TABLE IF NOT EXISTS public.codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  empresa TEXT,
  localidade TEXT,
  servico TEXT,
  sistema TEXT,
  componente TEXT,
  etapa TEXT,
  disciplina TEXT,
  tipo_documento TEXT,
  numero TEXT,
  data DATE,
  versao TEXT,
  contratante TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) para codes - SISTEMA COLABORATIVO
ALTER TABLE public.codes ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Everyone can view codes" ON public.codes;
DROP POLICY IF EXISTS "Everyone can insert codes" ON public.codes;
DROP POLICY IF EXISTS "Everyone can update codes" ON public.codes;
DROP POLICY IF EXISTS "Everyone can delete codes" ON public.codes;

-- Criar políticas colaborativas para codes
CREATE POLICY "Everyone can view codes" ON public.codes
  FOR SELECT USING (true);

CREATE POLICY "Everyone can insert codes" ON public.codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Everyone can update codes" ON public.codes
  FOR UPDATE USING (true);

CREATE POLICY "Everyone can delete codes" ON public.codes
  FOR DELETE USING (true);

-- 3. Garantir que code_options seja colaborativo
ALTER TABLE public.code_options ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Everyone can view code_options" ON public.code_options;
DROP POLICY IF EXISTS "Everyone can insert code_options" ON public.code_options;
DROP POLICY IF EXISTS "Everyone can update code_options" ON public.code_options;

-- Criar políticas colaborativas para code_options
CREATE POLICY "Everyone can view code_options" ON public.code_options
  FOR SELECT USING (true);

CREATE POLICY "Everyone can insert code_options" ON public.code_options
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Everyone can update code_options" ON public.code_options
  FOR UPDATE USING (true);