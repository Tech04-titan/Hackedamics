import { createWorker } from 'tesseract.js';
import { OCRData, ExpenseCategory } from '../types';

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  const worker = await createWorker();
  
  try {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    
    return text;
  } catch (error) {
    console.error('OCR error:', error);
    await worker.terminate();
    return '';
  }
};

export const parseReceiptText = (text: string): OCRData => {
  const ocrData: OCRData = {};
  
  // Extract amount (look for currency symbols and numbers)
  const amountPattern = /\$|€|£|₹|¥/;
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Look for total amount
    if (line.toLowerCase().includes('total') || line.toLowerCase().includes('amount')) {
      const numberMatch = line.match(/[\d,]+\.?\d*/);
      if (numberMatch) {
        ocrData.amount = parseFloat(numberMatch[0].replace(',', ''));
      }
    }
    
    // Look for date
    const dateMatch = line.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/);
    if (dateMatch) {
      ocrData.date = new Date(dateMatch[0]);
    }
    
    // Look for merchant name (usually at the top)
    if (!ocrData.merchantName && line.trim().length > 3 && line.trim().length < 50) {
      if (!/\d/.test(line) && !line.includes('$') && !line.includes('total')) {
        ocrData.merchantName = line.trim();
      }
    }
  }
  
  // Detect currency
  if (text.includes('$')) ocrData.currency = 'USD';
  else if (text.includes('€')) ocrData.currency = 'EUR';
  else if (text.includes('£')) ocrData.currency = 'GBP';
  else if (text.includes('₹')) ocrData.currency = 'INR';
  else if (text.includes('¥')) ocrData.currency = 'JPY';
  
  // Categorize based on keywords
  const lowerText = text.toLowerCase();
  if (lowerText.includes('hotel') || lowerText.includes('accommodation')) {
    ocrData.category = 'Accommodation';
  } else if (lowerText.includes('restaurant') || lowerText.includes('cafe') || lowerText.includes('food')) {
    ocrData.category = 'Food';
  } else if (lowerText.includes('taxi') || lowerText.includes('uber') || lowerText.includes('transport')) {
    ocrData.category = 'Transportation';
  } else if (lowerText.includes('flight') || lowerText.includes('train') || lowerText.includes('travel')) {
    ocrData.category = 'Travel';
  } else if (lowerText.includes('office') || lowerText.includes('supplies') || lowerText.includes('stationery')) {
    ocrData.category = 'Office Supplies';
  }
  
  // Extract line items
  ocrData.lineItems = [];
  for (const line of lines) {
    const itemMatch = line.match(/(.*?)\s+([\d,]+\.?\d*)/);
    if (itemMatch && itemMatch[1] && itemMatch[2]) {
      const description = itemMatch[1].trim();
      const amount = parseFloat(itemMatch[2].replace(',', ''));
      if (description.length > 2 && amount > 0) {
        ocrData.lineItems.push({ description, amount });
      }
    }
  }
  
  return ocrData;
};

export const processReceiptImage = async (imageFile: File): Promise<OCRData> => {
  const text = await extractTextFromImage(imageFile);
  return parseReceiptText(text);
};

