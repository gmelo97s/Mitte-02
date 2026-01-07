import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (motivo?: string) => void;
  agendamentoNome?: string;
}

const CancelModal = ({ open, onOpenChange, onConfirm, agendamentoNome }: CancelModalProps) => {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    onConfirm(motivo.trim() || undefined);
    setMotivo('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setMotivo('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-destructive bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-widest text-destructive">
            Confirmar Cancelamento
          </DialogTitle>
          <DialogDescription className="text-base">
            Tem certeza que deseja cancelar este agendamento?
            {agendamentoNome && (
              <span className="block mt-2 font-semibold text-foreground">
                {agendamentoNome}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="motivo" className="text-sm font-medium uppercase tracking-wide">
            Motivo do Cancelamento (Opcional)
          </Label>
          <Textarea
            id="motivo"
            placeholder="Digite o motivo do cancelamento..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="input-neon min-h-[100px]"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-muted hover:border-foreground"
          >
            Voltar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelModal;
