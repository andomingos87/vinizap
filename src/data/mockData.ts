import { Contact, Message, Template, Funnel } from "@/types";

export const contacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "online",
    lastSeen: new Date(),
    unreadCount: 3,
    lastMessage: {
      id: "msg1",
      content: "Olá, podemos conversar sobre o projeto?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
      senderId: "1",
      status: "delivered"
    }
  },
  {
    id: "2",
    name: "Maria Souza",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    lastMessage: {
      id: "msg2",
      content: "Enviei os documentos que você pediu",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: "text",
      senderId: "user",
      status: "read"
    }
  },
  {
    id: "3",
    name: "Carlos Ferreira",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "online",
    lastSeen: new Date(),
    unreadCount: 0,
    lastMessage: {
      id: "msg3",
      content: "Obrigado pela informação!",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      type: "text",
      senderId: "3",
      status: "delivered"
    }
  },
  {
    id: "4",
    name: "Ana Oliveira",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 120),
    unreadCount: 1,
    lastMessage: {
      id: "msg4",
      content: "Vamos marcar uma reunião amanhã?",
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      type: "text", 
      senderId: "4",
      status: "delivered"
    }
  },
  {
    id: "5",
    name: "Time de Marketing",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    isGroup: true,
    participants: 5,
    status: "online",
    lastSeen: new Date(),
    unreadCount: 5,
    lastMessage: {
      id: "msg5",
      content: "Lucas: Vamos finalizar a campanha hoje?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "text",
      senderId: "lucas",
      status: "delivered"
    }
  },
  {
    id: "a1",
    name: "Pedro Santos",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    status: "offline",
    lastSeen: new Date(),
    isAddressBook: true,
    unreadCount: 0
  },
  {
    id: "a2",
    name: "Amanda Lima",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    status: "offline",
    lastSeen: new Date(),
    isAddressBook: true,
    unreadCount: 0
  },
  {
    id: "a3",
    name: "Ricardo Alves",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    status: "offline",
    lastSeen: new Date(),
    isAddressBook: true,
    unreadCount: 0
  },
  {
    id: "a4",
    name: "Beatriz Mendes",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    status: "offline",
    lastSeen: new Date(),
    isAddressBook: true,
    unreadCount: 0
  }
];

export const conversations: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      content: "Olá, tudo bem?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "text",
      senderId: "1",
      status: "read"
    },
    {
      id: "1-2",
      content: "Tudo ótimo! Como posso ajudar?",
      timestamp: new Date(Date.now() - 1000 * 60 * 59),
      type: "text",
      senderId: "user",
      status: "read"
    },
    {
      id: "1-3",
      content: "Estou interessado nos seus serviços",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      type: "text",
      senderId: "1",
      status: "read"
    },
    {
      id: "1-4",
      content: "Pode me contar mais sobre o que você oferece?",
      timestamp: new Date(Date.now() - 1000 * 60 * 44),
      type: "text",
      senderId: "1",
      status: "read"
    },
    {
      id: "1-5",
      content: "Claro! Nós oferecemos serviços de consultoria em marketing digital, otimização de SEO e gestão de redes sociais.",
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      type: "text",
      senderId: "user",
      status: "read"
    },
    {
      id: "1-6",
      content: "Interessante! Vocês também trabalham com desenvolvimento de sites?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
      senderId: "1",
      status: "read"
    },
    {
      id: "1-7",
      content: "Sim, oferecemos serviços completos de desenvolvimento web, desde landing pages até e-commerces.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
      senderId: "user",
      status: "read"
    },
    {
      id: "1-8",
      content: "Ótimo! Posso agendar uma reunião para discutirmos melhor?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: "text",
      senderId: "1",
      status: "read"
    },
    {
      id: "1-9",
      content: "Olá, podemos conversar sobre o projeto?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
      senderId: "1",
      status: "delivered"
    }
  ],
  "2": [
    {
      id: "2-1",
      content: "Oi, você pode me enviar os documentos do contrato?",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      type: "text",
      senderId: "user",
      status: "read"
    },
    {
      id: "2-2",
      content: "Claro, vou preparar e enviar hoje!",
      timestamp: new Date(Date.now() - 1000 * 60 * 235),
      type: "text",
      senderId: "2",
      status: "read"
    },
    {
      id: "2-3",
      content: "Enviei os documentos que você pediu",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: "text",
      senderId: "user",
      status: "read"
    },
    {
      id: "2-4",
      content: "Verifique seu email, por favor",
      timestamp: new Date(Date.now() - 1000 * 60 * 119),
      type: "text",
      senderId: "user",
      status: "read"
    }
  ]
};

export const templates: Template[] = [
  {
    id: "1",
    name: "Boas-vindas",
    content: "Olá, seja bem-vindo(a)! Obrigado por entrar em contato conosco. Como podemos ajudar hoje?",
    type: "text",
    category: "Atendimento"
  },
  {
    id: "2",
    name: "Agendamento",
    content: "Podemos agendar uma reunião para discutir melhor? Tenho disponibilidade nas seguintes datas: [DATAS]. Qual seria melhor para você?",
    type: "text",
    category: "Vendas"
  },
  {
    id: "3",
    name: "Pagamento Confirmado",
    content: "Seu pagamento foi confirmado! Agradecemos pela confiança. Em breve você receberá mais informações sobre o seu pedido.",
    type: "text",
    category: "Financeiro"
  },
  {
    id: "4",
    name: "Proposta Comercial",
    content: "Segue nossa proposta comercial conforme conversamos. Estou à disposição para esclarecimentos.",
    type: "file",
    fileUrl: "/documents/proposta.pdf",
    category: "Vendas"
  },
  {
    id: "5",
    name: "Lista de Preços",
    content: "Aqui está nossa lista de preços atualizada.",
    type: "image",
    fileUrl: "/images/precos.jpg",
    category: "Vendas"
  }
];

export const funnels: Funnel[] = [
  {
    id: "1",
    name: "Captação de Leads",
    description: "Funil para captação e qualificação de leads",
    steps: [
      {
        id: "1-1",
        name: "Primeiro Contato",
        templateId: "1",
        delay: 0,
        condition: "none"
      },
      {
        id: "1-2",
        name: "Apresentação",
        templateId: "2",
        delay: 60, // em minutos
        condition: "response"
      },
      {
        id: "1-3",
        name: "Envio de Proposta",
        templateId: "4",
        delay: 1440, // 24 horas em minutos
        condition: "response"
      }
    ]
  },
  {
    id: "2",
    name: "Pós-Venda",
    description: "Acompanhamento após a venda",
    steps: [
      {
        id: "2-1",
        name: "Confirmação de Pagamento",
        templateId: "3",
        delay: 0,
        condition: "none"
      },
      {
        id: "2-2",
        name: "Verificação de Satisfação",
        templateId: "1",
        delay: 10080, // 7 dias em minutos
        condition: "none"
      }
    ]
  }
];
