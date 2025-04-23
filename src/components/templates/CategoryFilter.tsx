
import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  value,
  onChange,
  categories
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 whitespace-nowrap">
          <Filter className="h-3.5 w-3.5" />
          {value === 'all' ? 'Todas categorias' : value}
          <ChevronDown className="h-3.5 w-3.5 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="all">Todas categorias</DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuRadioItem key={category} value={category}>
              {category}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
