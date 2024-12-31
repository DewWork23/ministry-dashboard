import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

function Summary({ data }) {
  const processData = (inputData = [], year) => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' }));
    const counts = inputData.reduce((acc, item) => {
      const visitDate = new Date(item['Visit Date']);
      if (visitDate.getFullYear() === year) {
        const month = visitDate.getMonth();
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    console.log(`Data for ${year}:`, counts);

    return months.map((month, index) => ({
      month,
      count: counts[index] || 0,
    }));
  };

  const data2024 = processData(data, 2024);
  const data2025 = processData(data, 2025);

  console.log('Processed data for 2024:', data2024);
  console.log('Processed data for 2025:', data2025);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Visit Totals Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}> {/* Adjusted height to 400 */}
            <LineChart>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" data={data2024} name="2024" stroke="#8884d8" />
              <Line type="monotone" dataKey="count" data={data2025} name="2025" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

Summary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Summary;