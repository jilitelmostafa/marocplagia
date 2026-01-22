import React from 'react';
import { Clipboard, X, FileText, Search, Loader2 } from 'lucide-react';
import { MAX_CHARS, SAMPLE_TEXT_ARABIC, SAMPLE_TEXT_ENGLISH } from '../constants';

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ text, setText, onAnalyze, isLoading }) => {
  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = charCount === 0;

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => setText('');

  const handleSample = (lang: 'ar' | 'en') => {
    setText(lang === 'ar' ? SAMPLE_TEXT_ARABIC : SAMPLE_TEXT_ENGLISH);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Paste Text
        </h2>
        <div className="flex gap-2">
           <button 
            onClick={() => handleSample('ar')}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Sample (AR)
          </button>
          <button 
            onClick={() => handleSample('en')}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Sample (EN)
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to check for plagiarism... (Arabic or English)"
          className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y text-slate-700 placeholder:text-slate-400"
          spellCheck={false}
          dir="auto"
        />
        
        {/* Quick Actions inside Textarea */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {text.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handlePaste}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
          {charCount} / {MAX_CHARS} characters
        </span>
        
        <button
          onClick={onAnalyze}
          disabled={isEmpty || isOverLimit || isLoading}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-md
            ${isEmpty || isOverLimit || isLoading 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Check Plagiarism
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
