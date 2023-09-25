const { connect, client, isConnected } = require('./connect')

const labels = {}

/**
 *
 * @param {Array} searchKey array of labels name to search for
 */
labels.searchByName = async (searchKey) => {
	try {
		console.log(JSON.stringify(searchKey, null, 2))
		let isconn = isConnected()
		if (!isconn) {
			await connect()
		}
		let searchResults = await client
			.db('image-recognition')
			.collection('labels')
			.aggregate([
				{
					$search: {
						index: 'labels_search',
						autocomplete: {
							query: searchKey,
							path: 'Labels.Name',
							tokenOrder: 'any',
							fuzzy: {
								maxEdits: 2,
								prefixLength: 1,
								maxExpansions: 50
							}
						}
					}
				}
			])
			.toArray()
		return searchResults
	} catch (error) {
		console.error('Error while inserting labels in DB.')
		throw error
	}
}
/**
 *
 * @param {*} imageId
 */
labels.getById = async (imageId, requestId) => {
	try {
		console.log(JSON.stringify({ imageId, requestId }, null, 2))
		let isconn = isConnected()
		if (!isconn) {
			await connect()
		}
        let filter = {}
        if(imageId) filter.imageId = imageId
        if(requestId) filter.requestId = requestId
		const labels = await client
			.db('image-recognition')
			.collection('labels')
			.find(filter).toArray()
        return labels
	} catch (error) {
		console.error('Error while getting labels in DB.')
		throw error
	}
}

module.exports = labels
