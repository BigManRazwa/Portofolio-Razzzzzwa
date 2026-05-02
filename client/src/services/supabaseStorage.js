import { supabase } from './supabase'

const BUCKET_NAME = 'PotoPoto'

/**
 * Initialize Supabase storage bucket
 * This function creates the bucket if it doesn't exist
 */
export const initializeStorageBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket(
        BUCKET_NAME,
        { public: true }
      )

      if (error) {
        console.error('Error creating bucket:', error.message)
        return false
      }

      console.log('Storage bucket created successfully')
      return true
    }

    console.log('Storage bucket already exists')
    return true
  } catch (error) {
    console.error('Error initializing storage:', error)
    return false
  }
}

/**
 * Upload image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Folder path (e.g., 'projects', 'gallery')
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<{success: boolean, url: string, error: string}>}
 */
export const uploadImage = async (file, folder = 'general', fileName = null) => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 10MB' }
    }

    // Generate unique file name
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const cleanFileName = fileName || file.name.replace(/\s+/g, '-').toLowerCase()
    const uniqueFileName = `${timestamp}-${randomStr}-${cleanFileName}`
    const filePath = `${folder}/${uniqueFileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error.message)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: publicData.publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete image from Supabase storage
 * @param {string} filePath - Path to the file (returned from upload)
 * @returns {Promise<{success: boolean, error: string}>}
 */
export const deleteImage = async (filePath) => {
  try {
    if (!filePath) {
      return { success: false, error: 'No file path provided' }
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update image (delete old, upload new)
 * @param {string} oldFilePath - Path to old file
 * @param {File} newFile - New image file
 * @param {string} folder - Folder path
 * @returns {Promise<{success: boolean, url: string, error: string}>}
 */
export const updateImage = async (oldFilePath, newFile, folder = 'general') => {
  try {
    // Upload new image first
    const uploadResult = await uploadImage(newFile, folder)

    if (!uploadResult.success) {
      return uploadResult
    }

    // Delete old image
    if (oldFilePath) {
      await deleteImage(oldFilePath)
    }

    return uploadResult
  } catch (error) {
    console.error('Error updating image:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get public URL for a file path
 * @param {string} filePath - Path to the file
 * @returns {string} Public URL
 */
export const getPublicUrl = (filePath) => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * List all images in a folder
 * @param {string} folder - Folder path
 * @returns {Promise<{success: boolean, files: Array, error: string}>}
 */
export const listImages = async (folder = 'general') => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('List error:', error.message)
      return { success: false, error: error.message }
    }

    // Get public URLs for each file
    const filesWithUrls = data.map(file => ({
      name: file.name,
      path: `${folder}/${file.name}`,
      url: getPublicUrl(`${folder}/${file.name}`),
      created_at: file.created_at,
      updated_at: file.updated_at,
      size: file.metadata?.size,
    }))

    return { success: true, files: filesWithUrls }
  } catch (error) {
    console.error('Error listing images:', error)
    return { success: false, error: error.message }
  }
}

export default {
  initializeStorageBucket,
  uploadImage,
  deleteImage,
  updateImage,
  getPublicUrl,
  listImages,
}
