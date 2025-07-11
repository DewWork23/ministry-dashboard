import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import StageDistribution from './components/dashboard/StageDistribution';
import VisitTimeline from './components/dashboard/VisitTimeline';
import Summary from './components/dashboard/Summary';
import ChurchList from './components/dashboard/ChurchList';
import DebugVisits from './components/dashboard/DebugVisits';
import { fetchSheetData } from './services/sheets';

const App = () => {
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
      <Header />
      <div className="flex">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)]">
              <VisitTimeline data={data} />
            </div>
            <div className="space-y-6">
              <StageDistribution data={data} />
              <Summary data={data} />
              <ChurchList data={data} />
              <DebugVisits data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;