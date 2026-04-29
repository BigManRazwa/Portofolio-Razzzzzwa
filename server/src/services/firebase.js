const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// This will use FIREBASE_SERVICE_ACCOUNT_KEY (JSON) or GOOGLE_APPLICATION_CREDENTIALS (file path)
let db = null;

try {
  // Check if service account key is provided as environment variable
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    // Parse JSON from environment variable
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    console.log('✓ Firebase Admin initialized with service account key');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use file path if provided
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    db = admin.firestore();
    console.log('✓ Firebase Admin initialized with GOOGLE_APPLICATION_CREDENTIALS');
  } else {
    console.warn('⚠ Firebase service account credentials not found. Portfolio data will not persist.');
  }
} catch (error) {
  console.error('✗ Failed to initialize Firebase Admin:', error.message);
}

const PORTFOLIO_DOC_PATH = ['portfolio', 'main'];

async function loadPortfolioContent() {
  if (!db) {
    console.warn('Firestore not available. Returning empty content.');
    return null;
  }

  try {
    const docRef = db.collection(PORTFOLIO_DOC_PATH[0]).doc(PORTFOLIO_DOC_PATH[1]);
    const snapshot = await docRef.get();
    
    if (!snapshot.exists) {
      console.log('Portfolio document does not exist yet');
      return null;
    }

    const data = snapshot.data();
    console.log('✓ Loaded portfolio content from Firestore');
    return data;
  } catch (error) {
    console.error('✗ Error loading portfolio content:', error.message);
    return null;
  }
}

async function savePortfolioContent(content) {
  if (!db) {
    throw new Error('Firestore is not configured. Cannot save portfolio content.');
  }

  try {
    const docRef = db.collection(PORTFOLIO_DOC_PATH[0]).doc(PORTFOLIO_DOC_PATH[1]);
    
    await docRef.set(
      {
        ...content,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log('✓ Saved portfolio content to Firestore');
    return true;
  } catch (error) {
    console.error('✗ Error saving portfolio content:', error.message);
    throw error;
  }
}

module.exports = {
  loadPortfolioContent,
  savePortfolioContent,
  isFirebaseConfigured: !!db,
};
