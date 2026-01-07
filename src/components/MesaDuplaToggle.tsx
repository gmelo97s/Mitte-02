import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MesaDuplaToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const MesaDuplaToggle = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: MesaDuplaToggleProps) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch
        id="mesa-dupla"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="data-[state=checked]:bg-accent"
      />
      <Label
        htmlFor="mesa-dupla"
        className={cn(
          'text-sm font-medium uppercase tracking-wide cursor-pointer',
          checked ? 'text-accent' : 'text-muted-foreground'
        )}
      >
        Mesa Dupla {checked && '(2 mesas)'}
      </Label>
    </div>
  );
};

export default MesaDuplaToggle;
