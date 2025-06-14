
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Copy, CopyCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

import {
  empresas,
  localidades,
  servicos,
  sistemas,
  componentes,
  etapas,
  disciplinas,
  tipoDocumento
} from '@/data/semiCodes';

interface FormState {
  empresa: string;
  localidade: string;
  servico: string;
  sistema: string;
  componente: string;
  etapa: string;
  disciplina: string;
  tipoDoc: string;
  numero: string;
  data: Date | undefined;
  versao: string;
}

export function CodeGenerator() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>({
    empresa: empresas[0].value,
    localidade: localidades[0].value,
    servico: servicos[0].value,
    sistema: sistemas[0].value,
    componente: componentes[0].value,
    etapa: etapas[0].value,
    disciplina: disciplinas[0].value,
    tipoDoc: tipoDocumento[0].value,
    numero: '0001',
    data: new Date(),
    versao: 'R0',
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof FormState, value: string | Date | undefined) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  const handleGenerateCode = () => {
    const { empresa, localidade, servico, sistema, componente, etapa, disciplina, tipoDoc, numero, data, versao } = formState;

    if (!data) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data.",
        variant: "destructive",
      });
      return;
    }

    const numeroFormatado = numero.padStart(4, '0');
    const dataFormatada = format(data, 'ddMMyy');

    const code = `${empresa}-${localidade}-${servico}-${sistema}-${componente}-${etapa}-${disciplina}-${tipoDoc}-${numeroFormatado}-${dataFormatada}-${versao}`;
    setGeneratedCode(code);
    setHistory(prev => [code, ...prev].slice(0, 10));
  };
  
  const handleCopy = (textToCopy: string, id: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied({ [id]: true });
    toast({
      title: "Copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(prevState => ({ ...prevState, [id]: false })), 2000);
  };

  const renderSelect = (id: keyof FormState, label: string, options: { value: string, label: string }[]) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={formState[id] as string} onValueChange={(value) => handleInputChange(id, value)}>
        <SelectTrigger id={id}><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Gerador de Código de Projeto</h1>
        <p className="text-muted-foreground">Preencha os campos para gerar um código único.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Parâmetros do Código</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {renderSelect('empresa', 'Empresa', empresas)}
            {renderSelect('localidade', 'Cidade/Estado', localidades)}
            {renderSelect('servico', 'Serviço', servicos)}
            {renderSelect('sistema', 'Sistema/Categoria', sistemas)}
            {renderSelect('componente', 'Componente', componentes)}
            {renderSelect('etapa', 'Etapa', etapas)}
            {renderSelect('disciplina', 'Disciplina', disciplinas)}
            {renderSelect('tipoDoc', 'Tipo de Documento', tipoDocumento)}
            <div className="space-y-2">
              <Label htmlFor="numero">Número Sequencial (4 dígitos)</Label>
              <Input id="numero" type="number" value={formState.numero} onChange={(e) => handleInputChange('numero', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formState.data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.data ? format(formState.data, "dd/MM/yyyy") : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formState.data}
                    onSelect={(date) => handleInputChange('data', date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="versao">Versão</Label>
              <Input id="versao" value={formState.versao} onChange={(e) => handleInputChange('versao', e.target.value)} />
            </div>
          </div>
          <Button onClick={handleGenerateCode} className="w-full">Gerar Código</Button>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card>
          <CardHeader><CardTitle>Código Gerado</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between bg-muted p-4 rounded-md">
            <code className="text-lg font-mono break-all">{generatedCode}</code>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(generatedCode, 'main')}>
              {copied['main'] ? <CopyCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Histórico (últimos 10)</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {history.map((code, index) => (
                <li key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                  <span className="font-mono text-sm break-all">{code}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(code, `history-${index}`)}>
                     {copied[`history-${index}`] ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
