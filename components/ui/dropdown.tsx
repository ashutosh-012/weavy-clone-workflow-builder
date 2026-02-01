import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-zinc-800',
                  value === option.value
                    ? 'bg-zinc-800 text-zinc-50'
                    : 'text-zinc-400'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
