-- SQL para executar no Supabase para configurar usuários

-- 1. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name, role, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger para executar a função quando um usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Criar tabela user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  invitation_token_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security) para user_profiles - SISTEMA COLABORATIVO
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas colaborativas - todos podem ver e criar
CREATE POLICY "Everyone can view profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Everyone can insert profiles" ON public.user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Políticas colaborativas para codes table
ALTER TABLE public.codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view codes" ON public.codes
  FOR SELECT USING (true);

CREATE POLICY "Everyone can insert codes" ON public.codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Everyone can update codes" ON public.codes
  FOR UPDATE USING (true);

CREATE POLICY "Everyone can delete codes" ON public.codes
  FOR DELETE USING (true);

-- 6. Políticas colaborativas para code_options
ALTER TABLE public.code_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view code_options" ON public.code_options
  FOR SELECT USING (true);

CREATE POLICY "Everyone can insert code_options" ON public.code_options
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Everyone can update code_options" ON public.code_options
  FOR UPDATE USING (true);