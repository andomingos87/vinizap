import React from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      <div className="space-y-1">
        {messages.map(message => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isUser={message.senderId === 'user'} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;