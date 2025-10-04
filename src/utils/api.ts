import axios from 'axios';
import { Country, CurrencyRate } from '../types';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(
      'https://restcountries.com/v3.1/all?fields=name,currencies'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const fetchCurrencyRates = async (baseCurrency: string): Promise<CurrencyRate | null> => {
  try {
    const response = await axios.get<CurrencyRate>(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return null;
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    if (fromCurrency === toCurrency) return amount;
    
    const rates = await fetchCurrencyRates(fromCurrency);
    if (rates && rates.rates[toCurrency]) {
      return amount * rates.rates[toCurrency];
    }
    return amount;
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount;
  }
};

