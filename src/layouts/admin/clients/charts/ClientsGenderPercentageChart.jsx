import { PieChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import { clientFields } from '../../../../utils/form';
import { useMemo } from 'react';

ClientsGenderPercentageChart.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
    // personal info
		id: PropTypes.string,
		firstname: PropTypes.string,
		lastname: PropTypes.string,
		sex: PropTypes.oneOf(["male", "female"]),
		birthdate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		age: PropTypes.number,
		email: PropTypes.string,
		phone: PropTypes.string,
		address: PropTypes.string,
		job: PropTypes.string,
		// medical info
		medicalhistory: PropTypes.shape({
			// current care
			currentcare: PropTypes.oneOf(clientFields.find((field) => field.name === "currentcare").options),
			currentcareinfo: PropTypes.string,
			// medical history
			record: PropTypes.oneOf(clientFields.find((field) => field.name === "record").options),
			recordinfo: PropTypes.string,
		}),
		// physical / mental info
		physentalstate: PropTypes.shape({
			physical: PropTypes.arrayOf(PropTypes.string),
			mental: PropTypes.arrayOf(PropTypes.string),
		}),
		// life rhythm
		liferhythm: PropTypes.shape({
			sleep: PropTypes.oneOf(clientFields.find((field) => field.name === "sleep").options),
			nutrition: PropTypes.oneOf(clientFields.find((field) => field.name === "nutrition").options),
			sport: PropTypes.oneOf(clientFields.find((field) => field.name === "sport").options),
			meditation: PropTypes.oneOf(clientFields.find((field) => field.name === "meditation").options),
		}),
		// consultation reason
		consultationreason: PropTypes.string,
		// => Database document fields
		createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  })).isRequired,
};


export default function ClientsGenderPercentageChart({ clients }) {

  // * The clients geneder percentage chart data
  const chartData = useMemo(() => {
    const femaleCount = clients.filter(client => client.sex === 'female').length;
    const maleCount = clients.filter(client => client.sex === 'male').length;
    const totalCount = femaleCount + maleCount;
    return [
      { id: "f", value: (femaleCount / totalCount) * 100, label: 'Females' },
      { id: "m", value: (maleCount / totalCount) * 100, label: 'Males' },
    ];
  }, [clients]);

  return (
    <article title='The Clients Gender Percentage' className='container w-1/2 sm:w-fit max-w-[50%]'>
      <PieChart
        colors={['#fdc5ba', '#8CC9D2']}
        series={[{ data: chartData, valueFormatter: ({ value }) => `${value}%` }]}
        width={400}
        height={200}
      />
    </article>
  )
}
