
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Template, TemplateType, TemplateCategory } from "@/types";

export const templateSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  content: z.string().min(1, { message: "O conteúdo é obrigatório" }),
  type: z.enum(["text", "image", "video", "audio", "file"] as const),
  category: z.enum(["Atendimento", "Vendas", "Financeiro", "Outros"] as const),
  fileUrl: z.string().optional(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;

export const useTemplateForm = (onSave: (template: TemplateFormValues) => void) => {
  const { toast } = useToast();
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

  const handleSubmit = (values: TemplateFormValues) => {
    onSave(values);
    form.reset();
    toast({
      title: "Template criado",
      description: "O template foi criado com sucesso",
    });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
