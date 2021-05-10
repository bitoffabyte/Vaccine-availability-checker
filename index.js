const axios = require('axios');
const { format } = require('date-fns');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const client = new Discord.Client();

dotenv.config();
client.on('ready', () => {
	console.log('I am ready!');
});

const startOfTomorrow = require('date-fns/startOfTomorrow');
// console.log(startOfTomorrow);
const sampleUserAgent =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36';
const d = new Date();
const date = format(d, 'dd-MM-yyyy');
console.log(date);
const districtId = 145;
const age = 18;
const appointmentsListLimit = 2;
const fun = async ({ message }) => {
	// console.log(message);
	axios
		.get(
			`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`,
			{ headers: { 'User-Agent': sampleUserAgent } }
		)
		.then((result) => {
			// console.log(result.data);
			const { centers } = result.data;
			let isSlotAvailable = false;
			let dataOfSlot = '';
			let appointmentsAvailableCount = 0;
			if (centers.length) {
				centers.forEach((center) => {
					center.sessions.forEach((session) => {
						if (
							session.min_age_limit <= age &&
							session.available_capacity > 3
						) {
							console.log(session.available_capacity);
							isSlotAvailable = true;
							appointmentsAvailableCount++;
							dataOfSlot = `${dataOfSlot}\nSlot for ${session.available_capacity} is available: ${center.name} on ${session.date}`;
							// if (
							// 	appointmentsAvailableCount <= appointmentsListLimit
							// ) {
							// }
						}
					});
				});
				if (isSlotAvailable) {
					console.log('slot available');
					dataOfSlot = `${dataOfSlot}\n${
						appointmentsAvailableCount - appointmentsListLimit
					} more slots available...`;
					message.channel.send({
						embed: {
							color: 3447003,
							title: 'Covid:',
							fields: [
								{
									name: 'Slots',
									value: dataOfSlot,

									inline: false,
								},
							],
						},
					});
				}

				// console.log(dataOfSlot);
				// console.log('asd');

				// return dataOfSlot;
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

client.on('message', async (message) => {
	if (message.content.startsWith('*covid')) {
		fun({ message });

		setInterval(async function () {
			console.log('asd');
			fun({ message });
			// console.log(yeet);
		}, 300000);
	}
});

client.login(process.env.token);
