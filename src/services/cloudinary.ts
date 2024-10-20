export const uploadToCloudinary = async (file: File) => {
	const formData = new FormData()
	formData.append('file', file)
	formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string)
	formData.append('timestamp', String(Date.now() / 1000))
	formData.append('signature', await generateSignature(file))

	try {
		const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			throw new Error('Failed to upload image to Cloudinary')
		}

		const data = await response.json()
		return data.secure_url
	} catch (error) {
		console.error('Error uploading to Cloudinary:', error)
		throw error
	}
}

const generateSignature = async (file: File) => {
	const response = await fetch('/api/cloudinary-signature', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ filename: file.name, contentType: file.type }),
	})
	const data = await response.json()
	return data.signature
}
