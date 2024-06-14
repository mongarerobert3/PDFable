const generatePDF = async (useClient, outputType = OutputType.Save) => {
    const tableData = useClient ? urlData : filteredData;
    const props = {
      outputType,
      fileName: "Invoice_Header",
      returnJsPDFDocObject: true,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: logo ? URL.createObjectURL(logo) : null,
        type: 'PNG',
        width: 53.33,
        height: 26.66,
        margin: { top: 0, left: 0 }
      },
      business: {
        address
      },
      invoice: {
        invGenDate: `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        headerBorder: true,
        tableBodyBorder: false,
        header: headers.map(header => ({ title: header })),
        table: tableData,
        additionalRows: [],
        invDescLabel: "",
        invDesc: "",
      },
      footer: {
        text: footer || "Disclaimer",
        pageEnable: true
      },
      pageEnable: true,
      pageLabel: "Page",
    };
  
    try {
      const pdfObject = jsPDFInvoiceTemplate(props);
      const { jsPDFDocObject } = pdfObject;
  
      if (outputType === OutputType.Blob) {
        return jsPDFDocObject.output('blob');
      } else {
        jsPDFDocObject.save("Invoice_Header.pdf");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  export default generatePDF;