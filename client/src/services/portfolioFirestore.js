import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseDb } from './firebase'

const PORTFOLIO_DOC_PATH = ['portfolio', 'main']

export const portfolioDocRef = firebaseDb ? doc(firebaseDb, ...PORTFOLIO_DOC_PATH) : null

export async function loadPortfolioContent() {
  if (!portfolioDocRef) {
    return null
  }

  const snapshot = await getDoc(portfolioDocRef)
  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data()
}

function sanitizeForFirestore(value) {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const valueType = typeof value
  if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => sanitizeForFirestore(entry))
      .filter((entry) => entry !== undefined)
  }

  if (valueType === 'object') {
    // Keep Firestore Timestamp/FieldValue-like objects untouched.
    if (typeof value.toDate === 'function' || typeof value.isEqual === 'function') {
      return value
    }

    const next = {}
    for (const [key, nestedValue] of Object.entries(value)) {
      const sanitized = sanitizeForFirestore(nestedValue)
      if (sanitized !== undefined) {
        next[key] = sanitized
      }
    }
    return next
  }

  return undefined
}

export async function savePortfolioContent(content) {
  if (!portfolioDocRef) {
    throw new Error('Firestore is not configured.')
  }

  const sanitizedContent = sanitizeForFirestore(content)

  await setDoc(
    portfolioDocRef,
    {
      ...sanitizedContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
