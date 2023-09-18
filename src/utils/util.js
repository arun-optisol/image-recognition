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
 */
exports.buildResponseFromPromises = (input, output, expireAt) => {
	let response = {
		partialSuccess: false,
		success: [],
		failure: []
	}
	let dbEntries = []
	try {
		output.forEach((data, index) => {
			if (data.status == 'fulfilled') {
				let imageId = input[index].filename
				let fileName = input[index].originalname
				let temp = {
					imageId,
					fileName,
					labels: [],
					categories: [],
					expireAt
				}
				data.value.Labels.forEach((label) => {
					temp.labels.push(label.Name)
					temp.categories.push(...label.Categories.map((c) => c.Name))
				}),
					response.success.push(temp)
				dbEntries.push({ imageId, ...data.value, expireAt, fileName })
			} else {
				response.partialSuccess = true
				response.failure.push({ id: input.filename })
			}
		})
		return { response, dbEntries }
	} catch (error) {
		throw error
	}
}
