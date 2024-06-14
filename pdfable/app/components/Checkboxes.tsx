import React from 'react';

const Checkboxes = ({ headers, columnVisibility, setColumnVisibility }) => {
  // Check if all headers are showing
  const allHeadersShowing = Object.values(columnVisibility).every(visible => visible);

  // Handle checkbox change for individual headers
  const handleHeaderChange = (header) => {
    setColumnVisibility(prevVisibility => ({
      ...prevVisibility,
      [header]: !prevVisibility[header]
    }));
  };

  // Handle checkbox change for "All Headers"
  const handleAllHeadersChange = () => {
    const allVisible = !allHeadersShowing;

    const updatedVisibility = {};
    headers.forEach(header => {
      updatedVisibility[header] = allVisible;
    });

    setColumnVisibility(updatedVisibility);
  };

  return (
    <div>
      <p>Headers Showing:</p>
      <div>
        <div key="all-headers">
          <input
            type="checkbox"
            id="checkbox-all-headers"
            checked={allHeadersShowing}
            onChange={handleAllHeadersChange}
          />
          <label htmlFor="checkbox-all-headers">All Headers</label>
        </div>
        {headers.map((header) => (
          <div key={header}>
            <input
              type="checkbox"
              id={`checkbox-${header}`}
              checked={columnVisibility[header]}
              onChange={() => handleHeaderChange(header)}
            />
            <label htmlFor={`checkbox-${header}`}>{header}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkboxes;
