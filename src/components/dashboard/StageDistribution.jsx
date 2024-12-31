import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import PropTypes from 'prop-types';

function StageDistribution(props) {
  const processData = (inputData = []) => {
    const stageOrder = ['Prospect', 'Visited', 'Navigation', 'Meeting Scheduled', 'Donated'];
    const counts = inputData.reduce((acc, item) => {
      const stage = item?.Stage;
      if (stage) acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

    return stageOrder.map(stage => ({
      stage,
      count: counts[stage] || 0,
      conversionRate: inputData.length ? Math.round(((counts[stage] || 0) / inputData.length) * 100) : 0
    }));
  };

  const stageColors = {
    'Prospect': '#FFE5B2', // Light Orange
    'Visited': '#FFB2B2', // Light Red
    'Navigation': '#F5C6E3', // Light Pink
    'Meeting Scheduled': '#B2E5D8', // Light Teal
    'Donated': '#B2D8B2', // Light Green
  };

  const textColors = {
    'Prospect': 'text-orange-600',
    'Visited': 'text-red-600',
    'Navigation': 'text-pink-600',
    'Meeting Scheduled': 'text-teal-600',
    'Donated': 'text-green-600',
  };

  const stageData = processData(props.data);
  const totalChurches = props.data?.length || 0;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-100 rounded-md text-center">
              <div className="text-sm font-bold text-blue-600">Total Churches</div>
              <div className="text-lg font-semibold text-blue-600">{totalChurches}</div>
            </div>
            {stageData.map((stageItem) => (
              <div key={stageItem.stage} className="p-4 rounded-md text-center" style={{ backgroundColor: stageColors[stageItem.stage] }}>
                <div className={`text-sm font-bold ${textColors[stageItem.stage]}`}>{stageItem.stage}</div>
                <div className={`text-lg font-semibold ${textColors[stageItem.stage]}`}>{stageItem.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

StageDistribution.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StageDistribution;