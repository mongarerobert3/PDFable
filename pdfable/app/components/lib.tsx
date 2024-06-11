export const renderValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value); // Convert object to string for display
  }
  return value !== undefined ? value : '-';
};


