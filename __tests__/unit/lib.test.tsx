import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/API/DATA');
    return response.data;
  } catch (error) {
    throw new Error('Fetch Error: ' + error.message);
  }
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchData', () => {
  it('should fetch data successfully', async () => {
    // Mocking the axios get method
    const mockData = [
      [1, "John Smith", "1990-05-14T21:00:00.000Z", "2019-12-31T21:00:00.000Z", 1500],
      [2, "Jane Doe", "1985-09-19T21:00:00.000Z", "2021-03-14T21:00:00.000Z", 1800],
      [16, "Emma Martinez", "1984-09-13T21:00:00.000Z", "2023-03-31T21:00:00.000Z", 1850],
      [17, "Alexander Brown", "1990-02-27T21:00:00.000Z", "2022-11-14T21:00:00.000Z", 1700]
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Call the fetchData function
    const result = await fetchData();

    // Assert that the result matches the expected data
    expect(result).toEqual(mockData);
  });

  it('should handle API errors', async () => {
    // Mocking axios.get to simulate an API error
    const errorMessage = 'API Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    // Call the fetchData function and expect it to throw an error
    await expect(fetchData()).rejects.toThrow('Fetch Error: ' + errorMessage);
  });

  it('should return empty array if API response is empty', async () => {
    // Mocking the axios get method to return an empty array
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
  
    // Call the fetchData function
    const result = await fetchData();
  
    // Assert that the result is an empty array
    expect(result).toEqual([]);
  });
  
  it('should handle invalid data format', async () => {
    // Mocking the axios get method to return data with invalid format
    const invalidData = [
      { id: 1, name: "John Smith" }, // Invalid format
      { id: 2, name: "Jane Doe" },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: invalidData });
  
    // Call the fetchData function and expect it to throw an error
    await expect(fetchData()).rejects.toThrow('Fetch Error');
  });

  it('should handle network errors', async () => {
    // Mocking axios.get to simulate a network error
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
  
    // Call the fetchData function and expect it to throw an error
    await expect(fetchData()).rejects.toThrow('Fetch Error: ' + errorMessage);
  });

  it('should handle timeout errors', async () => {
    // Mocking axios.get to simulate a timeout error
    const errorMessage = 'Timeout Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
  
    // Call the fetchData function and expect it to throw an error
    await expect(fetchData()).rejects.toThrow('Fetch Error: ' + errorMessage);
  });
  
});
