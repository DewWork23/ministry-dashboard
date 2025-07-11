import { useState, useEffect } from 'react';
import ChurchList from '../components/dashboard/ChurchList';
import { fetchSheetData } from '../services/sheets';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchSheetData();
        setData(result || []);
      } catch (error) {
        console.error('Error:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Churches Visited</h1>
          <a 
            href="/ministry-dashboard/dashboard" 
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard →
          </a>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ChurchList data={data} />
      </main>
    </div>
  );
};

export default HomePage;