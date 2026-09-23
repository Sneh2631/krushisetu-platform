import React from 'react';

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelectSuggestion(suggestion)}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-[#17362C] hover:text-[#D9FF55] text-[#17362C] border border-[#17362C]/15 text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer text-left"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
