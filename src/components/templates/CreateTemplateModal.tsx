import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, X, MessageSquare, Image, Video, FileText, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateType, TemplateCategory } from "@/types";
import { cn } from "@/lib/utils";

const templateSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  content: z.string().min(1, { message: "O conteúdo é obrigatório" }),
  type: z.enum(["text", "image", "video", "audio", "file"] as const),
  category: z.enum(["Atendimento", "Vendas", "Financeiro", "Outros"] as const),
  fileUrl: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: TemplateFormValues) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { toast } = useToast();
  const [fileUploading, setFileUploading] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      content: "",
      type: "text",
      category: "Atendimento",
      fileUrl: "",
    },
  });

  const selectedType = form.watch("type");

  const handleSubmit = (values: TemplateFormValues) => {
    onSave(values);
    form.reset();
    toast({
      title: "Template criado",
      description: "O template foi criado com sucesso",
    });
  };

  const typeOptions: { value: TemplateType; label: string; icon: React.ReactNode }[] = [
    { value: "text", label: "Texto", icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
    { value: "image", label: "Imagem", icon: <Image className="h-4 w-4 text-green-500" /> },
    { value: "video", label: "Vídeo", icon: <Video className="h-4 w-4 text-red-500" /> },
    { value: "audio", label: "Áudio", icon: <Mic className="h-4 w-4 text-purple-500" /> },
    { value: "file", label: "Arquivo", icon: <FileText className="h-4 w-4 text-orange-500" /> },
  ];

  const categoryOptions: TemplateCategory[] = [
    "Atendimento",
    "Vendas",
    "Financeiro",
    "Outros",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Normally, you would upload the file to a storage service here
    setFileUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setFileUploading(false);
      form.setValue("fileUrl", URL.createObjectURL(file));
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso`,
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[500px]"
        aria-describedby="template-modal-description"
      >
        <DialogHeader>
          <DialogTitle>Criar novo template</DialogTitle>
          <DialogDescription id="template-modal-description">
            Configure um template para usar em suas mensagens
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do template" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite o conteúdo do template" 
                      className="h-24 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType !== "text" && (
              <FormItem>
                <FormLabel>{selectedType === "image" ? "Imagem" : 
                            selectedType === "video" ? "Vídeo" : 
                            selectedType === "audio" ? "Áudio" : "Arquivo"}</FormLabel>
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
            )}

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;
