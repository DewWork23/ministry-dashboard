import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';

const VisitTimeline = () => {
  const [data, setData] = useState([]);
  const [visibleVisits, setVisibleVisits] = useState(5);

  useEffect(() => {
    const getData = async () => {
      const sheetData = await fetchSheetData();
      setData(sheetData);
    };
    getData();
  }, []);

  const visits = data
    .filter(item => item['Visit?'] === true || item['Visit?'] === 'TRUE') // Include items with "Visit?" checked or true
    .map(item => ({
      church: item.Church,
      date: item['Visit Date'],
      address: item.Address,
      notes: item['Visit Notes'],
      confirmed: true
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate unique churches based on name + address
  const uniqueChurches = data
    .filter(item => item.Church && (item['Visit?'] === true || item['Visit?'] === 'TRUE'))
    .reduce((acc, item) => {
      const churchKey = `${item.Church}|${item.Address || 'no-address'}`;
      if (!acc[churchKey]) {
        acc[churchKey] = item;
      }
      return acc;
    }, {});
  const uniqueChurchCount = Object.keys(uniqueChurches).length;

  const getStatusColor = () => {
    return 'bg-white'; // Neutral color for all statuses
  };

  // Calculate quick stats
  const upcomingVisits = visits.filter(v => new Date(v.date) > new Date()).length;
  const thisWeekVisits = visits.filter(v => {
    const visitDate = new Date(v.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return visitDate >= weekStart && visitDate <= weekEnd;
  }).length;
  const totalVisits = visits.length;

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <CardTitle>Visit Timeline</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-green-100 rounded-md text-center">
              <div className="text-lg font-semibold">{totalVisits}</div>
              <div className="text-sm font-bold text-gray-600">Total Visits</div>
            </div>
            <div className="p-4 bg-purple-100 rounded-md text-center">
              <div className="text-lg font-semibold">{uniqueChurchCount}</div>
              <div className="text-sm font-bold text-gray-600">Unique Churches</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-yellow-100 rounded-md text-center">
              <div className="text-lg font-semibold">{thisWeekVisits}</div>
              <div className="text-sm font-bold text-gray-600">This Week</div>
            </div>
            <div className="p-4 bg-blue-100 rounded-md text-center">
              <div className="text-lg font-semibold">{upcomingVisits}</div>
              <div className="text-sm font-bold text-gray-600">Upcoming Visits</div>
            </div>
          </div>

          <div>
            {visits.slice(0, visibleVisits).map((visit, index) => (
              <div key={index} className="mb-4">
                <div className={`p-4 rounded-md ${getStatusColor()}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">{visit.church}</div>
                    <div>
                      {visit.confirmed && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {visit.date ? new Date(visit.date).toLocaleDateString() : 'No Date'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {visit.address}
                      </span>
                    </div>
                  </div>

                  {visit.notes && (
                    <div className="text-sm text-gray-500">
                      {visit.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {visibleVisits < visits.length && (
            <button
              className="w-full mt-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
              onClick={() => setVisibleVisits(visibleVisits + 5)}
            >
              View More Visits
            </button>
          )}

          {visibleVisits > 5 && (
            <button
              className="w-full mt-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
              onClick={() => setVisibleVisits(5)}
            >
              Show Less
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

VisitTimeline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default VisitTimeline;