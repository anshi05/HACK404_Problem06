"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { BlockchainSubmission } from "@/components/blockchain-submission"
import Image from "next/image";
import { CheckCircle, AlertTriangle, Bot } from "lucide-react";

interface AnalysisResult {
  label: string;
  confidence: number;
  prob_fake: number;
  file: string;
  image_base64: string;
  final_label: string;
}

interface AnalysisSummary {
  real: number;
  fake: number;
  total: number;
}

interface AIAnalysisResultProps {
  data: {
    status: string;
    count: number;
    results: AnalysisResult[];
    summary: AnalysisSummary;
  };
  onSubmit: () => void;
}

export function AIAnalysisResult({ data, onSubmit }: AIAnalysisResultProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (submitted) {
    return <BlockchainSubmission data={data} />;
  }

  // Calculate summary from results if not provided by backend
  const calculatedSummary = data.results.reduce(
    (acc, result) => {
      if (result.final_label === 'Real') acc.real++;
      else if (result.final_label === 'Forged') acc.fake++;
      acc.total++;
      return acc;
    },
    { real: 0, fake: 0, total: 0 }
  );

  const summary = data.summary && (data.summary.total > 0 || data.summary.real > 0 || data.summary.fake > 0) ? data.summary : calculatedSummary;

  const isAllReal = summary.real === summary.total && summary.total > 0;
  const successRate = summary.total > 0 ? (summary.real / summary.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Forgery Analysis Complete
        </h1>
        <p className="text-muted-foreground text-lg">
          Documents have been analyzed using advanced neural networks
        </p>
      </motion.div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="console-card border-primary/30 bg-gradient-to-br from-card to-primary/5 p-6 rounded-xl shadow-lg lg:col-span-2 relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isAllReal ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  Security Analysis Summary
                </h2>
                <p className="text-muted-foreground">AI-powered forgery detection results</p>
              </div>
              
              <div className="text-center lg:text-right mt-4 lg:mt-0">
                <div className={`text-3xl font-black ${isAllReal ? 'text-green-500' : 'text-red-500'}`}>
                  {successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
                <div className="text-2xl font-bold text-foreground">{summary.total}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Files</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-500">{summary.real}</div>
                <div className="text-xs text-green-400 uppercase tracking-wider">Authentic</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-2xl font-bold text-red-500">{summary.total - summary.real}</div>
                <div className="text-xs text-red-400 uppercase tracking-wider">Forged</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="console-card border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-xl shadow-lg"
        >
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              isAllReal ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <div className={`text-2xl ${isAllReal ? 'text-green-500' : 'text-red-500'}`}>
                {isAllReal ? '✓' : '✗'}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">
                {isAllReal ? 'Verification Passed' : 'Verification Failed'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isAllReal 
                  ? 'All documents are authentic and ready for blockchain submission'
                  : 'Some documents require further inspection'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Results */}
      {data.results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="console-card border-border/50 bg-gradient-to-b from-card to-card/80 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Detailed Analysis Results
            </h3>
            <div className="text-sm text-muted-foreground">
              {data.results.length} files processed
            </div>
          </div>

          <div className="space-y-4">
            {data.results.map((result: AnalysisResult, idx: number) => {
              const isReal = result.final_label === 'Real';
              const isForged = result.final_label === 'Forged';
              const isAIGenerated = result.final_label === 'AI-Generated';
              const confidenceColor = result.confidence > 0.9 ? 'text-green-500' : 
                                   result.confidence > 0.7 ? 'text-yellow-500' : 'text-red-500';
              
              const borderColorClass = isReal
                ? 'border-green-500/20 hover:border-green-500/40'
                : isForged
                  ? 'border-red-500/20 hover:border-red-500/40'
                  : 'border-purple-500/20 hover:border-purple-500/40';

              const bgColorClass = isReal
                ? 'bg-green-500/5'
                : isForged
                  ? 'bg-red-500/5'
                  : 'bg-purple-500/5';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${bgColorClass} ${borderColorClass}`}
                  onClick={() => setSelectedItem(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${isReal ? 'bg-green-500' : isForged ? 'bg-red-500' : 'bg-purple-500'}`} />
                      
                      {result.image_base64 && (
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image 
                            src={`data:image/jpeg;base64,${result.image_base64}`}
                            alt="Analyzed image thumbnail"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md border border-border"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-foreground truncate ${isReal ? 'text-green-400' : isForged ? 'text-red-400' : 'text-purple-400'}`}>
                          {result.file ? result.file.split('/').pop() : result.final_label}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          
                          <span className="text-muted-foreground">
                            Confidence: <span className={confidenceColor}>{(result.confidence * 100)}%</span>
                          </span>
                          {result.prob_fake !== undefined && (
                            <span className="text-muted-foreground">
                              Risk: <span className="text-foreground">{(result.prob_fake * 100).toFixed(1)}%</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Icons for Real/Forged/AI-Generated */}
                    <div className="w-8 h-8 flex items-center justify-center ml-4 flex-shrink-0">
                      {isReal && <CheckCircle className="text-green-500 w-6 h-6" />}
                      {isForged && <AlertTriangle className="text-red-500 w-6 h-6" />}
                      {isAIGenerated && <Bot className="text-purple-500 w-6 h-6" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <DetailedView item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border/50"
      >
        <Button 
          variant="outline" 
          className="border-border hover:bg-card bg-transparent gap-2 min-w-[160px]"
        >
          ← Back to Analysis
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-right">
            {isAllReal ? (
              <span className="text-green-500">✓ Ready for secure blockchain submission</span>
            ) : (
              <span className="text-yellow-500">⚠ Review forged documents before submission</span>
            )}
          </div>
          <Button
            onClick={() => setSubmitted(true)}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white gap-3 min-w-[200px] shadow-lg shadow-primary/20"
            size="lg"
          >
            <span>Secure Blockchain Submission</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface DetailedViewProps {
  item: AnalysisResult;
  onClose: () => void;
}

function DetailedView({ item, onClose }: DetailedViewProps) {
  const isReal = item.final_label === 'Real';
  const isForged = item.final_label === 'Forged';
  const isAIGenerated = item.final_label === 'AI-Generated';
  const confidenceColor = item.confidence > 0.9 ? 'text-green-500' : 
                        item.confidence > 0.7 ? 'text-yellow-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          ✕
        </Button>

        <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${isReal ? 'bg-green-500' : isForged ? 'bg-red-500' : 'bg-purple-500'}`} />
          Detailed Analysis: {item.file ? item.file.split('/').pop() : item.final_label}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {item.image_base64 && (
            <div className="relative w-full h-80 rounded-lg overflow-hidden border border-border bg-gray-900">
              <Image
                src={`data:image/jpeg;base64,${item.image_base64}`}
                alt="Analyzed image"
                layout="fill"
                objectFit="contain"
                className="w-full h-full"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Final Label</p>
              <p className={`text-xl font-bold ${isReal ? 'text-green-400' : isForged ? 'text-red-400' : 'text-purple-400'}`}>
                {item.final_label.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Confidence</p>
              <p className={`text-xl font-bold ${confidenceColor}`}>
                {(item.confidence * 100).toFixed(1)}%
              </p>
            </div>
            {item.prob_fake !== undefined && (
              <div>
                <p className="text-muted-foreground text-sm">Forgery Risk</p>
                <p className="text-xl font-bold text-foreground">
                  {(item.prob_fake * 100).toFixed(1)}%
                </p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-sm">Original Label</p>
              <p className="text-xl font-bold text-foreground">
                {item.label}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">File Path</p>
              <p className="text-md text-foreground break-all">
                {item.file}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}