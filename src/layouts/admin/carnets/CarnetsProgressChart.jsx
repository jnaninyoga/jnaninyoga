import { PieChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

CarnetsProgressChart.propTypes = {
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
};


export default function CarnetsProgressChart({ carnets }) {

  // * The carnets total progress pie charts: total of the completed ones and uncompleted ones; (progress = 100% or completed = true)
  const chartData = useMemo(() => {
    const startedCarnets = carnets.filter(carnet => !carnet.completed && carnet.progress < 50).length;
    const halfwayThroughCarnets = carnets.filter(carnet => !carnet.completed && carnet.progress >= 50).length;
    const completedCarnets = carnets.filter(carnet => carnet.completed || carnet.progress === 100).length;
    const totalProgress =  startedCarnets + halfwayThroughCarnets + completedCarnets;
    return [
      { id: "started", value: (startedCarnets / totalProgress) * 100, label: 'Started Carnets' },
      { id: "halfwaythrough", value: (halfwayThroughCarnets / totalProgress) * 100, label: 'Halfway Through Carnets' },
      { id: "completed", value: (completedCarnets / totalProgress) * 100, label: 'Completed Carnets' },
    ];
  }, [carnets]);

  return (
    <article title='The Carnets Total Progress' className='container w-1/2 sm:w-fit max-w-[50%]'>
      <PieChart
        colors={["#d1f9ff", "#8CC9D2", "#4A9CA8"]}
        series={[{ data: chartData, valueFormatter: ({ value }) => `${value}%` }]}
        width={600}
        height={200}
      />
    </article>
  )
}
