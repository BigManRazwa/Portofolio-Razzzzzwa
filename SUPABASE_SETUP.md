# 🚀 Supabase Image Storage Setup Guide

This guide will help you set up Supabase to handle image storage for your portfolio project while keeping Firebase for authentication and other services.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Create Supabase Project](#step-1-create-supabase-project)
3. [Step 2: Install Dependencies](#step-2-install-dependencies)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Create Storage Bucket](#step-4-create-storage-bucket)
6. [Step 5: Test & Verify](#step-5-test--verify)
7. [Usage Examples](#usage-examples)

---

## Prerequisites

- Supabase account (free at https://supabase.com)
- Node.js installed
- Your Firebase project still running
- Git for version control

---

## Step 1: Create Supabase Project

### 1.1 Sign up / Login to Supabase
- Go to [https://supabase.com](https://supabase.com)
- Click "Sign Up" or "Sign In"
- Create/Login to your account

### 1.2 Create New Project
1. Click "New Project"
2. Fill in the project details:
   - **Name**: `portfolio-project` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., `us-east-1` or `ap-southeast-1`)
3. Click "Create New Project"
4. Wait for the project to initialize (2-5 minutes)

### 1.3 Get Your Credentials
1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** → This is your `SUPABASE_URL`
   - **Project API keys**:
     - Copy the **`anon` public key** → For client (`VITE_SUPABASE_ANON_KEY`)
     - Copy the **`service_role` secret key** → For server (`SUPABASE_SERVICE_KEY`)

⚠️ **IMPORTANT**: Keep `service_role` key secret! Only use on backend.

---

## Step 2: Install Dependencies

### Client Side

```bash
cd client
npm install @supabase/supabase-js
```

✅ Already installed! Just verify it's in `package.json`

### Server Side

```bash
cd server
npm install @supabase/supabase-js multer
```

**Explanation**:
- `@supabase/supabase-js`: Supabase client for Node.js
- `multer`: Middleware for handling file uploads

---

## Step 3: Configure Environment Variables

### Client Configuration

#### 3.1 Create `.env.local` in `client/` folder

```bash
cp client/.env.example client/.env.local
```

#### 3.2 Update `client/.env.local` with your credentials

```env
# Firebase (keep existing)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Supabase (add these)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Server Configuration

#### 3.3 Create `.env` in `server/` folder

```bash
cp server/.env.example server/.env
```

#### 3.4 Update `server/.env` with your credentials

```env
# Firebase (keep existing)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_cert_url

# Supabase (add these)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Server
PORT=5000
NODE_ENV=development
```

---

## Step 4: Create Storage Bucket

### 4.1 Via Supabase Dashboard (Recommended for first setup)

1. Go to your Supabase Dashboard
2. Click **Storage** (left sidebar)
3. Click **Create New Bucket**
4. Enter bucket name: `portfolio-images`
5. Toggle **Public bucket** ON (so images are accessible publicly)
6. Click **Create**

### 4.2 Via Backend API Call (Optional)

Once your server is running, make an API request:

```bash
curl -X POST http://localhost:5000/api/images/init
```

---

## Step 5: Test & Verify

### 5.1 Start the services

**Terminal 1 - Backend:**
```bash
cd server
npm install  # if you just added multer
npm run dev
```

You should see:
```
✓ Server running on http://localhost:5000
✓ Health check available at /api/health
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
✓ Local: http://localhost:5173
```

### 5.2 Test Backend Upload

```bash
# Create a test image file or use an existing one
curl -X POST http://localhost:5000/api/images/upload \
  -F "file=@/path/to/test-image.jpg" \
  -F "folder=general"
```

Expected response:
```json
{
  "success": true,
  "url": "https://your-project.supabase.co/storage/v1/object/public/portfolio-images/general/timestamp-random-filename.jpg",
  "path": "general/timestamp-random-filename.jpg",
  "fileName": "test-image.jpg"
}
```

### 5.3 Verify in Supabase Dashboard

1. Go to **Storage** in Supabase Dashboard
2. Click **portfolio-images** bucket
3. You should see your uploaded image in the `general/` folder
4. Click the file and verify it's publicly accessible

---

## Usage Examples

### Client-Side Image Upload

#### Using file input:

```jsx
import { handleImageUpload } from '@/services/imageUploadUtils'

function ImageUploader() {
  const handleUpload = async (event) => {
    const result = await handleImageUpload(event, 'projects')
    
    if (result.success) {
      console.log('Image uploaded:', result.url)
      // Use result.url for your image
    } else {
      console.error('Upload failed:', result.error)
    }
  }

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleUpload}
    />
  )
}
```

#### Batch upload:

```jsx
import { batchUploadImages } from '@/services/imageUploadUtils'

async function uploadMultipleImages(files) {
  const results = await batchUploadImages(files, 'gallery')
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✓ ${result.fileName}: ${result.url}`)
    } else {
      console.log(`✗ ${result.fileName}: ${result.error}`)
    }
  })
}
```

### Server-Side Image Upload

```javascript
const { uploadImage } = require('./controllers/imageController')
const express = require('express')
const multer = require('multer')

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.post('/upload', upload.single('file'), uploadImage)
```

### List Images in a Folder:

```jsx
import { listImages } from '@/services/supabaseStorage'

async function getProjectImages() {
  const result = await listImages('projects')
  
  if (result.success) {
    result.files.forEach(file => {
      console.log(file.name, file.url)
    })
  }
}
```

### Delete Image:

```jsx
import { deleteImage } from '@/services/supabaseStorage'

async function removeImage(filePath) {
  const result = await deleteImage(filePath)
  
  if (result.success) {
    console.log('Image deleted')
  }
}
```

---

## 📁 File Structure

```
client/
├── .env.local (✨ Create this)
├── src/
│   └── services/
│       ├── firebase.js (existing)
│       ├── supabase.js (existing)
│       ├── supabaseStorage.js (✨ NEW - image operations)
│       └── imageUploadUtils.js (✨ NEW - helper functions)

server/
├── .env (✨ Create this)
├── src/
│   ├── controllers/
│   │   ├── healthController.js (existing)
│   │   └── imageController.js (✨ NEW - upload handler)
│   ├── services/
│   │   ├── firebase.js (existing)
│   │   └── supabase.js (✨ NEW - Supabase client)
│   └── routes/
│       └── index.js (✨ UPDATED - added image routes)
```

---

## 🔗 API Endpoints

### Upload Image
```
POST /api/images/upload
Content-Type: multipart/form-data

Form data:
- file: (image file)
- folder: (optional, default: 'general')

Response:
{
  "success": true,
  "url": "https://...",
  "path": "folder/filename",
  "fileName": "original-name.jpg"
}
```

### List Images
```
GET /api/images/:folder

Response:
{
  "success": true,
  "files": [
    {
      "name": "filename.jpg",
      "url": "https://...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Delete Image
```
DELETE /api/images/:folder/:filename

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API credentials copied to `.env` files
- [ ] `portfolio-images` bucket created
- [ ] Multer installed on server (`npm install multer`)
- [ ] Backend server running (`npm run dev` in server folder)
- [ ] Frontend running (`npm run dev` in client folder)
- [ ] Test upload successful
- [ ] Image visible in Supabase Storage dashboard
- [ ] Firebase still working (login, etc.)

---

## 🆘 Troubleshooting

### "Supabase environment variables are missing"
- Check `.env.local` (client) and `.env` (server) exist
- Verify all keys are copied correctly
- Restart dev server after creating `.env` files

### Upload fails with 403 error
- Check bucket is set to **Public**
- Verify `SUPABASE_SERVICE_KEY` is the **service_role** key (not anon)

### CORS errors
- Make sure bucket is **Public**
- Check Supabase Storage **Policies** aren't blocking access

### Multer error "Cannot find module"
- Run `npm install multer` in server folder
- Check package.json has multer listed

### Images not showing up
- Verify bucket name is exactly `portfolio-images`
- Check folder permissions in Storage
- Try accessing URL directly in browser

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Multer Documentation](https://github.com/expressjs/multer)

---

## 💡 Next Steps

1. ✅ Follow this guide to set up Supabase
2. ✅ Test uploads work
3. ✅ Integrate image uploads into your components
4. ✅ Consider setting up auto-scaling for high-traffic scenarios
5. Consider CDN caching for better performance

---

Good luck! 🎉 Let me know if you have any questions!
