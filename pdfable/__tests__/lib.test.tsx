import { fetchData } from '@/app/lib';
import axios from 'axios';

// Mock axios module
jest.mock('axios');

describe('API Tests', () => {
  it('should fetch data from the API', async () => {
    // Mock resolved value for axios.get
    axios.get.mockResolvedValueOnce({
      data: {
        annualReports: [
          { fiscalDateEnding: '2023-01-01', grossProfit: 10000, totalRevenue: 50000, operatingIncome: 8000, netIncome: 6000 },
          { fiscalDateEnding: '2022-01-01', grossProfit: 9000, totalRevenue: 45000, operatingIncome: 7500, netIncome: 5500 }
        ]
      }
    });

    // Call the fetchData function
    const data = await fetchData();

    // Assert that data is returned correctly
    expect(data).toEqual([
      { fiscalDateEnding: '2023-01-01', grossProfit: 10000, totalRevenue: 50000, operatingIncome: 8000, netIncome: 6000 },
      { fiscalDateEnding: '2022-01-01', grossProfit: 9000, totalRevenue: 45000, operatingIncome: 7500, netIncome: 5500 }
    ]);
  });

  it('should handle API request error', async () => {
    // Mock rejected value for axios.get
    axios.get.mockRejectedValueOnce(new Error('Request failed with status code 500'));

    // Call the fetchData function
    try {
      await fetchData();
    } catch (error) {
      // Assert that the error is thrown
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Fetch Error: Request failed with status code 500');
    }
  });
});
