import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from './firebase'

function safeSegment(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizePath(path) {
  const segments = String(path || '')
    .split('/')
    .map((segment) => safeSegment(segment))
    .filter(Boolean)

  return segments.length ? segments.join('/') : 'portfolio/uploads'
}

export async function uploadPortfolioImage(file, bucketPath) {
  if (!firebaseStorage) {
    throw new Error('Firebase Storage is not configured.')
  }

  const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg'
  const timestamp = Date.now()
  const fileName = `${safeSegment(file.name.replace(/\.[^/.]+$/, '')) || 'image'}-${timestamp}.${extension}`
  const objectPath = `${normalizePath(bucketPath)}/${fileName}`
  const objectRef = ref(firebaseStorage, objectPath)

  await uploadBytes(objectRef, file, { contentType: file.type || 'image/jpeg' })
  return getDownloadURL(objectRef)
}

export function fileToDataUrl(file) {
  if (!file) {
    return Promise.reject(new Error('No file provided.'))
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read file.'))
    reader.readAsDataURL(file)
  })
}
