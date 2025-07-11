import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import PropTypes from 'prop-types';

const DebugVisits = ({ data = [] }) => {
  // Count visits using VisitTimeline logic
  const visitTimelineCount = data.filter(
    item => item['Visit?'] === true || item['Visit?'] === 'TRUE'
  ).length;

  // Count unique churches using ChurchList logic
  const uniqueChurches = [...data]
    .filter(item => item.Church && (item['Visit?'] === true || item['Visit?'] === 'TRUE'))
    .reduce((acc, item) => {
      const churchName = item.Church;
      if (!acc[churchName]) {
        acc[churchName] = [];
      }
      acc[churchName].push(item);
      return acc;
    }, {});

  const uniqueChurchCount = Object.keys(uniqueChurches).length;

  // Find churches with multiple visits
  const multipleVisits = Object.entries(uniqueChurches)
    .filter(([_, visits]) => visits.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  // Find visits without church names
  const visitsWithoutChurch = data.filter(
    item => (item['Visit?'] === true || item['Visit?'] === 'TRUE') && !item.Church
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visit Data Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Total Visits (VisitTimeline logic): {visitTimelineCount}</p>
            <p className="font-semibold">Unique Churches (ChurchList logic): {uniqueChurchCount}</p>
            <p className="font-semibold">Difference: {visitTimelineCount - uniqueChurchCount}</p>
          </div>

          <div>
            <p className="font-semibold">Visits without church name: {visitsWithoutChurch.length}</p>
            {visitsWithoutChurch.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {visitsWithoutChurch.slice(0, 5).map((visit, idx) => (
                  <div key={idx}>
                    Row {idx + 1}: Date: {visit['Visit Date'] || 'No date'}, 
                    Address: {visit.Address || 'No address'}
                  </div>
                ))}
                {visitsWithoutChurch.length > 5 && <p>...and {visitsWithoutChurch.length - 5} more</p>}
              </div>
            )}
          </div>

          <div>
            <p className="font-semibold">Churches with multiple visits: {multipleVisits.length}</p>
            {multipleVisits.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {multipleVisits.slice(0, 5).map(([church, visits]) => (
                  <div key={church}>
                    {church}: {visits.length} visits
                  </div>
                ))}
                {multipleVisits.length > 5 && <p>...and {multipleVisits.length - 5} more</p>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

DebugVisits.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default DebugVisits;