# Firebase Server Setup

## Environment Variables for Vercel

Your server now persists portfolio data to Firebase Firestore. To enable this on Vercel, you need to set one of these environment variables:

### Option 1: Service Account Key (Recommended)
Add this to your Vercel environment variables:

- **Variable Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`
- **Value:** Your Firebase service account JSON key as a string

To get your service account key:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the entire JSON content
6. Paste it as the environment variable value (keep it as single line or multi-line, Vercel will handle it)

### Option 2: GOOGLE_APPLICATION_CREDENTIALS
If you prefer to use a file path instead:
- Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account JSON file

## How It Works

- When the server starts, it loads the portfolio content from Firestore
- When you save changes in the admin dashboard, they're persisted to Firestore
- Server restarts (deployments) no longer lose your data

## Local Development

For local development, you can also set the environment variable in your `.env` file:

```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

## Troubleshooting

If portfolio data isn't persisting:
1. Check Vercel logs for Firebase initialization errors
2. Verify the service account key is set correctly
3. Ensure Firestore rules allow writes (check Firebase Console → Firestore → Rules)
