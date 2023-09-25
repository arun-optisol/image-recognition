const { connect, client, isConnected } = require('./connect')

const processDB = {}

/**
 *
 * @param {Array} labels array of labels
 */
processDB.insertMultipleLabels = async (labels) => {
	try {
        console.log(JSON.stringify(labels, null, 2));
        let isconn = isConnected()
		if (!isconn) {
			await connect()
		}
		await client.db('image-recognition').collection('labels').insertMany(labels)
	} catch (error) {
        console.error('Error while inserting labels in DB.');
		throw error
	}
}

module.exports = processDB
