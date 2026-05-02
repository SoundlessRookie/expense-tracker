import React, { useState, useRef } from 'react';
import { Upload, Camera, Check, Loader2 } from 'lucide-react';
import { uploadReceipt } from '../utils/api';

export function ReceiptUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus('uploading');
    setMessage('Uploading receipt...');

    try {
      await uploadReceipt(file);
      setStatus('success');
      setMessage(
        'Receipt uploaded! It will be processed shortly. ' +
        'Check your transactions in a few seconds.'
      );
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'Failed to upload receipt'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <Camera size={32} className="text-emerald-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold">Upload a Receipt</h3>
            <p className="text-sm text-zinc-500 mt-1">
              Take a photo or select an image of your receipt.
              We'll automatically extract the details and create a transaction.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload size={18} />
                Select Receipt Image
              </>
            )}
          </button>

          {status !== 'idle' && (
            <div
              className={`p-4 rounded-xl text-sm w-full max-w-md ${
                status === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : status === 'error'
                  ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
              }`}
            >
              {status === 'success' && <Check size={16} className="inline mr-2" />}
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h4 className="font-bold mb-3">How it works</h4>
        <div className="space-y-2 text-sm text-zinc-500">
          <p>1. Upload a photo of your receipt</p>
          <p>2. Amazon Textract reads the text from the image</p>
          <p>3. AI identifies the merchant, amount, date, and category</p>
          <p>4. A transaction is automatically created in your account</p>
        </div>
      </div>
    </div>
  );
}