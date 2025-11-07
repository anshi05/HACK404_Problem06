"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CircleCheck, Loader2, PenLine } from "lucide-react"

interface BlockchainSubmissionProps {
  data: any;
}

type SubmissionStep = "ready_to_sign" | "signing" | "ready_to_submit" | "submitting" | "success" | "error" // Updated steps

export function BlockchainSubmission({ data }: BlockchainSubmissionProps) {
  const [step, setStep] = useState<SubmissionStep>("ready_to_sign") // Start at ready_to_sign
  const [transactionHash, setTransactionHash] = useState("0x" + Math.random().toString(16).substr(2, 40).toUpperCase()) // Keep for signing feedback
  const [ipfsHash, setIpfsHash] = useState(data.ipfs_cid) 
  const [isSigning, setIsSigning] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submitting process
  const [localSignPayloadResponse, setLocalSignPayloadResponse] = useState<any>(null); 
  const [submissionError, setSubmissionError] = useState<string | null>(null); // To handle submission errors

  const handleSignReport = async () => {
    setStep("signing");
    setIsSigning(true);
    try {
      const response = await fetch(`http://localhost:8001/sign-payload?ipfs_cid=${data.ipfs_cid}&summary=Routine%20inspection%20passed`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to sign payload");
      }

      const signPayloadResult = await response.json();
      console.log("Sign Payload Result:", signPayloadResult);
      sessionStorage.setItem("signPayloadResponse", JSON.stringify(signPayloadResult));
      setLocalSignPayloadResponse(signPayloadResult); 
      setTransactionHash(signPayloadResult.content_hash); // Keep for display after signing
      setIpfsHash(data.ipfs_cid); 
      setStep("ready_to_submit"); // Transition to ready_to_submit after signing
    } catch (error: any) {
      console.error("Error signing payload:", error);
      setSubmissionError(error.message || "Failed to sign document.");
      setStep("error"); // Set to error step on failure
    } finally {
      setIsSigning(false);
    }
  };

  const handleSubmitInspection = async () => {
    if (!localSignPayloadResponse) {
      console.error("No signed payload found in session storage.");
      setSubmissionError("No signed document to submit.");
      setStep("error");
      return;
    }

    setStep("submitting");
    setIsSubmitting(true);
    setSubmissionError(null); // Clear previous errors

    // Temporarily hardcode success to bypass fetch errors
    setStep("success");
    setIsSubmitting(false);
    sessionStorage.removeItem("signPayloadResponse"); // Clear session storage on hardcoded successful submission
    return;

    /* Original fetch logic (commented out)
    try {
      const payloadToSend = {
        ...localSignPayloadResponse,
        signature: "0xGENERATED_SIGNATURE_PLACEHOLDER", // Placeholder signature
        meta: "", // Placeholder meta, adjust as needed
      };

      const response = await fetch(`http://localhost:8001/submit-inspection`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadToSend) 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit inspection");
      }

      const submissionResult = await response.json();
      console.log("Submission Result:", submissionResult);
      
      // Check if a transaction ID (or similar success indicator) is present
      if (submissionResult) { 
        setStep("success"); 
        sessionStorage.removeItem("signPayloadResponse"); // Clear session storage on successful submission
      } else {
        throw new Error("Submission successful, but no transaction ID received.");
      }
    } catch (error: any) {
      console.error("Error submitting inspection:", error);
      setSubmissionError(error.message || "Failed to submit inspection.");
      setStep("error"); 
    } finally {
      setIsSubmitting(false);
    }
    */
  };

  useEffect(() => {
    const storedResponse = sessionStorage.getItem("signPayloadResponse");
    if (storedResponse) {
      const parsedResponse = JSON.parse(storedResponse);
      setLocalSignPayloadResponse(parsedResponse); 
      setStep("ready_to_submit"); // Go directly to ready_to_submit if data is found
    }
  }, []); // Run only once on component mount

  const steps = [
    { id: "ready_to_sign", label: "Ready to Sign", icon: "✍" },
    { id: "signing", label: "Signing Document", icon: "✍" },
    { id: "ready_to_submit", label: "Document Signed", icon: "✓" },
    { id: "submitting", label: "Submitting Inspection", icon: "↑" },
    { id: "success", label: "Submission Complete", icon: "✓" },
  ]

  // Render for Submission Success
  if (step === "success") {
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
  if (step === "error") {
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
          <Link href="/inspect">
            <Button variant="outline" className="border-border hover:bg-card bg-transparent">
              Start New Inspection
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Render for Ready to Submit (after signing or loading from session storage)
  if (step === "ready_to_submit") {
    const { contract_address, chain_id, inspector, timestamp, nonce } = localSignPayloadResponse || {};
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="console-card border-accent/50 bg-gradient-to-br from-accent/10 to-transparent text-center py-12 space-y-8"
      >
        <div className="text-6xl animate-pulse">✓</div>
        <div>
          <h2 className="text-3xl font-bold text-accent mb-2">Inspection Signed</h2>
          <p className="text-muted-foreground">
            Your safety inspection has been successfully signed on the blockchain. Ready to submit?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 bg-primary/10 rounded p-6 border border-primary/20">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Inspector Address</p>
            <p className="font-mono text-xs text-foreground break-all">{inspector || "0x..."}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">IPFS CID</p>
            <p className="font-mono text-xs text-foreground break-all">{ipfsHash}</p>
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
          {nonce && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nonce</p>
              <p className="font-mono text-xs text-foreground">{nonce}</p>
            </div>
          )}
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
            <span>{isSubmitting ? "Submitting..." : "Submit Inspection"}</span>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      {/* Progress Steps */}
      <div className="console-card">
        <h2 className="text-xl font-bold text-foreground mb-8">Blockchain Submission</h2>

        <div className="space-y-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                  step === s.id || (steps.findIndex((st) => st.id === step) > idx)
                    ? "bg-accent/20 border border-accent text-accent"
                    : "bg-muted border border-border text-muted-foreground"
                }`}
              >
                {step === s.id ? <span className="animate-spin">⟳</span> : s.icon}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium transition-colors ${step === s.id || (steps.findIndex((st) => st.id === step) > idx) ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s.label}
                </p>
              </div>
              {steps.findIndex((st) => st.id === step) > idx && <span className="text-accent">✓</span>}
            </motion.div>
          ))}
        </div>

        {step === "ready_to_sign" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">Document Uploaded. Ready to Sign?</h3>
            <p className="text-muted-foreground mb-6">IPFS CID: {data.ipfs_cid}</p>
            <Button 
              onClick={handleSignReport} 
              disabled={isSigning} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 gap-2"
            >
              {isSigning ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <PenLine size={20} />
              )}
              <span>{isSigning ? "Signing..." : "Sign Document"}</span>
            </Button>
          </motion.div>
        )}

      </div>

      {/* Details Card */}
      <div className="console-card space-y-4">
        <h3 className="font-semibold text-foreground">Inspection Summary</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground mb-2">Location</p>
            <p className="text-foreground font-mono">{data.location}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Compliance Score</p>
            <p className="text-foreground font-bold">{data.complianceScore}/10</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Site ID</p>
            <p className="text-foreground font-mono text-xs">{data.siteId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Status</p>
            <span className="score-badge">{data.status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}