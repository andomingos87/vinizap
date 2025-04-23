
import React from 'react';
import { MessageSquare, Image, Video, Mic, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TemplateType } from '@/types';

const typeOptions: { value: TemplateType; label: string; icon: React.ReactNode }[] = [
  { value: "text", label: "Texto", icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
  { value: "image", label: "Imagem", icon: <Image className="h-4 w-4 text-green-500" /> },
  { value: "video", label: "Vídeo", icon: <Video className="h-4 w-4 text-red-500" /> },
  { value: "audio", label: "Áudio", icon: <Mic className="h-4 w-4 text-purple-500" /> },
  { value: "file", label: "Arquivo", icon: <FileText className="h-4 w-4 text-orange-500" /> },
];

interface TemplateTypeSelectorProps {
  control: any;
}

export const TemplateTypeSelector: React.FC<TemplateTypeSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <div className="grid grid-cols-5 gap-2">
            {typeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3 px-2 gap-1",
                  field.value === option.value && "border-vinizap-primary text-vinizap-primary"
                )}
                onClick={() => field.onChange(option.value)}
              >
                {option.icon}
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
