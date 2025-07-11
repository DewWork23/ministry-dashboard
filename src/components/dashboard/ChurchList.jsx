import { useState } from 'react';
import { Search, Download, Share2 } from 'lucide-react';
import PropTypes from 'prop-types';

const ChurchList = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');


  // Get unique churches that have been visited (matching VisitTimeline logic)
  // Use both church name and address to determine uniqueness
  const allVisited = [...data].filter(item => {
    const hasChurch = item.Church && item.Church.trim() !== '';
    const isVisited = item['Visit?'] === true || 
                     item['Visit?'] === 'TRUE' || 
                     item['Visit?'] === 'True' ||
                     item['Visit?'] === 'true' ||
                     String(item['Visit?']).trim().toUpperCase() === 'TRUE';
    
    // Debug specific church
    if (hasChurch && item.Church.toLowerCase().includes('abiding')) {
      console.log('Abiding Presence check:', {
        church: item.Church,
        hasChurch,
        visitFlag: item['Visit?'],
        visitFlagString: String(item['Visit?']),
        isVisited,
        fullItem: item
      });
    }
    
    return hasChurch && isVisited;
  });

  const uniqueChurches = allVisited.reduce((acc, item) => {
    // Create unique key using church name and address
    const churchKey = `${item.Church.trim()}|${(item.Address || 'no-address').trim()}`;
    
    if (!acc[churchKey] || (item['Visit Date'] && new Date(item['Visit Date']) > new Date(acc[churchKey]['Visit Date'] || '1900-01-01'))) {
      acc[churchKey] = item;
    }
    return acc;
  }, {});

  const sortedChurches = Object.values(uniqueChurches)
    .sort((a, b) => a.Church.localeCompare(b.Church));

  const filteredChurches = sortedChurches.filter(church => {
    const matchesSearch = church.Church.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         church.Address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = !selectedLetter || 
                         church.Church.charAt(0).toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  const getAvailableLetters = () => {
    const letters = new Set();
    sortedChurches.forEach(church => {
      if (church.Church) {
        letters.add(church.Church.charAt(0).toUpperCase());
      }
    });
    return Array.from(letters).sort();
  };

  const availableLetters = getAvailableLetters();

  const downloadCSV = () => {
    const csvContent = [
      ['Church Name', 'Address', 'Last Visit Date'],
      ...sortedChurches.map(church => [
        church.Church,
        church.Address || '',
        church['Visit Date'] || 'No date recorded'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `churches-visited-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const textContent = sortedChurches.map(church => 
      `${church.Church} - ${church.Address || 'No address'}`
    ).join('\n');

    navigator.clipboard.writeText(textContent).then(() => {
      alert('Church list copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="w-full h-full bg-white">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Churches Visited A-Z ({filteredChurches.length} unique churches)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Download as CSV"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Copy to clipboard"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search churches or addresses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1 mt-4">
          <button
            onClick={() => setSelectedLetter('')}
            className={`px-3 py-1 rounded ${
              !selectedLetter ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {availableLetters.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1 rounded ${
                selectedLetter === letter ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-4 lg:px-6 pb-4 lg:pb-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChurches.length === 0 ? (
            <p className="text-gray-500 text-center py-8 col-span-full">No churches found</p>
          ) : (
            filteredChurches.map((church, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">{church.Church}</h3>
                {church.Address && (
                  <p className="text-gray-600 text-sm mt-1">{church.Address}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {church.Stage && (
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      church.Stage === 'Visited' 
                        ? 'bg-red-100 text-red-700' 
                        : church.Stage === 'Donated'
                        ? 'bg-green-100 text-green-700'
                        : church.Stage === 'Prospect'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {church.Stage}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

ChurchList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Church: PropTypes.string,
      Address: PropTypes.string,
      Stage: PropTypes.string,
      'Visit?': PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      'Visit Date': PropTypes.string,
    })
  ),
};

ChurchList.defaultProps = {
  data: [],
};

export default ChurchList;