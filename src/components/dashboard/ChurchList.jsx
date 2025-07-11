import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const ChurchList = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

  // Get unique churches that have been visited (matching VisitTimeline logic)
  const uniqueChurches = [...data]
    .filter(item => item.Church && (item['Visit?'] === true || item['Visit?'] === 'TRUE'))
    .reduce((acc, item) => {
      const churchName = item.Church;
      if (!acc[churchName] || (item['Visit Date'] && new Date(item['Visit Date']) > new Date(acc[churchName]['Visit Date'] || '1900-01-01'))) {
        acc[churchName] = item;
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Churches Visited A-Z ({filteredChurches.length} unique churches)</CardTitle>
        
        <div className="relative mt-4">
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