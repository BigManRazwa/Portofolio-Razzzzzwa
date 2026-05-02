const { supabase } = require('../services/supabase')

const BUCKET_NAME = 'PotoPoto'

/**
 * Upload image to Supabase
 * @route POST /api/images/upload
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      })
    }

    const { folder = 'general' } = req.body

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!validTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Accepted: JPEG, PNG, WebP, GIF, SVG',
      })
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit',
      })
    }

    // Generate unique file name
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const cleanFileName = req.file.originalname
      .replace(/\s+/g, '-')
      .toLowerCase()
    const uniqueFileName = `${timestamp}-${randomStr}-${cleanFileName}`
    const filePath = `${folder}/${uniqueFileName}`

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    res.json({
      success: true,
      url: publicData.publicUrl,
      path: data.path,
      fileName: req.file.originalname,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

/**
 * Delete image from Supabase
 * @route DELETE /api/images/:folder/:filename
 */
const deleteImage = async (req, res) => {
  try {
    const { folder, filename } = req.params

    if (!folder || !filename) {
      return res.status(400).json({
        success: false,
        error: 'Folder and filename are required',
      })
    }

    const filePath = `${folder}/${filename}`

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

/**
 * List images in a folder
 * @route GET /api/images/:folder
 */
const listImages = async (req, res) => {
  try {
    const { folder = 'general' } = req.params

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }

    // Get public URLs for each file
    const filesWithUrls = data.map(file => ({
      name: file.name,
      path: `${folder}/${file.name}`,
      url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folder}/${file.name}`).data
        .publicUrl,
      created_at: file.created_at,
      updated_at: file.updated_at,
    }))

    res.json({
      success: true,
      files: filesWithUrls,
    })
  } catch (error) {
    console.error('Error listing images:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

/**
 * Initialize storage bucket
 * @route POST /api/images/init
 */
const initializeBucket = async (req, res) => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

    if (bucketExists) {
      return res.json({
        success: true,
        message: 'Bucket already exists',
      })
    }

    // Create bucket
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
    })

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }

    res.json({
      success: true,
      message: 'Bucket created successfully',
      bucket: data,
    })
  } catch (error) {
    console.error('Error initializing bucket:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

module.exports = {
  uploadImage,
  deleteImage,
  listImages,
  initializeBucket,
}
