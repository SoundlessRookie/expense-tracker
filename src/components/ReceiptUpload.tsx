import React, { useState } from 'react';
import { Upload, FileImage, Loader2, ReceiptText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

type ReceiptResult = {
  id?: number;
  merchant?: string | null;
  transaction_date?: string | null;
  total_amount?: string | number | null;
  raw_text?: string;
  message?: string;
};

export function ReceiptUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ReceiptResult | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a receipt image first.');
      return;
    }

    setError('');
    setResult(null);
    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch('http://127.0.0.1:8000/api/receipts/upload/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to upload receipt.');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
            <ReceiptText size={28} />
          </div>

          <div>
            <h3 className="text-xl font-bold">Upload Receipt</h3>
            <p className="text-sm text-zinc-500 mt-1">
              Upload a receipt image. Wally will try to extract the merchant, date, and total amount.
            </p>
          </div>
        </div>

        <div className="mt-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center bg-zinc-50/60 dark:bg-zinc-900/50">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
              <FileImage size={36} className="text-zinc-500" />
            </div>

            <div>
              <p className="font-bold">Choose a receipt image</p>
              <p className="text-sm text-zinc-500 mt-1">
                JPG, PNG, or other image files work best.
              </p>
            </div>

            <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
              <Upload size={18} />
              Select File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setError('');
                  setResult(null);
                }}
              />
            </label>

            {file && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Selected: <span className="font-semibold">{file.name}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload and Extract
              </>
            )}
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="card border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <AlertCircle size={22} />
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-5"
        >
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 size={24} />
            <h3 className="text-lg font-bold">Extracted Receipt Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
              <p className="text-xs font-bold text-zinc-500 uppercase">Merchant</p>
              <p className="font-semibold mt-1">{result.merchant || 'Not found'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
              <p className="text-xs font-bold text-zinc-500 uppercase">Date</p>
              <p className="font-semibold mt-1">{result.transaction_date || 'Not found'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
              <p className="text-xs font-bold text-zinc-500 uppercase">Total</p>
              <p className="font-semibold mt-1">
                {result.total_amount ? `$${result.total_amount}` : 'Not found'}
              </p>
            </div>
          </div>

          <details className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-4">
            <summary className="cursor-pointer font-bold">Show raw OCR text</summary>
            <pre className="mt-4 whitespace-pre-wrap text-xs text-zinc-600 dark:text-zinc-300">
              {result.raw_text || 'No text extracted.'}
            </pre>
          </details>
        </motion.div>
      )}
    </div>
  );
}