
import React from "react";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { TemplateCategory } from "@/types";
import { useTemplateForm } from "@/hooks/use-template-form";
import { TemplateTypeSelector } from "./template-form/TemplateTypeSelector";
import { TemplateFileUpload } from "./template-form/TemplateFileUpload";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { form, handleSubmit } = useTemplateForm(onSave);
  const selectedType = form.watch("type");
  const categoryOptions: TemplateCategory[] = ["Atendimento", "Vendas", "Financeiro", "Outros"];

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
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <TemplateTypeSelector control={form.control} />

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
              <TemplateFileUpload
                selectedType={selectedType}
                onFileUpload={(fileUrl) => form.setValue("fileUrl", fileUrl)}
              />
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
