import React, { useState } from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { analyzeText } from './services/geminiService';
import { AnalysisResult, AppState } from './types';

function App() {
  const [text, setText] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setAppState(AppState.ANALYZING);
    setErrorMsg('');
    setResult(null);

    try {
      const data = await analyzeText(text);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg("Failed to analyze text. Please check your internet connection or try a shorter text.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              PlagiaGuard
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sm text-slate-500">
             <span className="flex items-center gap-1">
               Powered by Gemini <Sparkles className="w-3 h-3 text-amber-500" />
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Verify Content Originality
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Advanced AI-powered plagiarism detection. Paste your text below to scan for duplicates, AI generation, and source attribution.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <InputSection 
            text={text} 
            setText={setText} 
            onAnalyze={handleAnalyze} 
            isLoading={appState === AppState.ANALYZING}
          />

          {appState === AppState.ERROR && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-fade-in">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {appState === AppState.SUCCESS && result && (
            <ResultsSection result={result} />
          )}

          {/* Loading Skeleton / Marketing Area when IDLE */}
          {appState === AppState.IDLE && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                 <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="font-semibold text-slate-900 mb-2">Accurate Detection</h3>
                 <p className="text-sm text-slate-500">Uses advanced language models to identify similarities and potential plagiarism with high precision.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                   <Sparkles className="w-6 h-6" />
                 </div>
                 <h3 className="font-semibold text-slate-900 mb-2">Search Grounding</h3>
                 <p className="text-sm text-slate-500">Cross-references content against billions of web pages using Google Search Grounding technology.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                 <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="font-semibold text-slate-900 mb-2">Multi-Language</h3>
                 <p className="text-sm text-slate-500">Optimized for both English and Arabic content analysis with native support.</p>
               </div>
             </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PlagiaGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
