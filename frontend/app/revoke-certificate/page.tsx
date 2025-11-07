'use client';
import React, { useState } from "react";
import axios from "axios";
import { Copy } from "lucide-react";

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
      // Use backticks for template literals
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Revoke Certificate
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Certificate Hash"
            value={certHash}
            onChange={(e) => setCertHash(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />

          <button
            type="submit"
            disabled={loading || !certHash}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition ${
              loading || !certHash
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Revoking..." : "Revoke Certificate"}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm p-3 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ✅ Certificate Revoked Successfully
            </h2>

            <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="truncate text-sm text-gray-800">
                <strong>Tx Hash:</strong> {response.tx}
              </span>
              <button
                onClick={() => copyToClipboard(response.tx)}
                className="ml-2 p-1 text-gray-600 hover:text-gray-800"
                title="Copy Transaction Hash"
              >
                <Copy size={16} />
              </button>
            </div>

            <a
              href={`https://sepolia.etherscan.io/tx/${response.tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 text-sm hover:underline"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevokeCertificate;
