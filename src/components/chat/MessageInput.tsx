import React, { useState, useRef } from 'react';
import { Paperclip, Send, Smile, Mic, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onToggleTemplates: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  onToggleTemplates
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(value + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Fechar o seletor de emojis ao clicar fora dele
  const handleClickOutside = (e: MouseEvent) => {
    if (
      emojiButtonRef.current && 
      !emojiButtonRef.current.contains(e.target as Node) && 
      !(e.target as Element).closest('.EmojiPickerReact')
    ) {
      setShowEmojiPicker(false);
    }
  };

  // Adicionar e remover event listener para fechar o seletor ao clicar fora
  React.useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="bg-white border-t p-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-vinizap-primary hover:bg-gray-100 rounded-full" 
            onClick={onToggleTemplates}
          >
            <FileText className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 flex-shrink-0 text-gray-500 hover:text-vinizap-primary hover:bg-gray-100 rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow relative bg-gray-100 rounded-full">
          <textarea 
            className="w-full bg-transparent border-0 focus:ring-0 rounded-full py-2 px-4 max-h-[120px] resize-none" 
            placeholder="Digite uma mensagem" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            onKeyDown={onKeyDown} 
            rows={1} 
            style={{
              minHeight: '40px',
              height: 'auto',
              overflow: value.length > 100 ? 'auto' : 'hidden'
            }} 
          />
          <Button 
            ref={emojiButtonRef}
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-vinizap-primary hover:bg-gray-200 rounded-full"
            onClick={toggleEmojiPicker}
          >
            <Smile className="h-5 w-5" />
          </Button>
          
          {showEmojiPicker && (
            <div className="absolute right-0 bottom-12 z-10">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={Theme.LIGHT}
                searchDisabled={false}
                skinTonesDisabled
                width={300}
                height={400}
                previewConfig={{
                  showPreview: false
                }}
              />
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-10 w-10 flex-shrink-0 rounded-full", 
            value ? "bg-vinizap-primary text-white hover:bg-vinizap-primary/90" : "text-gray-500 hover:text-vinizap-primary hover:bg-gray-100"
          )} 
          onClick={onSend} 
          disabled={!value}
        >
          {value ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;