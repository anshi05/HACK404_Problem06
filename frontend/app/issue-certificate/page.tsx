'use client';
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Shield,
  Clock,
  User,
  Hash,
  ExternalLink
} from "lucide-react";

interface ApiResponse {
  status: string;
  message: string;
  data: {
    cert_id: string;
    cert_hash: string;
    owner: string;
    expiry: number;
    tx_hash: string;
  };
}

const UploadCertificate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResponse(null);
      setError(null);
    } else if (selectedFile) {
      setError("Please upload a PDF file only.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setResponse(null);
      setError(null);
    } else {
      setError("Please drop a PDF file only.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a certificate PDF first.");
      return;
    }

    setUploading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post<ApiResponse>(
        "http://127.0.0.1:8001/issue-certificate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to upload or issue certificate. Please check your backend connection."
      );
    } finally {
      setUploading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8 mb-6"
        >
          <div className="text-center mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Shield className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Certificate Issuance
            </h1>
            <p className="text-muted-foreground text-lg">
              Securely upload and issue inspection certificates on the blockchain
            </p>
          </div>
        </motion.div>

        {/* Main Upload Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-3xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop Area */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : file
                  ? "border-green-500 bg-green-500/10"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="mb-4"
              >
                {file ? (
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                ) : (
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                )}
              </motion.div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {file ? "Certificate Selected" : "Upload Certificate PDF"}
              </h3>
              
              <p className="text-muted-foreground mb-4">
                {file 
                  ? file.name
                  : "Drag & drop your PDF file or click to browse"
                }
              </p>

              {!file && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full text-sm text-foreground">
                  <FileText className="w-4 h-4" />
                  PDF files only
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!file || uploading}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                uploading
                  ? "bg-muted-foreground cursor-not-allowed text-muted"
                  : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-primary/20"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Issuing Certificate...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Issue Blockchain Certificate</span>
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
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
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
                      Certificate Issued Successfully!
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Your certificate has been securely stored on the blockchain
                    </p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl"
                  >
                    <Hash className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Certificate ID</div>
                      <div className="font-mono text-sm font-semibold text-foreground">
                        {response.data.cert_id}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl"
                  >
                    <FileText className="w-4 h-4 text-accent" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Certificate Hash</div>
                      <div className="font-mono text-sm text-foreground break-all">
                        {formatAddress(response.data.cert_hash)}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl"
                  >
                    <User className="w-4 h-4 text-green-500" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Owner</div>
                      <div className="font-mono text-sm text-foreground">
                        {formatAddress(response.data.owner)}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl"
                  >
                    <Clock className="w-4 h-4 text-orange-500" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Expiry Date</div>
                      <div className="text-sm font-semibold text-foreground">
                        {new Date(response.data.expiry * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4 text-red-500" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Transaction Hash</div>
                      <div className="font-mono text-sm text-foreground break-all">
                        {formatAddress(response.data.tx_hash)}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3 pt-4"
                >
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}
                    className="flex-1 py-2 px-4 bg-background border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    Copy Details
                  </button>
                  <button
                    onClick={() => {
                      setFile(null);
                      setResponse(null);
                      setError(null);
                    }}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-medium hover:from-primary/90 hover:to-accent/90 transition-all"
                  >
                    Issue Another
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
          <p>Secured by blockchain technology • Immutable and verifiable</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadCertificate;