
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <p>{message.content}</p>;
      case 'image':
        return (
          <div className="space-y-1">
            <img 
              src={message.fileUrl} 
              alt="Imagem" 
              className="rounded-md max-w-full max-h-[300px] object-contain"
            />
            {message.content && <p>{message.content}</p>}
          </div>
        );
      case 'video':
        return (
          <div className="space-y-1">
            <video 
              src={message.fileUrl} 
              controls
              className="rounded-md max-w-full max-h-[300px]"
            />
            {message.content && <p>{message.content}</p>}
          </div>
        );
      case 'audio':
        return (
          <div className="space-y-1">
            <audio src={message.fileUrl} controls className="w-full" />
            {message.content && <p>{message.content}</p>}
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-2 rounded-md">
              <span className="block text-xs text-gray-500">{message.fileName}</span>
              <a 
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                {message.content || 'Abrir arquivo'}
              </a>
            </div>
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  const renderMessageStatus = () => {
    if (!isUser) return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3.5 w-3.5 text-gray-400" />;
      case 'sent':
        return <Check className="h-3.5 w-3.5 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
      case 'failed':
        return <span className="text-xs text-red-500">Falha</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex mb-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "message-bubble",
        isUser ? "sent" : "received"
      )}>
        {renderMessageContent()}
        <div className="flex items-center justify-end text-xs mt-1 space-x-1 text-gray-500">
          <span>{format(message.timestamp, 'HH:mm')}</span>
          {renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
