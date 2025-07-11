import Papa from 'papaparse';

const SHEET_ID = '11c1rwEa3eO87LrjTbLDj842Mqn7L_xgKltDB_gMUl54';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

export const fetchSheetData = async () => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      // First, parse without headers to see all rows
      Papa.parse(text, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Raw data rows:', results.data.length);
          console.log('First 3 rows:', results.data.slice(0, 3));
          
          // Now parse with headers, starting from the actual header row
          const headers = results.data[0]; // First row is headers
          const dataRows = results.data.slice(1); // All rows after headers
          
          // Convert to objects using the headers
          const parsedData = dataRows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          
          console.log('Parsed data:', parsedData.length, 'churches');
          console.log('First church:', parsedData[0]);
          resolve(parsedData);
        },
        error: (error) => {
          console.error('Parse error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};