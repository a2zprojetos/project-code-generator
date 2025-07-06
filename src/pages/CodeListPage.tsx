import { useState } from 'react';
import { useCodes, type CodeRecord } from '@/context/CodeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck, BookText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateLegendItems } from '@/lib/codeUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const LegendDialogContent = ({ code }: { code: string }) => (
  <DialogContent className="sm:max-w-[625px]">
    <DialogHeader>
      <DialogTitle>Legenda do Código</DialogTitle>
    </DialogHeader>
    <p className="font-mono text-sm pt-2 break-all">{code}</p>
    <div className="space-y-1 text-sm pt-4">
      {generateLegendItems(code).map((item, index) => (
        <p key={index}>
          <span className="font-semibold">{item.title}:</span> {item.text}
        </p>
      ))}
    </div>
  </DialogContent>
);

export function CodeListPage() {
  const { codes } = useCodes();
  const { toast } = useToast();
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  const handleCopy = (textToCopy: string, id: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied({ [id]: true });
    toast({
      title: "Copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(prevState => ({ ...prevState, [id]: false })), 2000);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Códigos Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {codes.length > 0 ? (
                codes.map((record: CodeRecord) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight break-words">{record.name}</CardTitle>
                          <p className="text-sm text-muted-foreground pt-1">
                            {record.createdAt.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center shrink-0 ml-2 space-x-1">
                           <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <BookText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <LegendDialogContent code={record.code} />
                          </Dialog>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(record.code, record.id)}>
                            {copied[record.id] ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <code className="font-mono text-sm break-all">{record.code}</code>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="h-24 text-center flex items-center justify-center">
                  Nenhum código gerado ainda.
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Legenda</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.length > 0 ? (
                    codes.map((record: CodeRecord) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell><code className="font-mono text-sm">{record.code}</code></TableCell>
                        <TableCell>{record.createdAt.toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <BookText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <LegendDialogContent code={record.code} />
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(record.code, record.id)}>
                            {copied[record.id] ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum código gerado ainda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
