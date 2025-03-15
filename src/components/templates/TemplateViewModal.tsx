import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X, MessageSquare, Image, Video, FileText, Mic, Trash2, Edit, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Template, TemplateType, TemplateCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const templateSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  content: z.string().min(1, { message: "O conteúdo é obrigatório" }),
  type: z.enum(["text", "image", "video", "audio", "file"] as const),
  category: z.enum(["Atendimento", "Vendas", "Financeiro", "Outros"] as const),
  fileUrl: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onSave: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

type ModalMode = "view" | "edit" | "delete";

const TemplateViewModal: React.FC<TemplateViewModalProps> = ({
  isOpen,
  onClose,
  template,
  onSave,
  onDelete,
}) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<ModalMode>("view");
  const [fileUploading, setFileUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  useEffect(() => {
    if (template && isOpen) {
      form.reset({
        name: template.name,
        content: template.content,
        type: template.type,
        category: template.category,
        fileUrl: template.fileUrl || "",
      });
    }
  }, [template, isOpen, form]);

  const selectedType = form.watch("type");

  const handleSubmit = (values: TemplateFormValues) => {
    if (!template) return;
    
    const updatedTemplate: Template = {
      ...template,
      name: values.name,
      content: values.content,
      type: values.type,
      category: values.category,
      fileUrl: values.fileUrl,
    };
    
    onSave(updatedTemplate);
    setMode("view");
    toast({
      title: "Template atualizado",
      description: "O template foi atualizado com sucesso",
    });
  };

  const handleDelete = () => {
    if (!template) return;
    onDelete(template.id);
    setShowDeleteConfirm(false);
    onClose();
    toast({
      title: "Template excluído",
      description: "O template foi excluído com sucesso",
      variant: "destructive",
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

  const getIconByType = (type: Template['type']) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'audio':
        return <Mic className="h-5 w-5 text-purple-500" />;
      case 'file':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: Template['type']) => {
    switch (type) {
      case 'text': return 'Texto';
      case 'image': return 'Imagem';
      case 'video': return 'Vídeo';
      case 'audio': return 'Áudio';
      case 'file': return 'Arquivo';
      default: return 'Desconhecido';
    }
  };

  const handleModalClose = () => {
    setMode("view");
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {mode === "view" && template && (
            <div className="flex flex-col h-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gray-100 p-2 rounded-full">
                    {getIconByType(template.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{template.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <span>{getTypeLabel(template.type)}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Conteúdo</h4>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-sm whitespace-pre-wrap">
                      {template.content}
                    </div>
                  </div>
                  
                  {template.type !== "text" && template.fileUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        {template.type === "image" ? "Imagem" : 
                         template.type === "video" ? "Vídeo" : 
                         template.type === "audio" ? "Áudio" : "Arquivo"}
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                        {template.type === "image" && (
                          <img 
                            src={template.fileUrl} 
                            alt={template.name} 
                            className="max-h-48 rounded-md object-contain mx-auto"
                          />
                        )}
                        {template.type === "video" && (
                          <video 
                            src={template.fileUrl} 
                            controls 
                            className="max-h-48 w-full rounded-md"
                          />
                        )}
                        {template.type === "audio" && (
                          <audio 
                            src={template.fileUrl} 
                            controls 
                            className="w-full"
                          />
                        )}
                        {template.type === "file" && (
                          <a 
                            href={template.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            {template.fileName || "Baixar arquivo"}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t p-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setMode("edit")}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          )}

          {mode === "edit" && (
            <div className="flex flex-col h-full">
              <div className="border-b p-4 flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMode("view")}
                  className="mr-2 h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Editar Template</DialogTitle>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do template" {...field} className="focus-visible:ring-vinizap-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              <SelectTrigger className="focus:ring-vinizap-primary">
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
                              className="h-24 resize-none focus-visible:ring-vinizap-primary"
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
                          <div className="flex flex-col gap-2">
                            <Input 
                              type="file" 
                              onChange={handleFileChange}
                              accept={
                                selectedType === "image" ? "image/*" :
                                selectedType === "video" ? "video/*" :
                                selectedType === "audio" ? "audio/*" : 
                                "*"
                              }
                              className="focus-visible:ring-vinizap-primary"
                            />
                            {fileUploading ? (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="animate-spin h-4 w-4 border-2 border-vinizap-primary border-t-transparent rounded-full"></div>
                                Carregando arquivo...
                              </div>
                            ) : form.watch("fileUrl") ? (
                              <div className="text-sm text-green-600 flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                Arquivo carregado com sucesso
                              </div>
                            ) : null}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  </form>
                </Form>
              </div>
              
              <div className="border-t p-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setMode("view")}>
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  onClick={form.handleSubmit(handleSubmit)}
                  className="bg-vinizap-primary hover:bg-vinizap-primary/90"
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TemplateViewModal;
