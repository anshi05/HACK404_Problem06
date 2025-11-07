'use client';
import React, { useState } from "react";
import axios from "axios";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setResponse(null);
    setError(null);
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
        "http://127.0.0.1:8001/issue_certificate", // your FastAPI endpoint
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to upload or issue certificate. Please check your backend."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Upload Inspection Certificate
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2"
          />

          <button
            type="submit"
            disabled={!file || uploading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${
              uploading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {uploading ? "Uploading..." : "Submit Certificate"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ✅ Certificate Issued
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Certificate ID:</strong> {response.data.cert_id}
              </p>
              <p>
                <strong>Certificate Hash:</strong> {response.data.cert_hash}
              </p>
              <p>
                <strong>Owner:</strong> {response.data.owner}
              </p>
              <p>
                <strong>Expiry:</strong>{" "}
                {new Date(response.data.expiry * 1000).toLocaleDateString()}
              </p>
              <p className="truncate">
                <strong>Tx Hash:</strong> {response.data.tx_hash}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCertificate;