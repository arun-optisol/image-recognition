const fs = require('fs')
const AWS = require('aws-sdk')
const REKOGNITION = new AWS.Rekognition({
	region: process.env.DEFAULT_AWS_REGION || 'ap-south-1'
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

/**
 * 
 * @param {*} message message from sqs
 * @returns 
 */
rekognitionService.detectLabelsFromS3 = async (message) => {
	try {
		return REKOGNITION.detectLabels({
			Image:{
				S3Object: {
					Bucket: message.Bucket,
					Name: message.Key,
				}
			}
		}).promise()
	} catch (error) {
		throw error
	}
}

module.exports = rekognitionService
