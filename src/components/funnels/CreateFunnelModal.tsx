import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, X, Plus, Trash, ArrowRight, Clock, MessageSquare, MousePointerClick, List, Edit, AlertTriangle } from "lucide-react";
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
  FormDescription,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  customCondition: "",
};

interface FunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (funnel: Omit<Funnel, "id">) => void;
  onDelete?: (funnelId: string) => void;
  templates: { id: string; name: string }[];
  funnel?: Funnel;
  mode?: "create" | "view" | "edit";
}

const FunnelModal: React.FC<FunnelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  templates,
  funnel,
  mode = "create",
}) => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<FunnelStep[]>([{ ...defaultStep, id: crypto.randomUUID() }]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isEditing, setIsEditing] = useState<boolean>(mode === "edit");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  
  const isViewOnly = mode === "view" && !isEditing;

  const form = useForm<FunnelFormValues>({
    resolver: zodResolver(funnelSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: steps,
    },
  });

  // Initialize form with funnel data if provided
  useEffect(() => {
    if (funnel) {
      form.reset({
        name: funnel.name,
        description: funnel.description,
        steps: funnel.steps,
      });
      setSteps(funnel.steps);
    } else {
      // Reset to default for new funnel
      form.reset({
        name: "",
        description: "",
        steps: [{ ...defaultStep, id: crypto.randomUUID() }],
      });
      setSteps([{ ...defaultStep, id: crypto.randomUUID() }]);
    }
    
    // Set appropriate starting tab
    if (mode === "view") {
      setActiveTab("preview");
    } else {
      setActiveTab("details");
    }
  }, [funnel, form, mode]);

  const handleAddStep = () => {
    if (isViewOnly) return;
    
    const newStep = { ...defaultStep, id: crypto.randomUUID() };
    setSteps([...steps, newStep]);
    form.setValue("steps", [...steps, newStep]);
    setCurrentStepIndex(steps.length);
    setActiveTab("config");
  };

  const handleRemoveStep = (index: number) => {
    if (isViewOnly) return;
    
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
    setActiveTab(isViewOnly ? "preview" : "config");
  };

  const handleStepChange = (field: keyof FunnelStep, value: any) => {
    if (isViewOnly || currentStepIndex === null) return;
    
    const newSteps = [...steps];
    newSteps[currentStepIndex] = {
      ...newSteps[currentStepIndex],
      [field]: value,
    };
    
    setSteps(newSteps);
    form.setValue("steps", newSteps);
  };

  const handleSubmit = (values: FunnelFormValues) => {
    const funnelData = {
      ...(funnel?.id ? { id: funnel.id } : {}),
      name: values.name,
      description: values.description,
      steps: steps,
      isActive: funnel?.isActive ?? true,
    };
    
    onSave(funnelData);
    
    if (mode === "create") {
      // Reset form for create mode
      setSteps([{ ...defaultStep, id: crypto.randomUUID() }]);
      setCurrentStepIndex(0);
      setActiveTab("details");
      form.reset({
        name: "",
        description: "",
        steps: [{ ...defaultStep, id: crypto.randomUUID() }],
      });
    } else if (mode === "edit") {
      // Switch back to view mode after editing
      setIsEditing(false);
    }
    
    toast({
      title: mode === "create" ? "Funil criado" : "Funil atualizado",
      description: mode === "create" ? "O funil foi criado com sucesso" : "O funil foi atualizado com sucesso",
    });
  };

  const handleDelete = () => {
    if (funnel?.id && onDelete) {
      onDelete(funnel.id);
      setIsDeleteDialogOpen(false);
      onClose();
      
      toast({
        title: "Funil excluído",
        description: "O funil foi excluído com sucesso",
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

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

  const getModalTitle = () => {
    if (mode === "create") return "Criar novo funil";
    if (isEditing) return "Editar funil";
    return "Visualizar funil";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getModalTitle()}</DialogTitle>
            <DialogDescription>
              {mode === "create" || isEditing 
                ? "Configure um fluxo de mensagens automáticas para seus contatos" 
                : "Visualize os detalhes do seu funil de mensagens"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="steps">Etapas</TabsTrigger>
                  <TabsTrigger value="config">Configuração</TabsTrigger>
                  <TabsTrigger value="preview">Visualização</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nome do funil" 
                              {...field} 
                              disabled={isViewOnly}
                            />
                          </FormControl>
                          <FormDescription>
                            Um nome descritivo para identificar seu funil
                          </FormDescription>
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
                            <Input 
                              placeholder="Descrição breve do funil" 
                              {...field} 
                              disabled={isViewOnly}
                            />
                          </FormControl>
                          <FormDescription>
                            Uma breve descrição do objetivo deste funil
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="steps" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Lista de Etapas</h3>
                    {!isViewOnly && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddStep}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Etapa
                      </Button>
                    )}
                  </div>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Etapas do Funil</CardTitle>
                      <CardDescription className="text-xs">
                        Clique em uma etapa para {isViewOnly ? "visualizar" : "configurar"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                      <div className="space-y-1 p-2">
                        {steps.map((step, index) => (
                          <div 
                            key={step.id}
                            onClick={() => handleSelectStep(index)}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md cursor-pointer",
                              currentStepIndex === index 
                                ? "bg-vinizap-primary/10 border border-vinizap-primary/30" 
                                : "hover:bg-gray-100 border border-transparent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                {index + 1}
                              </Badge>
                              <span className="text-sm truncate max-w-[120px]">
                                {step.name || `Etapa ${index + 1}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {step.templateId && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  {templates.find(t => t.id === step.templateId)?.name.substring(0, 10) || 'Template'}
                                  {templates.find(t => t.id === step.templateId)?.name.length > 10 ? '...' : ''}
                                </Badge>
                              )}
                              {!isViewOnly && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-70 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveStep(index);
                                  }}
                                >
                                  <Trash className="h-3 w-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    {!isViewOnly && (
                      <CardFooter className="py-3 px-4 border-t">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-1"
                          onClick={handleAddStep}
                        >
                          <Plus className="h-4 w-4" />
                          Nova Etapa
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>
                
                <TabsContent value="config" className="space-y-4 pt-4">
                  {currentStepIndex !== null ? (
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 rounded-full">
                            {currentStepIndex + 1}
                          </Badge>
                          {isViewOnly ? "Detalhes da Etapa" : "Configurar Etapa"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {steps[currentStepIndex].name || `Etapa ${currentStepIndex + 1}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <FormLabel htmlFor="step-name">Nome da Etapa</FormLabel>
                          <Input
                            id="step-name"
                            value={steps[currentStepIndex].name}
                            onChange={(e) => handleStepChange("name", e.target.value)}
                            placeholder="Nome da etapa"
                            className="mt-1"
                            disabled={isViewOnly}
                          />
                          <FormDescription className="text-xs mt-1">
                            Um nome descritivo para identificar esta etapa
                          </FormDescription>
                        </div>

                        <div>
                          <FormLabel htmlFor="step-template">Template</FormLabel>
                          <Select
                            value={steps[currentStepIndex].templateId}
                            onValueChange={(value) => handleStepChange("templateId", value)}
                            disabled={isViewOnly}
                          >
                            <SelectTrigger className="mt-1">
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
                          <FormDescription className="text-xs mt-1">
                            Mensagem que será enviada nesta etapa
                          </FormDescription>
                        </div>

                        <div>
                          <FormLabel htmlFor="step-delay" className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            Atraso (minutos)
                          </FormLabel>
                          <Input
                            id="step-delay"
                            type="number"
                            min="0"
                            value={steps[currentStepIndex].delay}
                            onChange={(e) => handleStepChange("delay", parseInt(e.target.value, 10))}
                            className="mt-1"
                            disabled={isViewOnly}
                          />
                          <FormDescription className="text-xs mt-1">
                            Tempo de espera antes de enviar
                          </FormDescription>
                        </div>

                        <div>
                          <FormLabel htmlFor="step-condition">Condição para próxima etapa</FormLabel>
                          {isViewOnly ? (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                              <div className="flex items-center gap-2">
                                {steps[currentStepIndex].condition === "none" && (
                                  <>
                                    <ArrowRight className="h-4 w-4 text-gray-500" />
                                    <span>Sem condição - Avança automaticamente após o atraso</span>
                                  </>
                                )}
                                {steps[currentStepIndex].condition === "response" && (
                                  <>
                                    <MessageSquare className="h-4 w-4 text-blue-500" />
                                    <span>Resposta - Avança quando o cliente responder</span>
                                  </>
                                )}
                                {steps[currentStepIndex].condition === "click" && (
                                  <>
                                    <MousePointerClick className="h-4 w-4 text-green-500" />
                                    <span>Clique - Avança quando clicar em um link</span>
                                  </>
                                )}
                                {steps[currentStepIndex].condition === "custom" && (
                                  <>
                                    <Edit className="h-4 w-4 text-orange-500" />
                                    <span>Personalizado - {steps[currentStepIndex].customCondition}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                              {conditionOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className={cn(
                                    "flex items-start p-3 rounded-md border cursor-pointer transition-all",
                                    steps[currentStepIndex].condition === option.value
                                      ? "border-vinizap-primary bg-vinizap-primary/5 shadow-sm"
                                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                  )}
                                  onClick={() => handleStepChange("condition", option.value)}
                                >
                                  <div className={cn(
                                    "flex items-center justify-center h-8 w-8 rounded-full mr-3 shrink-0",
                                    steps[currentStepIndex].condition === option.value
                                      ? "bg-vinizap-primary/10 text-vinizap-primary"
                                      : "bg-gray-100 text-gray-500"
                                  )}>
                                    {option.icon}
                                  </div>
                                  <div>
                                    <div className={cn(
                                      "font-medium",
                                      steps[currentStepIndex].condition === option.value && "text-vinizap-primary"
                                    )}>
                                      {option.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {option.description}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {steps[currentStepIndex].condition === "custom" && (
                          <div>
                            <FormLabel htmlFor="step-custom-condition">Condição personalizada</FormLabel>
                            <Input
                              id="step-custom-condition"
                              value={steps[currentStepIndex].customCondition}
                              onChange={(e) => handleStepChange("customCondition", e.target.value)}
                              placeholder="Condição personalizada"
                              className="mt-1"
                              disabled={isViewOnly}
                            />
                            <FormDescription className="text-xs mt-1">
                              Descrição da condição personalizada
                            </FormDescription>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <List className="h-12 w-12 text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium text-gray-700">Nenhuma etapa selecionada</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md">
                        Selecione uma etapa na aba "Etapas" para {isViewOnly ? "visualizar seus detalhes" : "configurar seus detalhes"}
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab("steps")}
                      >
                        Ir para lista de etapas
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">Visualização do Fluxo</CardTitle>
                      <CardDescription className="text-xs">
                        Veja como as etapas estão conectadas no seu funil
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      {steps.length > 0 ? (
                        <div className="flex flex-col gap-4">
                          {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col">
                              <div 
                                className={cn(
                                  "px-4 py-3 rounded-md text-sm border flex justify-between items-center",
                                  currentStepIndex === index 
                                    ? "bg-vinizap-primary/10 border-vinizap-primary/30 font-medium" 
                                    : "bg-gray-50 border-gray-200"
                                )}
                                onClick={() => {
                                  setCurrentStepIndex(index);
                                  setActiveTab(isViewOnly ? "config" : "config");
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                    {index + 1}
                                  </Badge>
                                  <span>{step.name || `Etapa ${index + 1}`}</span>
                                </div>
                                {step.templateId && (
                                  <Badge variant="secondary" className="text-xs">
                                    {templates.find(t => t.id === step.templateId)?.name.substring(0, 15) || 'Template'}
                                    {templates.find(t => t.id === step.templateId)?.name.length > 15 ? '...' : ''}
                                  </Badge>
                                )}
                              </div>
                              
                              {index < steps.length - 1 && (
                                <div className="py-2 pl-6 flex flex-col items-start">
                                  <div className="flex items-center text-gray-500 text-xs">
                                    <div className="h-6 border-l border-dashed border-gray-300 mr-2"></div>
                                    <div className="flex items-center gap-1">
                                      {steps[index].condition === "none" && (
                                        <>
                                          <ArrowRight className="h-3 w-3" />
                                          <span>Após {steps[index].delay} minutos</span>
                                        </>
                                      )}
                                      {steps[index].condition === "response" && (
                                        <>
                                          <MessageSquare className="h-3 w-3 text-blue-500" />
                                          <span>Quando responder</span>
                                        </>
                                      )}
                                      {steps[index].condition === "click" && (
                                        <>
                                          <MousePointerClick className="h-3 w-3 text-green-500" />
                                          <span>Quando clicar</span>
                                        </>
                                      )}
                                      {steps[index].condition === "custom" && (
                                        <>
                                          <Edit className="h-3 w-3 text-orange-500" />
                                          <span>Quando {steps[index].customCondition}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Nenhuma etapa configurada</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6 gap-2">
                {mode === "view" && (
                  <>
                    {isEditing ? (
                      <>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="gap-1">
                          <Check className="h-4 w-4" />
                          Salvar Alterações
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Excluir
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={toggleEditMode}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                          Fechar
                        </Button>
                      </>
                    )}
                  </>
                )}
                
                {mode === "create" && (
                  <>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="gap-1">
                      <Check className="h-4 w-4" />
                      Criar Funil
                    </Button>
                  </>
                )}
                
                {mode === "edit" && !isViewOnly && (
                  <>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="gap-1">
                      <Check className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funil? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FunnelModal;
