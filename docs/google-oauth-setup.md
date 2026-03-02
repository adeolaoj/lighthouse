# Google OAuth 2.0 Setup

This guide explains how to create Google OAuth 2.0 credentials for local development.

## Steps

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name the project (e.g. `lighthouse-dev`) and click **Create**

### 2. Enable the Google Identity API
1. In the sidebar go to **APIs & Services** → **Library**
2. Search for **Google Identity** and enable it

### 3. Configure the OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** and click **Create**
3. Fill in the required fields (App name, support email)
4. Add your email under **Test users**
5. Save and continue through the remaining steps

### 4. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Under **Authorized JavaScript origins** add:
   - `http://localhost:5173`
5. Click **Create**
6. Copy the **Client ID**

### 5. Add to Your Local Environment
In the `frontend/` directory, create a `.env.local` file (gitignored) and add:

```
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

> Never commit `.env.local`. The `.env.example` file documents the required variable name.
