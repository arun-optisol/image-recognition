const MongoClient = require('mongodb').MongoClient
const mongoURI = process.env.MONGO_URI || 'localhost:27017'
const client = new MongoClient(mongoURI, {
	useNewUrlParser: true
})

async function connect() {
	try {
		await client.connect()
	} catch (error) {
		throw error
	}
}

function isConnected() {
	return !!client && !!client.topology && client.topology.isConnected()
}

module.exports = { connect, client, isConnected }
