const fs = require('fs')
const AWS = require('aws-sdk')
const SQS = new AWS.SQS({
	region: process.env.AWS_REGION || 'ap-south-1'
})
const QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/036986051218/DetectImageLabelsQueue-dev" || 'arun-practice'

/**
 *
 * @param {*} event message context
 */
const S3Service = {}

S3Service.insertIntoLabelsQueue = async (event) => {
	try {
		await SQS.sendMessage({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(event)
        }).promise()
	} catch (error) {
		throw error
	}
}

module.exports = S3Service
