import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import StageDistribution from '../components/dashboard/StageDistribution';
import VisitTimeline from '../components/dashboard/VisitTimeline';
import Summary from '../components/dashboard/Summary';
import ChurchList from '../components/dashboard/ChurchList';
import { fetchSheetData } from '../services/sheets';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('dashboardAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - you should change this password
    if (password === 'ministry2024') {
      sessionStorage.setItem('dashboardAuth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Dashboard Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            <a href="/" className="text-blue-500 hover:underline">← Back to Churches List</a>
          </p>
        </div>
      </div>
    );
  }

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
              <ChurchList data={data} />
              <StageDistribution data={data} />
              <Summary data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;