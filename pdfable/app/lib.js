import axios from 'axios';

export const fetchData = async () => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo');
    return response.data.annualReports;
  } catch (error) {
    throw new Error('Fetch Error: ' + error.message);
  }
};
