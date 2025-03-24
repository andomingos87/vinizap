
import React from 'react';
import { MessageIcon } from './Icons';

const EmptyStateMessage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-md animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-vinizap-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageIcon className="w-8 h-8 text-vinizap-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">ZapVenda</h3>
        <p className="text-gray-500 mb-4">
          Selecione um contato para iniciar uma conversa ou criar novos templates de mensagens.
        </p>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
