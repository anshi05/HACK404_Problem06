
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DocumentData {
  contract_address: string;
  chain_id: number;
  content_hash: string;
  summary_hash: string;
  inspector: string;
  inspector_timestamp: number;
  nonce: string;
}

interface FileHistory {
  ipfs_cid: string;
  status: 'signed' | 'pending' | 'rejected'; // Changed to reflect actual data
  timestamp: string;
  data?: DocumentData; // Make data optional, as it might not always be present immediately
  id: string;
  documentName: string; // Added for display in the table
}

const DashboardPage = () => {
  const router = useRouter();

  const [fileHistory, setFileHistory] = useState<FileHistory[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('fileUploadHistory');
    if (storedHistory) {
      try {
        const parsedHistory: FileHistory[] = JSON.parse(storedHistory);
        setFileHistory(parsedHistory);
      } catch (error) {
        console.error("Error parsing file upload history from localStorage:", error);
        // Clear corrupted data or handle as needed
        localStorage.removeItem('fileUploadHistory');
      }
    }
  }, []);

  const simulateUpload = () => {
    const newStatus = Math.random() > 0.6 ? 'signed' : Math.random() > 0.3 ? 'pending' : 'rejected';
    const newFile: FileHistory = {
      id: Date.now().toString(),
      ipfs_cid: `Qm${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      documentName: `Document_${fileHistory.length + 1}.pdf`,
      status: newStatus,
      timestamp: new Date().toISOString(),
      data: newStatus === 'signed' ? {
        contract_address: "0x" + Math.random().toString(16).substring(2, 42),
        chain_id: 31337,
        content_hash: Math.random().toString(16).substring(2, 66),
        summary_hash: Math.random().toString(16).substring(2, 66),
        inspector: "0x" + Math.random().toString(16).substring(2, 42),
        inspector_timestamp: Math.floor(Date.now() / 1000),
        nonce: Math.random().toString(16).substring(2, 34),
      } : undefined,
    };
    const updatedHistory = [...fileHistory, newFile];
    setFileHistory(updatedHistory);
    localStorage.setItem('fileUploadHistory', JSON.stringify(updatedHistory));
  };

  const getDisplayStatus = (status: 'signed' | 'pending' | 'rejected') => {
    switch (status) {
      case 'signed':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const isCertificateAvailable = (status: 'signed' | 'pending' | 'rejected') => {
    return status === 'signed';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button onClick={simulateUpload} className="text-green-600 hover:underline">
                Simulate Upload
              </button>
            </li>
            <li>
              <Link href="/upload" className="text-blue-600 hover:underline">
                Upload New File
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-blue-600 hover:underline">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">File Upload History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CID Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fileHistory.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.documentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.ipfs_cid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(file.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        file.status === 'signed' ? 'bg-green-100 text-green-800' :
                        file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {getDisplayStatus(file.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isCertificateAvailable(file.status) ? (
                      <button
                        onClick={() => alert(`Downloading certificate for ${file.documentName} with CID: ${file.ipfs_cid}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download Certificate
                      </button>
                    ) : (
                      <span className="text-gray-500">No certificate issues</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
