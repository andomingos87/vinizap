import React, { useEffect } from "react";
import { Edit, ArrowRight, Clock, MessageSquare, MousePointerClick } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FunnelStep, StepCondition } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface StepConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: FunnelStep;
  stepIndex: number;
  templates: { id: string; name: string }[];
  onStepChange: (field: keyof FunnelStep, value: any) => void;
  isViewOnly?: boolean;
}

const conditionOptions: { value: StepCondition; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: "none", 
    label: "Sem condição", 
    icon: <ArrowRight className="h-5 w-5 text-gray-500" />,
    description: "Avança automaticamente após o atraso"
  },
  { 
    value: "response", 
    label: "Resposta", 
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    description: "Avança quando o cliente responder"
  },
  { 
    value: "click", 
    label: "Clique", 
    icon: <MousePointerClick className="h-5 w-5 text-green-500" />,
    description: "Avança quando clicar em um link"
  },
  { 
    value: "custom", 
    label: "Personalizado", 
    icon: <Edit className="h-5 w-5 text-orange-500" />,
    description: "Condição personalizada"
  },
];

// Schema para validação do formulário
const stepFormSchema = z.object({
  name: z.string().min(1, "O nome da etapa é obrigatório"),
  templateId: z.string().min(1, "Selecione um template"),
  delay: z.coerce.number().min(0, "O atraso deve ser maior ou igual a 0"),
  condition: z.enum(["none", "response", "click", "custom"] as const),
  customCondition: z.string().optional(),
});

type StepFormValues = z.infer<typeof stepFormSchema>;

const StepConfigModal: React.FC<StepConfigModalProps> = ({
  isOpen,
  onClose,
  step,
  stepIndex,
  templates,
  onStepChange,
  isViewOnly = false,
}) => {
  // Configurar o formulário com react-hook-form
  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      name: step.name || "",
      templateId: step.templateId || "",
      delay: step.delay || 0,
      condition: step.condition || "none",
      customCondition: step.customCondition || "",
    }
  });

  // Atualizar os valores do formulário quando o step mudar
  useEffect(() => {
    form.reset({
      name: step.name || "",
      templateId: step.templateId || "",
      delay: step.delay || 0,
      condition: step.condition || "none",
      customCondition: step.customCondition || "",
    });
  }, [step, form]);

  // Função para lidar com as mudanças nos campos
  const handleFieldChange = (field: keyof FunnelStep, value: any) => {
    onStepChange(field, value);
    // Usamos setValue apenas para campos que são parte do formulário
    if (field === "name" || field === "templateId" || field === "delay" || 
        field === "condition" || field === "customCondition") {
      form.setValue(field as any, value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[600px]"
        aria-describedby="step-config-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {stepIndex + 1}
            </Badge>
            {isViewOnly ? "Detalhes da Etapa" : "Configurar Etapa"}
          </DialogTitle>
          <DialogDescription id="step-config-description">
            {isViewOnly 
              ? "Visualize os detalhes desta etapa do funil" 
              : "Configure os detalhes desta etapa do funil"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">
                  {step.name || `Etapa ${stepIndex + 1}`}
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure os detalhes desta etapa do funil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da etapa</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o nome da etapa" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange("name", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Selecione um template" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange("templateId", e.target.value);
                          }}
                          disabled={isViewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="step-delay">Atraso</FormLabel>
                      <div className="flex items-center gap-2 mt-1">
                        <FormControl>
                          <Input
                            id="step-delay"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange("delay", Number(e.target.value));
                            }}
                            min={0}
                            className="w-20"
                            disabled={isViewOnly}
                          />
                        </FormControl>
                        <span className="text-sm text-muted-foreground">minutos</span>
                      </div>
                      <FormDescription className="text-xs mt-1">
                        Tempo de espera antes de enviar esta mensagem
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condição</FormLabel>
                      <FormDescription className="text-xs">
                        Quando esta etapa deve ser executada
                      </FormDescription>
                    
                      {isViewOnly ? (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                          <div className="flex items-center gap-2">
                            {conditionOptions.find(c => c.value === step.condition)?.icon}
                            <div>
                              <div className="font-medium">
                                {conditionOptions.find(c => c.value === step.condition)?.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {conditionOptions.find(c => c.value === step.condition)?.description}
                              </div>
                            </div>
                          </div>
                          {step.condition === "custom" && step.customCondition && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Condição personalizada:</span> {step.customCondition}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {conditionOptions.map((option) => (
                            <div
                              key={option.value}
                              className={cn(
                                "p-3 border rounded-md cursor-pointer hover:border-vinizap-primary/50 transition-colors",
                                step.condition === option.value
                                  ? "bg-vinizap-primary/5 border-vinizap-primary/30"
                                  : "bg-white"
                              )}
                              onClick={() => {
                                field.onChange(option.value);
                                handleFieldChange("condition", option.value);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {option.icon}
                                <div className="font-medium">{option.label}</div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {step.condition === "custom" && !isViewOnly && (
                  <FormField
                    control={form.control}
                    name="customCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="custom-condition">Condição Personalizada</FormLabel>
                        <FormControl>
                          <Input
                            id="custom-condition"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange("customCondition", e.target.value);
                            }}
                            placeholder="Descreva a condição personalizada"
                            className="mt-1"
                          />
                        </FormControl>
                        <FormDescription className="text-xs mt-1">
                          Descreva quando esta etapa deve ser executada
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </Form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {!isViewOnly && (
            <Button type="button" onClick={onClose}>
              Salvar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StepConfigModal;
