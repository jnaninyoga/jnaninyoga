// === HOOKS ===
import { useState, useEffect } from 'react';

// === ASSETS ===
import Icon from '../../../assets/svg';

// === UTILS ===
import PropTypes from 'prop-types';
import { clientFields } from '../../../utils/form';

// === DATABASE ===
import { onSnapshot } from "firebase/firestore";
import { fetchSubColDocs } from '../../../firebase';

// === Layouts ===
import { Box } from "@mui/material";

// === Components X Charts ===
import ClientsAgeToGenderChart from '../clients/charts/ClientsAgeToGenderChart';
import ClientsGenderPercentageChart from '../clients/charts/ClientsGenderPercentageChart';
import CarnetsProgressChart from '../clients/charts/CarnetsProgressChart';
import CarnetsTypesChart from '../clients/charts/CarnetsTypesChart';
import { configurations, names } from '../../../firebase/collections';

ClientsChart.propTypes = {
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
	// carnets: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  //   clientID: PropTypes.string.isRequired,
  //   clientname: PropTypes.string.isRequired,
  //   completed: PropTypes.bool.isRequired,
  //   type: PropTypes.string.isRequired,
  //   period: PropTypes.string.isRequired,
  //   sessions: PropTypes.number.isRequired,
  //   passedSessions: PropTypes.number.isRequired,
  //   progress: PropTypes.number,
  //   price: PropTypes.number.isRequired,
  //   paidAmount: PropTypes.number.isRequired,
  //   remainingAmount: PropTypes.number.isRequired,
  //   payments: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       amount: PropTypes.number.isRequired,
  //       date: PropTypes.object.isRequired,
  //     })
  //   ).isRequired,
  //   // => Database document fields
	// 	createdAt: PropTypes.object,
	// 	updatedAt: PropTypes.object,
  // })).isRequired,
  carnetsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ClientsChart({ clients, carnetsTypes }) {
  const [carnets, setCarnets] = useState([]);

  // fetch all the sub collections (carnets) of the clients
  useEffect(() => {
    (async () => {
      clients.map(client => {
        // set the documents in the collection state with there ids
        onSnapshot(fetchSubColDocs(names.clients, client.id, configurations.carnets), (querySnapshot) => {
          setCarnets(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
      })
    })();
  }, [clients]);

  return (
    <Box className="w-full px-4  print:hidden">
      <section className='py-4 flex justify-center items-center gap-4 flex-col rounded-[4px] bg-yoga-white bg-texture texture-h-1'>
        <div className={`sm:h-12 sm:w-24 h-10 w-20 flex items-center justify-center transition-all duration-500 select-none z-[50]`}>
          <Icon
            label="Lotus"
            colors={{oc: "#ffffff", pc: "#fdc5ba"}}
            height={90}
            width={90}
          />
        </div>
        <h2 className='cinzel text-2xl font-semibold z-[50]'>Clients Data Charts</h2>
        <section className='container z-[50] flex items-start sm:items-center justify-start sm:justify-center sm:flex-row flex-col gap-20 overflow-x-auto sm:overflow-hidden rounded-sm'>
          <ClientsAgeToGenderChart clients={clients} />
          <ClientsGenderPercentageChart clients={clients} />
        </section>
        <h2 className='cinzel text-2xl font-semibold z-[50]'>Carnets Data Charts</h2>
        <section className='container z-[50] flex items-start sm:items-center justify-start sm:justify-center sm:flex-row flex-col gap-20 overflow-x-auto sm:overflow-hidden rounded-sm'>
          <CarnetsProgressChart carnets={carnets} />
          <CarnetsTypesChart carnets={carnets} types={carnetsTypes} />
        </section>
      </section>
    </Box>
  )
}

