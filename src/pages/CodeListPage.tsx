
import { useState } from 'react';
import { useCodes } from '@/context/CodeContext';
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


export function CodeListPage() {
  const { codes } = useCodes();
  const { toast } = useToast();
  const [copied, setCopied] = useState<Record<string, boolean>>({});

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
                  codes.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell><code className="font-mono text-sm">{record.code}</code></TableCell>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <BookText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>Legenda do Código</DialogTitle>
                            </DialogHeader>
                            <p className="font-mono text-sm pt-2">{record.code}</p>
                            <div className="space-y-1 text-sm pt-4">
                              {generateLegendItems(record.code).map((item, index) => (
                                <p key={index}>
                                  <span className="font-semibold">{item.title}:</span> {item.text}
                                </p>
                              ))}
                            </div>
                          </DialogContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
