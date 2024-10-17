import express from 'express';
import mongodb from 'mongodb';

const app = express();
const url = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(url);

const startServer = async () => {
	try {
		await client.connect();
		const db = client.db('test');
		const coll = db.collection('users');

		app.get('/', (req, res) => {
			res.send('HOME PAGE');
		});

		app.get('/users', async (req, res) => {
			try {
				const users = await coll.find().toArray();
				if (users.length > 0) {
					res.send(users);
				} else {
					res.status(404).send('Empty database');
				}
			} catch (error) {
				console.error(error);
				res.status(500).send('Error fetching user');
			}
		});

		app.get('/users/show/:name', async (req, res) => {
			try {
				const userName = req.params.name;
				const user = await coll.findOne({ name: userName });

				if (user) {
					res.send(user);
				} else {
					res.status(404).send(`User ${userName} not found`);
				}
			} catch (error) {
				console.error(error);
				res.status(500).send('Error fetching user');
			}
		});

		app.listen(3000, () => console.log('Server works at port 3000'));
	} catch (error) {
		console.log('Error', error);
		process.exit(1);
	}
};

startServer();
