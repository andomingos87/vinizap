import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  X, Edit, Trash2, ArrowRight, ArrowLeft, Plus, Trash, Check, 
  MessageSquare, MousePointerClick, Clock, List, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Funnel, FunnelStep, Template } from "@/types";

const funnelStepSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  templateId: z.string().min(1, { message: "Selecione um template" }),
  delay: z.number().min(0, { message: "O atraso deve ser um número positivo" }),
  condition: z.enum(["none", "response", "click"]),
});

const funnelSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(1, { message: "A descrição é obrigatória" }),
  steps: z.array(funnelStepSchema).min(1, { message: "Adicione pelo menos uma etapa" }),
});

type FunnelFormValues = z.infer<typeof funnelSchema>;

interface FunnelViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  funnel: Funnel | null;
  onEdit: (funnel: Funnel) => void;
  onDelete: (funnelId: string) => void;
  templates: Template[];
}

const FunnelViewModal: React.FC<FunnelViewModalProps> = ({
  isOpen,
  onClose,
  funnel,
  onEdit,
  onDelete,
  templates,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  const form = useForm<FunnelFormValues>({
    resolver: zodResolver(funnelSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: [],
    },
  });

  const isViewOnly = !isEditing;

  useEffect(() => {
    if (funnel && isOpen) {
      setSteps(funnel.steps);
      form.reset({
        name: funnel.name,
        description: funnel.description,
        steps: funnel.steps,
      });
      setCurrentStepIndex(null);
      setActiveTab("details");
      setIsEditing(false);
    }
  }, [funnel, isOpen, form]);

  const handleSubmit = (values: FunnelFormValues) => {
    if (!funnel) return;
    
    const updatedFunnel: Funnel = {
      ...funnel,
      name: values.name,
      description: values.description,
      steps: steps,
    };
    
    onEdit(updatedFunnel);
    setIsEditing(false);
    toast({
      title: "Funil atualizado",
      description: "O funil foi atualizado com sucesso",
    });
  };

  const handleDelete = () => {
    if (!funnel) return;
    onDelete(funnel.id);
    setIsDeleteDialogOpen(false);
    onClose();
    toast({
      title: "Funil excluído",
      description: "O funil foi excluído com sucesso",
      variant: "destructive",
    });
  };

  const handleModalClose = () => {
    setIsEditing(false);
    onClose();
  };

  const toggleEditMode = () => {
    setIsEditing(true);
  };

  // Step management functions
  const handleAddStep = () => {
    const newStep: FunnelStep = {
      id: crypto.randomUUID(),
      name: `Etapa ${steps.length + 1}`,
      templateId: templates.length > 0 ? templates[0].id : "",
      delay: 0,
      condition: "none",
    };
    
    setSteps([...steps, newStep]);
    setCurrentStepIndex(steps.length);
    setActiveTab("config");
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
    
    if (currentStepIndex === index) {
      setCurrentStepIndex(null);
    } else if (currentStepIndex !== null && currentStepIndex > index) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    setActiveTab("config");
  };

  const handleStepChange = (field: keyof FunnelStep, value: any) => {
    if (currentStepIndex === null) return;
    
    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      [field]: value,
    };
    
    setSteps(updatedSteps);
  };

  const conditionOptions = [
    {
      value: "none",
      label: "Sem condição",
      description: "Avança automaticamente após o atraso",
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      value: "response",
      label: "Resposta",
      description: "Avança quando o cliente responder",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      value: "click",
      label: "Clique",
      description: "Avança quando clicar em um link",
      icon: <MousePointerClick className="h-4 w-4" />,
    },
  ];

  const FunnelIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M1 1h22v5l-10 13v4l-4-2v-2L1 6V1z" />
    </svg>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent 
          className="sm:max-w-[650px] p-0 overflow-hidden max-h-[90vh]"
          aria-describedby="funnel-view-description"
        >
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <FunnelIcon className="h-5 w-5 text-purple-500" />
                  </div>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              placeholder="Nome do funil" 
                              {...field} 
                              className="text-xl font-semibold h-auto py-1 focus-visible:ring-vinizap-primary" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <DialogTitle className="text-xl">{funnel?.name}</DialogTitle>
                  )}
                  {/* <Badge variant="success">Ativo</Badge> */}
                  {/* <Badge variant="secondary">Inativo</Badge> */}
                </div>
                <DialogDescription id="funnel-view-description">
                  {isEditing 
                    ? "Edite as configurações do seu funil de mensagens" 
                    : "Visualize os detalhes do seu funil de mensagens"}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b px-6">
                  <TabsList className="bg-transparent p-0 h-12">
                    <TabsTrigger 
                      value="details" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-vinizap-primary data-[state=active]:shadow-none"
                    >
                      Detalhes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="steps" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-vinizap-primary data-[state=active]:shadow-none"
                    >
                      Etapas
                    </TabsTrigger>
                    <TabsTrigger 
                      value="config" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-vinizap-primary data-[state=active]:shadow-none"
                    >
                      Configuração
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview" 
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-vinizap-primary data-[state=active]:shadow-none"
                    >
                      Visualização
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="details" className="p-6 m-0">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Digite a descrição do funil" 
                                className="h-32 resize-none focus-visible:ring-vinizap-primary"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Descrição</h4>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-sm whitespace-pre-wrap">
                          {funnel?.description}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="steps" className="p-6 m-0">
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
                  
                  <TabsContent value="config" className="p-6 m-0">
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
                  
                  <TabsContent value="preview" className="p-6 m-0">
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
                                    setActiveTab("config");
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
                </div>
              </Tabs>

              <DialogFooter className="p-4 border-t">
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
                      <Trash2 className="h-4 w-4" />
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

export default FunnelViewModal;
