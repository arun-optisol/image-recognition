const fs = require('fs')
const AWS = require('aws-sdk')
const REKOGNITION = new AWS.Rekognition({
	region: process.env.AWS_REGION || 'ap-south-1'
})

/**
 *
 * @param {*} filePath path of content
 */
const rekognitionService = {}

rekognitionService.getLabels = async (filePath) => {
	try {
		return REKOGNITION.detectLabels({
			Image: {
				Bytes: fs.readFileSync(filePath)
			}
		}).promise()
	} catch (error) {
		throw error
	}
}

module.exports = rekognitionService
