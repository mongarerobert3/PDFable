PDFable Project Documentation
Overview
PDFable is a web application designed to take JSON data, display it in table form, and provide functionalities to manage and export this data. Users can remove unwanted rows from the table before printing it to a PDF file, and send the generated files via email. The project uses jspdf-invoice-template for the PDF template generation, Next.js for the frontend, Node.js for the backend, and Oracle Database for data storage.

Features
Display JSON data in table form.
Remove unwanted rows from the table before exporting to PDF.
Export table data to PDF.
Send PDF and Excel files via email.
Uses jspdf-invoice-template for PDF generation.
Backend API with Node.js and Oracle Database integration.

Prerequisites
Node.js (v14 or higher)
Oracle Database
npm (Node Package Manager)

Installation and Setup
1. Clone the Repository
bash
Copy code
git clone https://github.com/mongarerobert3/PDFable.git

cd pdfable/data
2. Set Up Environment Variables
Create a .env file in the root directory of the project and add the following environment variables:

env
Copy code
ORACLE_USER=your_oracle_user
ORACLE_PASSWORD=your_oracle_password
ORACLE_CONNECTION_STRING=your_oracle_connection_string
NODEMAILER_PASSWORD=your_email_password
PORT=5000

3. Install Dependencies
Backend
Navigate to the data directory and install the necessary dependencies:

npm install

Frontend
Navigate to the pdfable directory and install the necessary dependencies:

npm install

4. Start the Oracle Database
Ensure your Oracle Database is up and running.

5. Run the Application
cd data
node app.js

Frontend
In a separate terminal window:

cd pdfable
npm run dev

Usage
Upload link to JSON Data

Manage Table Data
View the uploaded data in table format.
Remove any rows you don't want to include in the PDF.

Export to PDF
Click the "Export to PDF" button to generate a PDF using jspdf-invoice-template.
The PDF will download automatically.

Send Files via Email
Enter the recipient's email address.
Click the "Send Email" button to send the generated PDF and Excel files to the specified email address.

Notes
Ensure your Oracle Database is correctly set up and accessible with the provided credentials.
The application uses nodemailer for sending emails, which requires a valid email account with the correct authentication details.
Adjust the CORS policy if you're accessing the API from a different domain or port.

Contributing
Contributions are welcome! Please open an issue or submit a pull request.

License
This project is Open Source.
