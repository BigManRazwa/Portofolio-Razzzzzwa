import { uploadImage, deleteImage, updateImage, getPublicUrl } from './supabaseStorage'

/**
 * Handle image file selection and upload
 * @param {Event} event - File input change event
 * @param {string} folder - Target folder in storage
 * @returns {Promise<{success: boolean, url: string, error: string}>}
 */
export const handleImageUpload = async (event, folder = 'general') => {
  const files = event.target.files
  
  if (!files || files.length === 0) {
    return { success: false, error: 'No file selected' }
  }

  const file = files[0]
  return uploadImage(file, folder)
}

/**
 * Upload image from URL or blob
 * @param {string|Blob} imageSource - URL or Blob of image
 * @param {string} fileName - File name
 * @param {string} folder - Target folder
 * @returns {Promise<{success: boolean, url: string, error: string}>}
 */
export const uploadFromSource = async (imageSource, fileName, folder = 'general') => {
  try {
    let file

    if (typeof imageSource === 'string') {
      // If it's a URL, fetch it
      const response = await fetch(imageSource)
      const blob = await response.blob()
      file = new File([blob], fileName, { type: blob.type })
    } else if (imageSource instanceof Blob) {
      // If it's a Blob, convert to File
      file = new File([imageSource], fileName, { type: imageSource.type })
    } else {
      return { success: false, error: 'Invalid image source' }
    }

    return uploadImage(file, folder, fileName)
  } catch (error) {
    console.error('Error uploading from source:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Generate optimized image URL with transformations (if using Supabase CDN)
 * @param {string} filePath - Path to the file
 * @param {Object} options - Image transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (filePath, options = {}) => {
  const baseUrl = getPublicUrl(filePath)

  // Supabase CDN image transformation parameters
  const params = new URLSearchParams()

  if (options.width) params.append('width', options.width)
  if (options.height) params.append('height', options.height)
  if (options.quality) params.append('quality', options.quality)
  if (options.format) params.append('format', options.format)

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Validate image before upload
 * @param {File} file - File to validate
 * @returns {{valid: boolean, error: string}}
 */
export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Accepted: JPEG, PNG, WebP, GIF, SVG` 
    }
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit` 
    }
  }

  return { valid: true }
}

/**
 * Batch upload multiple images
 * @param {FileList|Array} files - Files to upload
 * @param {string} folder - Target folder
 * @returns {Promise<Array>} Results array
 */
export const batchUploadImages = async (files, folder = 'general') => {
  const results = []

  for (const file of files) {
    const validation = validateImage(file)
    
    if (!validation.valid) {
      results.push({
        fileName: file.name,
        success: false,
        error: validation.error,
      })
      continue
    }

    const result = await uploadImage(file, folder)
    results.push({
      fileName: file.name,
      ...result,
    })
  }

  return results
}

export default {
  handleImageUpload,
  uploadFromSource,
  getOptimizedImageUrl,
  validateImage,
  batchUploadImages,
}
