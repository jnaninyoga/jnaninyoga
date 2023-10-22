import { BarChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import { userFields } from '../../../utils/form';
import { useMemo } from 'react';

AgeToGenderChart.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
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
			currentcare: PropTypes.oneOf(userFields.find((field) => field.name === "currentcare").options),
			currentcareinfo: PropTypes.string,
			// medical history
			record: PropTypes.oneOf(userFields.find((field) => field.name === "record").options),
			recordinfo: PropTypes.string,
		}),
		// physical / mental info
		physentalstate: PropTypes.shape({
			physical: PropTypes.arrayOf(PropTypes.string),
			mental: PropTypes.arrayOf(PropTypes.string),
		}),
		// life rhythm
		liferhythm: PropTypes.shape({
			sleep: PropTypes.oneOf(userFields.find((field) => field.name === "sleep").options),
			nutrition: PropTypes.oneOf(userFields.find((field) => field.name === "nutrition").options),
			sport: PropTypes.oneOf(userFields.find((field) => field.name === "sport").options),
			meditation: PropTypes.oneOf(userFields.find((field) => field.name === "meditation").options),
		}),
		// consultation reason
		consultationreason: PropTypes.string,
		// => Database document fields
		createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  })).isRequired,
};

export default function AgeToGenderChart({ users }) {

  // * Count the number of users in each age group starting from 10 years old to 70 years old
  const ChartData = useMemo(() => {
    const data = { males: Array(7).fill(0), females: Array(7).fill(0) };
    users.forEach((user) => {
      if (user.age >= 10 && user.age <= 70) {
        const ageGroup = Math.floor((user.age - 10) / 10);
        const gender = user.sex === "male" ? "males" : "females";
        data[gender][ageGroup]++;
      }
    });
    return data;
  }, [users]);

  return (
    <article title='Users Age To Gender Distribution' className='container w-1/2 sm:w-fit max-w-[50%]'>
      <BarChart
        title='Users Age To Gender Distribution'
				className='h-36 w-80 sm:w-[700px] sm:h-[300px]'
        width={650}
        height={300}
        colors={['#fdc5ba', '#8CC9D2']}
        series={[
          { data: ChartData.females, label: 'Females', id: 'f'},
          { data: ChartData.males, label: 'Males', id: 'm' },
        ]}
        xAxis={[{ data: ['10','20','30','40','50','60','70'], scaleType: 'band', valueFormatter: (value) => value + ' Years Old' }]}
        desc='Users Age To Gender Distribution'
      />
    </article>
  )
}
