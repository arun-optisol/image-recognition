const { searchByName, getById } = require('../db/labels')

const labelsController = {}

/**
 *
 * @param {*} req express request
 * @param {*} res express response
 */
labelsController.getLabelsByCategory = async (req, res) => {
	try {
		let labels = req.query.labels
		if (!labels || !(typeof labels === 'string')) {
			res.status(400).send('Invalid params. No labels detected.')
			return
		}
		if (labels.length > 100 || !/^[a-zA-Z0-9,\s]*$/.test(labels)) {
			res.status(400).send(
				'Search key has more than 100 characters or non alphanumeric characters.'
			)
			return
		}
		let searchKey = labels
			.split(',')
			.map((e) => e.trim())
			.filter((e) => e.length)
		let results = await searchByName(searchKey)
		res.status(200).send(results)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal server error')
	}
}
/**
 *
 * @param {*} req express request
 * @param {*} res express response
 */
labelsController.getLabelsDetailsById = async (req, res) => {
	try {
		let {imageId, requestId} = req.query
		if(!imageId && !requestId){ //query params will always be string
			res.status(400).send('Invalid params. No imageId or requestId detected.')
			return
		}
		let resp = await getById(imageId, requestId)
		res.status(200).send(resp)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal server error')
	}
}

module.exports = labelsController
