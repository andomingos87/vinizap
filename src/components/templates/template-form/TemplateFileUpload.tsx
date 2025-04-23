
import React from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TemplateType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TemplateFileUploadProps {
  selectedType: TemplateType;
  onFileUpload: (fileUrl: string) => void;
}

export const TemplateFileUpload: React.FC<TemplateFileUploadProps> = ({
  selectedType,
  onFileUpload,
}) => {
  const { toast } = useToast();
  const [fileUploading, setFileUploading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setFileUploading(false);
      onFileUpload(URL.createObjectURL(file));
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso`,
      });
    }, 1500);
  };

  return (
    <FormItem>
      <FormLabel>
        {selectedType === "image" ? "Imagem" : 
         selectedType === "video" ? "Vídeo" : 
         selectedType === "audio" ? "Áudio" : "Arquivo"}
      </FormLabel>
      <FormControl>
        <div className="flex items-center gap-2">
          <Input 
            type="file" 
            onChange={handleFileChange}
            accept={
              selectedType === "image" ? "image/*" :
              selectedType === "video" ? "video/*" :
              selectedType === "audio" ? "audio/*" : 
              "*"
            }
          />
          {fileUploading && <span className="text-sm text-gray-500">Carregando...</span>}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
