const { v4: uuid } = require('uuid')

const {
	deleteFile,
	buildLabelsResponseFromPromises,
	buildQueueResponseFromPromises
} = require('../utils/util')
const rekognitionService = require('../services/rekognition')
const processDB = require('../db/process')
const { uploadFiles } = require('../services/s3')
const { insertIntoLabelsQueue } = require('../services/sqs')

const processController = {}

/**
 *
 * @param {*} req express request
 * @param {*} res express response
 */
processController.processImmediate = async (req, res, next) => {
	try {
		if (!req.files || !req.files.length) {
			res.status(400).send('No files detected.')
			return
		}
		if (req.files.length > 10) {
			res.status(400).send(
				'Upto 10 file is allowed in immediate process. Received more than 10.'
			)
			return
		}
		let promises = req.files.map((file) =>
			rekognitionService.getLabels(file.path)
		)
		let outputPromises = await Promise.allSettled(promises)
		console.log('OUTPUT:::', JSON.stringify(outputPromises, null, 2))
		let now = new Date()
		now.setHours(now.getHours() + 1)
		let requestId = uuid()
		let { response, dbEntries } = buildLabelsResponseFromPromises(
			req.files,
			outputPromises,
			now,
			true,
			requestId
		)
		if (dbEntries && dbEntries.length)
			await processDB.insertMultipleLabels(dbEntries)
		res.status(200).send(response)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal server error')
	} finally {
		if (req.files && req.files.length)
			req.files.forEach((file) => deleteFile(file.path))
	}
}
/**
 *
 * @param {*} req express request
 * @param {*} res express response
 */
processController.processBatch = async (req, res) => {
	try {
		if (!req.files || !req.files.length) {
			res.status(400).send('No files detected.')
			return
		}
		if (req.files.length > 100) {
			res.status(400).send(
				'Upto 100 file is allowed in batch process. Received more than 10.'
			)
			return
		}
		let promises = req.files.map(uploadFiles)
		let outputPromises = await Promise.allSettled(promises)
		console.log('OUTPUT:::', JSON.stringify(outputPromises, null, 2))
		let requestId = uuid()
		let now = new Date()
		now.setHours(now.getHours() + 1)
		let { response, queueEntries } = buildQueueResponseFromPromises(
			req.files,
			outputPromises,
			now,
			false,
			requestId
		)
		if (queueEntries && queueEntries.length)
			await insertIntoLabelsQueue(queueEntries)
		res.status(200).send(response)
	} catch (error) {
		console.error(error)
		res.status(500).send('Internal server error')
	} finally {
		if (req.files && req.files.length)
			req.files.forEach((file) => deleteFile(file.path))
	}
}

module.exports = processController
