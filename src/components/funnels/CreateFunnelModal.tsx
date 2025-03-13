
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, X, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Funnel, FunnelStep, StepCondition } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const funnelStepSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "O nome da etapa deve ter pelo menos 2 caracteres" }),
  templateId: z.string().min(1, { message: "Selecione um template" }),
  delay: z.coerce.number().min(0, { message: "O atraso deve ser maior ou igual a 0" }),
  condition: z.enum(["none", "response", "click", "custom"] as const),
  customCondition: z.string().optional(),
});

const funnelSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(1, { message: "A descrição é obrigatória" }),
  steps: z.array(funnelStepSchema).min(1, { message: "Adicione pelo menos uma etapa" }),
});

type FunnelFormValues = z.infer<typeof funnelSchema>;

const defaultStep: FunnelStep = {
  id: "",
  name: "",
  templateId: "",
  delay: 0,
  condition: "none",
};

interface CreateFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (funnel: Omit<Funnel, "id">) => void;
  templates: { id: string; name: string }[];
}

const CreateFunnelModal: React.FC<CreateFunnelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  templates,
}) => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<FunnelStep[]>([{ ...defaultStep, id: crypto.randomUUID() }]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(0);

  const form = useForm<FunnelFormValues>({
    resolver: zodResolver(funnelSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: steps,
    },
  });

  const handleAddStep = () => {
    const newStep = { ...defaultStep, id: crypto.randomUUID() };
    setSteps([...steps, newStep]);
    form.setValue("steps", [...steps, newStep]);
    setCurrentStepIndex(steps.length);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length === 1) {
      toast({
        title: "Erro",
        description: "Um funil deve ter pelo menos uma etapa",
        variant: "destructive",
      });
      return;
    }

    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
    form.setValue("steps", newSteps);
    
    if (currentStepIndex === index) {
      setCurrentStepIndex(index === 0 ? 0 : index - 1);
    } else if (currentStepIndex && currentStepIndex > index) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  const handleStepChange = (field: keyof FunnelStep, value: any) => {
    if (currentStepIndex === null) return;
    
    const newSteps = [...steps];
    newSteps[currentStepIndex] = {
      ...newSteps[currentStepIndex],
      [field]: value,
    };
    
    setSteps(newSteps);
    form.setValue("steps", newSteps);
  };

  const handleSubmit = (values: FunnelFormValues) => {
    onSave({
      name: values.name,
      description: values.description,
      steps: steps,
    });
    
    // Reset form
    setSteps([{ ...defaultStep, id: crypto.randomUUID() }]);
    setCurrentStepIndex(0);
    form.reset({
      name: "",
      description: "",
      steps: [{ ...defaultStep, id: crypto.randomUUID() }],
    });
    
    toast({
      title: "Funil criado",
      description: "O funil foi criado com sucesso",
    });
  };

  const conditionOptions: { value: StepCondition; label: string }[] = [
    { value: "none", label: "Sem condição" },
    { value: "response", label: "Resposta do cliente" },
    { value: "click", label: "Clique em link" },
    { value: "custom", label: "Condição personalizada" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar novo funil</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do funil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição breve do funil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Etapas</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddStep}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 border rounded-md p-2 max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Etapa</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {steps.map((step, index) => (
                        <TableRow 
                          key={step.id} 
                          className={currentStepIndex === index ? "bg-muted" : ""}
                          onClick={() => handleSelectStep(index)}
                        >
                          <TableCell>
                            {step.name || `Etapa ${index + 1}`}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveStep(index);
                              }}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {currentStepIndex !== null && (
                  <div className="md:col-span-2 border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-4">
                      Configurar Etapa {currentStepIndex + 1}
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <FormLabel htmlFor="step-name">Nome da Etapa</FormLabel>
                          <Input
                            id="step-name"
                            value={steps[currentStepIndex].name}
                            onChange={(e) => handleStepChange("name", e.target.value)}
                            placeholder="Nome da etapa"
                          />
                        </div>

                        <div>
                          <FormLabel htmlFor="step-template">Template</FormLabel>
                          <Select
                            value={steps[currentStepIndex].templateId}
                            onValueChange={(value) => handleStepChange("templateId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <FormLabel htmlFor="step-delay">Atraso (minutos)</FormLabel>
                          <Input
                            id="step-delay"
                            type="number"
                            min="0"
                            value={steps[currentStepIndex].delay}
                            onChange={(e) => handleStepChange("delay", parseInt(e.target.value, 10))}
                          />
                        </div>

                        <div>
                          <FormLabel htmlFor="step-condition">Condição para próxima etapa</FormLabel>
                          <Select
                            value={steps[currentStepIndex].condition}
                            onValueChange={(value: StepCondition) => handleStepChange("condition", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {steps[currentStepIndex].condition === "custom" && (
                          <div>
                            <FormLabel htmlFor="step-custom-condition">Condição Personalizada</FormLabel>
                            <Textarea
                              id="step-custom-condition"
                              value={steps[currentStepIndex].customCondition || ""}
                              onChange={(e) => handleStepChange("customCondition", e.target.value)}
                              placeholder="Descreva a condição personalizada"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

export default CreateFunnelModal;
