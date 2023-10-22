import { BarChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

CarnetTypesChart.propTypes = {
  carnets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    sessions: PropTypes.number.isRequired,
    passedSessions: PropTypes.number.isRequired,
    progress: PropTypes.number,
    price: PropTypes.number.isRequired,
    paidAmount: PropTypes.number.isRequired,
    remainingAmount: PropTypes.number.isRequired,
    payments: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.object.isRequired,
      })
    ).isRequired,
    // => Database document fields
		createdAt: PropTypes.object,
		updatedAt: PropTypes.object,
  })).isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default function CarnetTypesChart({ carnets, types }) {
  // * The Total Carnets grouped by type
  const chartData = useMemo(() => {
    const data = Array(types.length).fill(0);
    carnets.forEach((carnet) => {
      const typeIndex = types.findIndex(type => type === carnet.type);
      data[typeIndex]++;
    });
    return data;
  }, [carnets, types]);

  return (
    <article title='Total Of Carnets For Each Type' className='container w-1/2 sm:w-fit max-w-[50%]'>
      <BarChart
        title='Total Of Carnets For Each Type'
        width={400}
        height={300}
        colors={['#fdc5ba', '#8CC9D2']}
        series={[
          { data: chartData, label: 'Total Of Carnets For Each Type', id: 'types'},
        ]}
        xAxis={[{ data: types, scaleType: 'band' }]}
        desc='Total Of Carnets For Each Type'
      />
    </article>
  )
}
