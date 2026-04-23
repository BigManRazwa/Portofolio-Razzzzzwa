import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || ''
const rawStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''
const fallbackStorageBucket = projectId ? `${projectId}.appspot.com` : ''
const storageBucket = rawStorageBucket.endsWith('.firebasestorage.app')
  ? fallbackStorageBucket || rawStorageBucket.replace(/\.firebasestorage\.app$/, '.appspot.com')
  : rawStorageBucket || fallbackStorageBucket

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId,
  storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseProjectId = firebaseConfig.projectId || ''
export const firebaseStorageBucket = firebaseConfig.storageBucket || ''

export const isFirebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every(Boolean)

if (!isFirebaseConfigured) {
  console.warn('Firebase environment variables are missing. Falling back to local auth mode.')
}

export const firebaseApp = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null

export const analyticsPromise =
  typeof window !== 'undefined' && firebaseApp
    ? isAnalyticsSupported()
        .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
        .catch(() => null)
    : Promise.resolve(null)
