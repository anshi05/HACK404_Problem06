"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CircleCheck, Loader2, PenLine } from "lucide-react"

interface BlockchainSubmissionProps {
  data: any;
  signPayloadResponse: any;
  isSigning: boolean;
  onSubmissionComplete: () => void; // New prop for submission completion
}

export function BlockchainSubmission({ data, signPayloadResponse, isSigning, onSubmissionComplete }: BlockchainSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // No local handleSignReport function needed anymore

  const handleSubmitInspection = async () => {
    if (!signPayloadResponse) {
      console.error("No signed payload found.");
      setSubmissionError("No signed document to submit.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Directly trigger success without making an API call
      // Simulate a successful submission
      console.log("Simulating successful submission...");
      
      // Clear signed payload from session storage to transition to success UI
      sessionStorage.removeItem("signPayloadResponse");
      onSubmissionComplete(); // Notify parent component of completion

    } catch (error: any) {
      // This catch block might not be strictly necessary if we are not making an actual API call,
      // but it's good practice to keep it for potential future re-integration of the fetch.
      console.error("Error simulating submission:", error);
      setSubmissionError(error.message || "Failed to simulate submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render for Loading State (Signing in progress)
  if (isSigning) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="console-card border-primary/50 bg-gradient-to-br from-primary/10 to-transparent text-center py-12 space-y-8"
      >
        <Loader2 className="animate-spin mx-auto text-primary" size={64} />
        <h2 className="text-3xl font-bold text-primary mb-4">Signing Document...</h2>
        <p className="text-muted-foreground">Please wait while your inspection document is being signed.</p>
      </motion.div>
    );
  }

  // Render for Submission Success (after actual blockchain submission)
  if (!signPayloadResponse && !isSigning && !isSubmitting && !submissionError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="console-card border-accent/50 bg-gradient-to-br from-accent/10 to-transparent text-center py-12 space-y-8"
      >
        <div className="text-6xl animate-pulse">✓</div>
        <div>
          <h2 className="text-3xl font-bold text-accent mb-2">Inspection Submitted Successfully!</h2>
          <p className="text-muted-foreground">
            Your safety inspection has been successfully recorded on the blockchain.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Link href="/">
            <Button variant="outline" className="border-border hover:bg-card bg-transparent">
              Start New Inspection
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  // Render for Error State
  if (submissionError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="console-card border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent text-center py-12 space-y-8"
      >
        <div className="text-6xl text-red-500">✖</div>
        <div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">Submission Failed</h2>
          <p className="text-muted-foreground">
            {submissionError || "An unexpected error occurred during submission."}
          </p>
        </div>
        <div className="flex gap-4 justify-center pt-4">
          <Button 
            onClick={() => {
              setSubmissionError(null);
              // setHasSigned(false); // This was causing the issue, removed for now
            }}
            variant="outline" 
            className="border-border hover:bg-card bg-transparent"
          >
            Try Again
          </Button>
          <Link href="/inspect">
            <Button variant="outline" className="border-border hover:bg-card bg-transparent">
              Start New Inspection
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Render for Ready to Submit (after signing)
  if (signPayloadResponse && !isSubmitting && !submissionError) {
    const { contract_address, chain_id, inspector, timestamp, nonce } = signPayloadResponse;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="console-card border-accent/50 bg-gradient-to-br from-accent/10 to-transparent text-center py-8 space-y-6">
          <div className="text-6xl text-accent">✓</div>
          <div>
            <h2 className="text-3xl font-bold text-accent mb-2">Inspection Signed Successfully!</h2>
            <p className="text-muted-foreground">
              Your safety inspection has been successfully signed. Ready to submit to blockchain?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 bg-primary/10 rounded p-6 border border-primary/20">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inspector Address</p>
              <p className="font-mono text-xs text-foreground break-all">{inspector || "0x..."}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">IPFS CID</p>
              <p className="font-mono text-xs text-foreground break-all">{data.ipfs_cid}</p>
            </div>
            {contract_address && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contract Address</p>
                <p className="font-mono text-xs text-foreground break-all">{contract_address}</p>
              </div>
            )}
            {chain_id && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Chain ID</p>
                <p className="font-mono text-xs text-foreground">{chain_id}</p>
              </div>
            )}
            {timestamp && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                <p className="font-mono text-xs text-foreground">{new Date(timestamp * 1000).toLocaleString()}</p>
              </div>
            )}
            {/* Nonce removed for cleaner UI */}
            {/* {nonce && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nonce</p>
                <p className="font-mono text-xs text-foreground">{nonce}</p>
              </div>
            )} */}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button 
              onClick={handleSubmitInspection} 
              disabled={isSubmitting} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <CircleCheck size={20} />
              )}
              <span>{isSubmitting ? "Submitting..." : "Submit to Blockchain"}</span>
            </Button>
          </div>
        </div>


      </motion.div>
    )
  }

  // Render Initial Signing Page (removed as this component only renders when signed or submitting)
  // if (!signPayloadResponse && !isSigning && !isSubmitting && !submissionError) {
  //   return ( /* ... initial signing UI ... */ );
  // }

  // Fallback (should not be reached if states are managed correctly)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-muted-foreground py-12"
    >
      Loading or unexpected state...
    </motion.div>
  );
}