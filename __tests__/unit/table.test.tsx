import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '../../pdfable/app/Index';  
import { useSharedState } from '../../pdfable/app/components/StateStore';  

jest.mock('../../pdfable/app/components/StateStore'); 

describe('renders table with data', () => {
  // Mock data
  const selectedColumns = ['Column1', 'Column2', 'Column3'];
  const urlData = [
    { Column1: 'Data1', Column2: 'Data2', Column3: 'Data3' },
    { Column1: 'Data4', Column2: 'Data5', Column3: 'Data6' }
  ];

  beforeEach(() => {
    useSharedState.mockReturnValue({
      selectedColumns,
      url: 'http://localhost:3001/API/DATA',
      urlData,
      setUrlData: jest.fn(),
      footer: '',
      setFooter: jest.fn()
    });
  });

  test('renders table with selected columns', () => {
    const { getByText } = render(<Index />);
    selectedColumns.forEach(column => {
      expect(getByText(column)).toBeInTheDocument();
    });
  });

  test('renders table with data', () => {
    const { getByText } = render(<Index />);
    urlData.forEach(item => {
      selectedColumns.forEach(column => {
        expect(getByText(item[column])).toBeInTheDocument();
      });
    });
  });
});
