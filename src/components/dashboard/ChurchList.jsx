import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search, Download, Share2 } from 'lucide-react';
import PropTypes from 'prop-types';

const ChurchList = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

  // Debug: Log all data to see what we're working with
  console.log('Total data items:', data.length);
  console.log('First 5 items:', data.slice(0, 5));
  
  // Check for specific address
  const fuquayData = data.filter(item => 
    item.Address && item.Address.toLowerCase().includes('fuquay')
  );
  console.log('Churches in Fuquay:', fuquayData);
  
  // Check for 7300 Sunset Lake Rd
  const sunsetData = data.filter(item => 
    item.Address && item.Address.includes('7300 Sunset')
  );
  console.log('Churches at 7300 Sunset:', sunsetData);
  
  // Check all Lutheran churches
  const allLutheran = data.filter(item => 
    item.Church && item.Church.toLowerCase().includes('lutheran')
  );
  console.log('All Lutheran churches:', allLutheran.map(c => ({
    name: c.Church,
    visited: c['Visit?'],
    address: c.Address
  })));

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

  console.log('Total visited churches (before dedup):', allVisited.length);

  const uniqueChurches = allVisited.reduce((acc, item) => {
    // Create unique key using church name and address
    const churchKey = `${item.Church.trim()}|${(item.Address || 'no-address').trim()}`;
    
    if (!acc[churchKey] || (item['Visit Date'] && new Date(item['Visit Date']) > new Date(acc[churchKey]['Visit Date'] || '1900-01-01'))) {
      acc[churchKey] = item;
    }
    return acc;
  }, {});

  console.log('Unique churches count:', Object.keys(uniqueChurches).length);

  const sortedChurches = Object.values(uniqueChurches)
    .sort((a, b) => a.Church.localeCompare(b.Church));

  // Final check for Abiding Presence
  const hasAbiding = sortedChurches.some(church => 
    church.Church.toLowerCase().includes('abiding')
  );
  console.log('Abiding Presence in final sorted list?', hasAbiding);
  if (!hasAbiding) {
    console.log('Churches starting with A:', 
      sortedChurches.filter(c => c.Church.toUpperCase().startsWith('A')).map(c => c.Church)
    );
  }

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Churches Visited A-Z ({filteredChurches.length} unique churches)</CardTitle>
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
      </CardHeader>
      
      <CardContent className="max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          {filteredChurches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No churches found</p>
          ) : (
            filteredChurches.map((church, index) => (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                <h3 className="font-semibold text-lg">{church.Church}</h3>
                {church.Address && (
                  <p className="text-gray-600 text-sm mt-1">{church.Address}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {church.Stage && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {church.Stage}
                    </span>
                  )}
                  {church['Visit Date'] ? (
                    <span className="text-xs text-gray-500">
                      Last visited: {church['Visit Date']}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Visited
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
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