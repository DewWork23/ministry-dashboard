import Papa from 'papaparse';

const SHEET_ID = '11c1rwEa3eO87LrjTbLDj842Mqn7L_xgKltDB_gMUl54';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

export const fetchSheetData = async () => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Parsed data:', results.data);
          resolve(results.data);
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