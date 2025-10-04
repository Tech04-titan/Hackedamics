import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Button } from '../../components/UI/Button';
import { processReceiptImage } from '../../utils/ocr';
import { fetchCurrencyRates } from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { ExpenseCategory, OCRData } from '../../types';

export const SubmitExpense: React.FC = () => {
  const { submitExpense, company } = useApp();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(company?.currency || 'USD');
  const [category, setCategory] = useState<ExpenseCategory>('Other');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrData, setOcrData] = useState<OCRData | null>(null);

  const categories: ExpenseCategory[] = [
    'Travel',
    'Food',
    'Accommodation',
    'Transportation',
    'Office Supplies',
    'Client Entertainment',
    'Training',
    'Other',
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setReceipt(file);
    setReceiptPreview(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      toast.loading('Processing receipt...', { id: 'ocr' });
      const extractedData = await processReceiptImage(file);
      setOcrData(extractedData);

      // Auto-fill form with OCR data
      if (extractedData.amount) setAmount(extractedData.amount.toString());
      if (extractedData.currency) setCurrency(extractedData.currency);
      if (extractedData.category) setCategory(extractedData.category);
      if (extractedData.date) setDate(new Date(extractedData.date).toISOString().split('T')[0]);
      if (extractedData.merchantName) {
        setDescription(`${extractedData.merchantName} - ${extractedData.lineItems?.map(i => i.description).join(', ') || ''}`);
      }

      toast.success('Receipt processed successfully!', { id: 'ocr' });
    } catch (error) {
      toast.error('Failed to process receipt', { id: 'ocr' });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert currency if different from company currency
      let amountInCompanyCurrency = parseFloat(amount);
      if (company && currency !== company.currency) {
        const rates = await fetchCurrencyRates(currency);
        if (rates && rates.rates[company.currency]) {
          amountInCompanyCurrency = parseFloat(amount) * rates.rates[company.currency];
        }
      }

      submitExpense({
        amount: parseFloat(amount),
        currency,
        amountInCompanyCurrency,
        category,
        description,
        date: new Date(date),
        receiptUrl: receiptPreview || undefined,
        ocrData: ocrData || undefined,
      });

      toast.success('Expense submitted successfully!');
      setTimeout(() => navigate('/expenses'), 500);
    } catch (error) {
      toast.error('Failed to submit expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeReceipt = () => {
    setReceipt(null);
    setReceiptPreview(null);
    setOcrData(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Submit Expense</h1>
        <p className="text-gray-400 mt-1">Create a new expense claim</p>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Receipt Image (Optional - OCR enabled)
            </label>
            
            {!receipt ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border hover:border-primary/50 bg-dark-hover'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader size={20} className="animate-spin text-primary" />
                    <p className="text-white">Processing receipt...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-white mb-2">
                      {isDragActive ? 'Drop the image here' : 'Drag & drop receipt image here'}
                    </p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                  </>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={receiptPreview || ''}
                  alt="Receipt preview"
                  className="w-full h-64 object-contain bg-dark-hover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeReceipt}
                  className="absolute top-2 right-2 p-2 bg-danger hover:bg-danger-hover rounded-full text-white transition-colors"
                >
                  <X size={20} />
                </button>
                {ocrData && (
                  <div className="mt-2 p-3 bg-success/10 border border-success/30 rounded-lg">
                    <p className="text-success text-sm flex items-center gap-2">
                      <FileText size={16} />
                      Receipt data extracted and auto-filled
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
            />

            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={currencies}
              required
            />
          </div>

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            options={categories.map(c => ({ value: c, label: c }))}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              rows={4}
              placeholder="Enter expense description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Submit Expense
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/expenses')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

