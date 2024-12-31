import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Map, Search } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const ChurchMap = ({ data = [] }) => {
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const stageColors = {
    'Prospect': '#EAB308',
    'Contacted': '#3B82F6',
    'Visited': '#22C55E',
    'Follow-up': '#A855F7',
    'Engaged': '#059669'
  };

  const filteredChurches = data.filter(church =>
    church.Church?.toLowerCase().includes(searchInput.toLowerCase()) ||
    church.Address?.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Simple positioning for demo - you might want to use real geocoding later
  const getPosition = (index) => ({
    x: 100 + (index * 50) % 300,
    y: 150 + Math.floor(index / 6) * 50
  });

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-gray-600" />
              <CardTitle>Church Locations ({filteredChurches.length})</CardTitle>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search churches..."
                className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full h-[600px] relative">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              {/* NC State outline */}
              <path
                d="M50,200 C200,280 300,290 400,270 L450,350 C350,380 250,370 150,390 Z"
                fill="#E5E7EB"
                stroke="#94A3B8"
                strokeWidth="2"
              />
              
              {filteredChurches.map((church, index) => {
                const position = getPosition(index);
                return (
                  <g
                    key={index}
                    transform={`translate(${position.x},${position.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedChurch(church)}
                  >
                    <circle
                      r="8"
                      fill={stageColors[church.Stage] || '#94A3B8'}
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-200 hover:scale-125"
                    />
                    <title>{church.Church}</title>
                  </g>
                );
              })}
            </svg>

            {selectedChurch && (
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-2">{selectedChurch.Church}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedChurch.Address}</p>
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: stageColors[selectedChurch.Stage] }}
                  />
                  <span className="text-sm font-medium">{selectedChurch.Stage}</span>
                  {selectedChurch['Visit Date'] && (
                    <span className="text-sm text-gray-500 ml-4">
                      Last Visit: {selectedChurch['Visit Date']}
                    </span>
                  )}
                </div>
                {selectedChurch['Visit Notes'] && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    {selectedChurch['Visit Notes']}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center bg-white p-3 rounded-lg">
            {Object.entries(stageColors).map(([stage, color]) => (
              <div key={stage} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{stage}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ChurchMap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Church: PropTypes.string,
      Address: PropTypes.string,
      Stage: PropTypes.string,
      'Visit Date': PropTypes.string,
      'Visit Notes': PropTypes.string,
    })
  )
};

ChurchMap.defaultProps = {
  data: []
};

export default ChurchMap;