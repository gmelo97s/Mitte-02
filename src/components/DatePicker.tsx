import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn, getTodayLocal } from '@/lib/utils';
import { isDiaAberto } from '@/lib/mesa-utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

const DatePicker = ({ value, onChange, disabled = false }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  
  // Converte string para Date
  const date = value ? new Date(value + 'T00:00:00') : undefined;
  
  // Data mínima: hoje
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);
  
  // Data máxima: 1 semana a partir de hoje
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  maxDate.setHours(23, 59, 59, 999);

  // Função para verificar se uma data pode ser selecionada
  const isDateDisabled = (date: Date): boolean => {
    // Não permite datas antes de hoje
    if (date < minDate) return true;
    
    // Não permite datas após 1 semana
    if (date > maxDate) return true;
    
    // Não permite dias fechados
    const dateString = format(date, 'yyyy-MM-dd');
    return !isDiaAberto(dateString);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      onChange(dateString);
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal input-neon",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-card border-2 border-primary z-[9999]" 
          align="start"
          side="bottom"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            initialFocus
            locale={ptBR}
            fromDate={minDate}
            toDate={maxDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
