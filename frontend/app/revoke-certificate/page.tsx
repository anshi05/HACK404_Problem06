'use client';
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  AlertTriangle, 
  ShieldOff, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  FileText
} from "lucide-react";

interface RevokeResponse {
  tx: string;
}

const RevokeCertificate: React.FC = () => {
  const [certHash, setCertHash] = useState("");
  const [response, setResponse] = useState<RevokeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certHash.trim()) {
      setError("Please enter a valid certificate hash.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post<RevokeResponse>(
        `http://127.0.0.1:8001/revoke-certificate?cert_hash=${certHash}`
      );
      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Revocation failed. Please check the certificate hash or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8 mb-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <ShieldOff className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
              Revoke Certificate
            </h1>
            <p className="text-muted-foreground text-lg">
              Permanently invalidate a certificate on the blockchain
            </p>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Certificate Hash Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Certificate Hash
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="0x..."
                value={certHash}
                onChange={(e) => setCertHash(e.target.value)}
                className="w-full border-2 border-border rounded-2xl p-4 text-foreground focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 font-mono text-sm"
              />
            </div>

            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: certHash ? 1 : 0 }}
              className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-500 text-sm">
                <strong className="font-semibold">Warning:</strong> This action is irreversible. 
                The certificate will be permanently revoked on the blockchain.
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading || !certHash}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                loading || !certHash
                  ? "bg-muted-foreground cursor-not-allowed text-muted"
                  : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-primary-foreground shadow-red-500/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Revoking Certificate...</span>
                </>
              ) : (
                <>
                  <ShieldOff className="w-5 h-5" />
                  <span>Revoke Certificate</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-red-500 text-sm">
                  <strong className="font-semibold">Error:</strong> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Response */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl space-y-4"
              >
                {/* Success Header */}
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="w-12 h-12 bg-accent rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-accent">
                      Certificate Revoked!
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      The certificate has been permanently invalidated
                    </p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Transaction Hash:
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">
                        {formatHash(response.tx)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(response.tx)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Copy Transaction Hash"
                      >
                        <Copy size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3 pt-2"
                >
                  <a
                    href={`https://sepolia.etherscan.io/tx/${response.tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-4 bg-background border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    View on Explorer
                  </a>
                  <button
                    onClick={() => {
                      setCertHash("");
                      setResponse(null);
                      setError(null);
                    }}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-primary-foreground rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    Revoke Another
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-muted-foreground text-sm"
        >
          <p>Permanent blockchain revocation • Immutable and verifiable</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RevokeCertificate;