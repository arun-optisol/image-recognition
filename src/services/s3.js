const fs = require('fs')
const AWS = require('aws-sdk')
const S3 = new AWS.S3({
	region: process.env.DEFAULT_AWS_REGION || 'ap-south-1'
})
const BUCKET_NAME = process.env.BUCKET_NAME || 'arun-practice'
const BUCKET_PREFIX = process.env.BUCKET_PREFIX || 'image-recognition/assets/'

/**
 *
 * @param {*} file content data
 */
const S3Service = {}

S3Service.uploadFiles = async (file) => {
	try {
        const fileStream = fs.createReadStream(file.path)
		return S3.upload({
            Bucket: BUCKET_NAME,
            Key: `${BUCKET_PREFIX}${file.filename}`,
            Body: fileStream
        }).promise()
	} catch (error) {
		throw error
	}
}

module.exports = S3Service
