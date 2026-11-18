# Mosaic by Dharini Singh
> **"Every Voice Adds a New Perspective"**  
> An editorial digital storytelling and blogging platform created by **Dharini Singh** (DGU Venture Quest MVP) designed to elevate student, cultural, and regional Indian voices away from algorithmic feeds and into intentional, long-form creative reading.

---

## 🌟 Venture Overview & Architecture

Mosaic provides a dedicated sanctuary for collegiate writers, emerging authors, and cultural observers across India. Built on modern web architecture with robust enterprise security:

- **Single Sign-On (SSO)**: One-click **Continue with Google** via Firebase Authentication (email/password and mock accounts completely removed).
- **Persistent Cloud Database**: Google Cloud Firestore with Attribute-Based Access Control (ABAC) and Zero-Trust security rules.
- **Media Pipeline**: Google Cloud Storage with strict image MIME type validation and file size limits (5MB for story covers, 2MB for avatars).
- **Public Discoverability**: Published stories are open to all readers; story publishing, drafting, bookmarking, and profile management require verified Google authentication.
- **Private Author Sanctuary**: Work-in-progress drafts are strictly isolated to the authenticated author via Firestore ABAC security rules.
- **Single-Page Application (SPA) Routing**: Pre-configured `vercel.json` rewrite rules ensure deep routes (`/explore`, `/profile`, `/categories`, etc.) resolve seamlessly without 404 errors.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component architecture & strict type safety |
| **Build & Dev Tool** | Vite 8 + npm | High-speed compilation & tree-shaking |
| **Styling** | Tailwind CSS v4 + Lucide Icons | Clean editorial typography & responsive design |
| **Authentication** | Firebase Authentication | **Google Sign-In Provider only** |
| **Database** | Google Cloud Firestore | Document database (`users`, `stories`, `drafts`, `bookmarks`) |
| **Media Storage** | Google Cloud Storage | Story covers & profile photos |
| **Deployment & Edge** | Vercel | Production CDN, automatic CI/CD, and SPA rewrites |
| **Security Rules** | `firestore.rules` & `storage.rules` | ABAC document ownership & MIME verification |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: Version 18.x or 20.x recommended
- **npm**: Version 9.x or higher (or Bun / pnpm)
- **Git**: Installed and configured

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/<YOUR-USERNAME>/mosaic-by-dharini-singh.git
cd mosaic-by-dharini-singh

# Install dependencies
npm install
```

### 3. Local Environment Setup
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```
Configure your Firebase Web client credentials (see the [Environment Variables](#4-required-environment-variables-in-vercel) section below).

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Local Production Build Verification
```bash
# Verify TypeScript typing
npm run lint

# Compile production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Step 1: Push Project to GitHub

Before deploying to Vercel, ensure your code is published to a GitHub repository:

```bash
# 1. Initialize Git repository (if not already initialized)
git init
git branch -M main

# 2. Stage all files (excluding files ignored by .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete Mosaic by Dharini Singh full-stack app with Google Sign-In & Firebase"

# 4. Create a new repository on GitHub (e.g. named 'mosaic-by-dharini-singh')
# Do NOT select "Initialize with README", as the project already contains one.

# 5. Link your GitHub remote and push
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/mosaic-by-dharini-singh.git
git push -u origin main
```

---

## 🌐 Step 2: Import GitHub Repository into Vercel

Follow these steps to import and deploy your application on Vercel:

1. **Sign in to Vercel**:
   - Go to [vercel.com](https://vercel.com/) and log in (or sign up) using your **GitHub account**.
2. **Start a New Project**:
   - In your Vercel Dashboard, click the **"Add New..."** button (top right) and select **"Project"**.
3. **Select GitHub Repository**:
   - Under **"Import Git Repository"**, locate `mosaic-by-dharini-singh` (or search for it).
   - Click **"Import"** next to the repository.

---

## ⚙️ Step 3: Specific Build Settings for Vercel

When importing the project, Vercel will prompt you to configure Project Settings. Verify or enter the following settings:

| Setting | Value | Notes |
|---|---|---|
| **Project Name** | `mosaic-by-dharini-singh` | Customizes your default `*.vercel.app` domain |
| **Framework Preset** | **Vite** | Automatically detected from `package.json` |
| **Root Directory** | `./` | Leave empty or `./` (root of the repository) |
| **Build Command** | `npm run build` | Runs `vite build` to output production assets |
| **Output Directory** | `dist` | Vite compiles bundle files into `dist` |
| **Install Command** | `npm install` | Installs all dependencies from `package.json` |
| **Node.js Version** | **20.x** (or 18.x) | Configurable under *Settings > General* in Vercel |

### Why `vercel.json` is Included
The repository already contains a production `vercel.json` file in the root directory:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```
- **SPA Rewrites**: Because Mosaic uses client-side routing, directly refreshing a URL like `/explore`, `/profile`, or `/category/campus-culture` would result in a **404 Not Found** without this rewrite. The rule directs all incoming route requests to `index.html`, allowing the React router to handle the route.
- **Cache Optimization**: Generated JavaScript and CSS assets in `/assets/` are served with immutable 1-year caching for maximum performance.

---

## 🔑 Step 4: Required Environment Variables in Vercel

In the Vercel **Environment Variables** expandable section (during project import or later under *Project Settings > Environment Variables*), add the following keys.

Ensure you check **Production**, **Preview**, and **Development** for each variable:

| Environment Variable | Description | Example Format |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain | `your-project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Google Cloud / Firebase Project ID | `your-project-id` |
| `VITE_FIREBASE_DATABASE_ID` | **Named Firestore Database ID** *(if non-default)* | `your-firestore-database-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Google Cloud Storage Bucket Name | `your-project-id.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging Sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase Web Application ID | `1:123456789012:web:abcdef123456` |

> ⚠️ **Important Note on `VITE_FIREBASE_DATABASE_ID`**:  
> If your project uses a named Firestore Database instance rather than `(default)`, make sure `VITE_FIREBASE_DATABASE_ID` is set to that database ID (found in Firebase Console → Firestore Database) so the SDK binds to the correct database instance.

Once added, click **"Deploy"**. Vercel will clone your GitHub repository, install packages, compile the Vite app, and assign your public production URL (e.g. `https://mosaic-by-dharini-singh.vercel.app`).

---

## 🔒 Step 5: Authorize Vercel Domain in Firebase (CRITICAL)

By default, Google Authentication rejects sign-in attempts from domains that have not been explicitly whitelisted in the Firebase Console. If this step is skipped, clicking **"Continue with Google"** on your Vercel site will trigger an `auth/unauthorized-domain` error.

### How to Authorize Your Vercel Domain:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project.
3. In the left-hand sidebar under **Build**, click **Authentication**.
4. Click on the **Settings** tab along the top (next to *Users* and *Sign-in method*).
5. Scroll down to the **Authorized domains** card.
6. Click **Add domain**.
7. Enter your Vercel deployment domain without `https://` (for example: `mosaic-by-dharini-singh.vercel.app`).
8. If you have custom domains assigned in Vercel (e.g., `mosaic.dharinisingh.com`), add those as well.
9. Click **Save**.

Your live Vercel deployment can now securely authenticate users with Google Sign-In!

---

## 🛡️ Database Schema & Security Architecture

Mosaic enforces Zero-Trust, Attribute-Based Access Control (ABAC) in `firestore.rules`:

### Firestore Collections:
- **`/users/{userId}`**: User profile document containing `displayName`, `email`, `photoURL`, `bio`, `role`, and timestamps. Only the authenticated user can update their own profile.
- **`/stories/{storyId}`**: Editorial stories. Anyone (including unauthenticated visitors) can read published stories (`resource.data.status == 'published'`). Only the authenticated author (`request.auth.uid == resource.data.authorId`) can create, edit, or delete their stories.
- **`/drafts/{draftId}`**: Private works-in-progress. Strictly private: readable, writable, and deletable ONLY by the author who created the draft.
- **`/bookmarks/{bookmarkId}`**: Private reader bookmarks. Only accessible by the owner of the bookmark.

### Storage Rules:
- Enforced in `storage.rules`:
  - **`/stories/{storyId}/*`**: Image files only (JPEG, PNG, WebP, GIF), maximum size 5MB, authenticated user only.
  - **`/avatars/{userId}/*`**: Image files only, maximum size 2MB, authenticated user matching `{userId}` only.

---

## 🧪 Post-Deployment Verification Checklist

Once deployed on Vercel, verify the following core flows:

1. **Public Reading**: Open the Vercel URL in an Incognito/Private window while logged out. Verify that featured stories, explore feed, and category filters are readable.
2. **Google Sign-In**: Click **"Continue with Google"** in the top navigation or auth modal. Confirm the Google OAuth popup opens and successfully signs you in.
3. **Profile Sync**: Confirm your Google display name, email, and avatar appear in the navigation and on the **"My Profile"** page.
4. **Publish Story**: Click **"Write a Story"**, fill in the title, category, and content, and click **Publish**. Confirm it appears in the live feed and in Firestore.
5. **Private Drafts**: Save a draft and verify it shows only under your profile drafts tab and cannot be accessed by other users.
6. **SPA Route Refresh**: Navigate to `/explore` or `/profile` and refresh the browser (F5 / Cmd+R). Confirm the page loads cleanly with no 404 error.
7. **Sign Out**: Click your profile pill and choose **Sign Out**. Confirm you are redirected to the homepage and navigation returns to the logged-out state.

---

## 📁 Project Structure

```text
├── .env.example              # Placeholder environment variable template
├── firestore.rules           # ABAC Firestore security rules
├── storage.rules             # Media upload security rules
├── vercel.json               # Vercel SPA routing rewrites & asset caching
├── package.json              # App scripts and dependencies
├── vite.config.ts            # Vite 8 build & server configuration
├── index.html                # HTML entry point with metadata & fonts
├── src/
│   ├── App.tsx               # Primary app shell & view controller
│   ├── main.tsx              # React DOM entry point
│   ├── types.ts              # Story, User, Category, and Draft TypeScript models
│   ├── context/
│   │   └── AppContext.tsx    # Firebase Auth state & Firestore live subscriptions
│   ├── services/
│   │   ├── firebaseConfig.ts # Firebase SDK initialization with custom DB ID
│   │   └── firebaseService.ts# Google Auth, Firestore CRUD, & Storage utilities
│   ├── components/
│   │   ├── Navbar.tsx        # Responsive navigation with Google login & profile pill
│   │   ├── Footer.tsx        # Editorial footer & branding
│   │   ├── AuthModal.tsx     # One-click "Continue with Google" dialog
│   │   ├── StoryCard.tsx     # Editorial story card component
│   │   ├── DraftModal.tsx    # Author drafting & editing interface
│   │   └── BookmarkButton.tsx# Personalized story bookmarking
│   └── pages/
│       ├── HomePage.tsx      # Editorial landing hero, featured stories, categories
│       ├── ExplorePage.tsx   # Search, category filters, and story grid
│       ├── StoryDetailPage.tsx # Long-form typography reading experience
│       ├── WriteStoryPage.tsx# Story creator with real-time word count & autosave
│       └── ProfilePage.tsx   # User profile, published stories, & private drafts
```

---

## 📄 License & Attribution

Created by **Dharini Singh** for the **DGU Venture Quest MVP** presentation.  
Developed on Google AI Studio • Hosted on Vercel • Powered by Firebase.  
All rights reserved © 2026.
