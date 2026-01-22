import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { AnalysisResult } from '../types';
import { ExternalLink, AlertTriangle, CheckCircle, AlertOctagon, BookOpen, Bot, Globe } from 'lucide-react';

interface ResultsSectionProps {
  result: AnalysisResult;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  const { analysis, sources } = result;

  // Determine color based on risk
  const getScoreColor = (score: number) => {
    if (score < 20) return '#22c55e'; // Green
    if (score < 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(analysis.score);

  const data = [
    { name: 'Risk', value: analysis.score },
    { name: 'Original', value: 100 - analysis.score },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up">
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Overall Score & Breakdown */}
          <div className="flex-1 flex flex-col items-center min-w-[300px] p-6 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Overall Risk Score</h3>
            
            {/* Main Gauge */}
            <div className="h-56 w-full relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell key="risk" fill={scoreColor} />
                    <Cell key="original" fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold" style={{ color: scoreColor }}>{analysis.score}%</span>
                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">{analysis.riskLevel} Risk</span>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="w-full space-y-4">
              {/* AI Score Bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-600" />
                    AI Detection
                  </span>
                  <span className="text-sm font-bold text-slate-700">{analysis.aiScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${analysis.aiScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Web Plagiarism Bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Web Match
                  </span>
                  <span className="text-sm font-bold text-slate-700">{analysis.plagiarismScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${analysis.plagiarismScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 w-full flex justify-center">
               <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  {analysis.riskLevel === 'Low' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {analysis.riskLevel === 'Medium' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  {analysis.riskLevel === 'High' && <AlertOctagon className="w-4 h-4 text-red-500" />}
                  <span className="font-medium">
                    {analysis.riskLevel === 'Low' ? 'Likely Original' : analysis.riskLevel === 'Medium' ? 'Suspicious Content' : 'High Probability of Copying/AI'}
                  </span>
               </div>
            </div>
          </div>

          {/* Right Column: Analysis & Sources */}
          <div className="flex-[2] space-y-6">
            
            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Detailed Analysis
              </h3>
              <div className="text-slate-600 leading-relaxed bg-blue-50/50 p-5 rounded-lg border border-blue-100 text-right md:text-left" dir="auto">
                {analysis.summary}
              </div>
            </div>

            {/* Sources List */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                Detected Sources
              </h3>
              
              {sources.length > 0 ? (
                <div className="space-y-3">
                  {sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.web?.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 group-hover:text-blue-700 truncate">
                            {source.web?.title || 'Unknown Source'}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-1">
                            {source.web?.uri}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-slate-300 text-center text-slate-500">
                  {analysis.plagiarismScore > 0 
                    ? "Content matches web sources, but specific URLs could not be retrieved." 
                    : "No matching web sources found."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flagged Segments (if any) */}
        {analysis.flaggedSegments.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Flagged Segments & AI Patterns</h3>
            <div className="grid gap-4">
              {analysis.flaggedSegments.map((item, idx) => (
                <div key={idx} className="bg-amber-50 rounded-lg p-4 border border-amber-100 transition-colors hover:bg-amber-100/50">
                  <p className="text-slate-800 font-medium mb-3 italic text-lg" dir="auto">"{item.segment}"</p>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 bg-amber-100 p-1 rounded">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-sm text-amber-900 font-medium leading-relaxed" dir="auto">
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;