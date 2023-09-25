const fs = require('fs')

exports.deleteFile = async function deleteFile(filePath) {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error(`Error when deleting file:: ${filePath}:: ${err}`)
		} else {
			console.log(`File delete successfully:: ${filePath}`)
		}
	})
}

/**
 *
 * @param {*} input array of input
 * @param {*} output output of Promise.allsettled
 * @param {*} expireAt date to delete document from db
 * @param {*} processImmediate boolean to indicate process immediate or batch
 */
exports.buildLabelsResponseFromPromises = (
	input,
	output,
	expireAt,
	processImmediate,
	requestId
) => {
	let response = {
		partialSuccess: false,
		success: [],
		failure: [],
		requestId
	}
	let dbEntries = []
	try {
		output.forEach((data, index) => {
			let imageId = input[index].filename
			let fileName = input[index].originalname
			if (data.status == 'fulfilled') {
				let temp = {
					imageId,
					fileName,
					labels: [],
					categories: [],
					expireAt,
					processImmediate
				}
				data.value.Labels.forEach((label) => {
					temp.labels.push(label.Name)
					temp.categories.push(...label.Categories.map((c) => c.Name))
				})
				response.success.push(temp)
				dbEntries.push({
					imageId,
					...data.value,
					expireAt,
					fileName,
					processImmediate,
					requestId
				})
			} else {
				response.partialSuccess = true
				response.failure.push({ imageId, fileName })
			}
		})
		return { response, dbEntries }
	} catch (error) {
		throw error
	}
}

exports.buildQueueResponseFromPromises = (
	input,
	output,
	expireAt,
	processImmediate,
	requestId
) => {
	let response = {
		partialSuccess: false,
		success: [],
		failure: [],
		requestId
	}
	let queueEntries = []
	try {
		output.forEach((data, index) => {
			let imageId = input[index].filename
			let fileName = input[index].originalname
			if (data.status == 'fulfilled') {
				let temp = {
					imageId,
					fileName,
					expireAt,
					processImmediate
				}
				response.success.push(temp)
				queueEntries.push({
					imageId,
					...data.value,
					expireAt,
					fileName,
					processImmediate,
					requestId
				})
			} else {
				response.partialSuccess = true
				response.failure.push({ imageId, fileName })
			}
		})
		return { response, queueEntries }
	} catch (error) {
		throw error
	}
}

exports.buildDBResponseFromPromises = (input, output, expireAt) => {
	let dbEntries = []
	try {
		output.forEach((data, index) => {
			let message = input[index]
			if (data.status == 'fulfilled') {
				let temp = {
					imageId: message.imageId,
					fileName: message.fileName,
					expireAt,
					processImmediate: message.processImmediate,
					requestId: message.requestId,
					...data.value,
					Location: message.Location,
					Key: message.Key,
					key: message.key,
					Bucket: message.Bucket,
					ETag: message.ETag,
				}
				dbEntries.push(temp)
			}
		})
		return { dbEntries }
	} catch (error) {
		throw error
	}
}
