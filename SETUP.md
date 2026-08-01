# Lumen AI - Complete Authentication Setup Guide

## 🎯 Overview

This project now uses **Supabase** for production-grade authentication and session management. All passwords are encrypted, and user sessions persist across page refreshes.

---

## 📋 Prerequisites

- A GitHub account (already connected via MCP)
- A Supabase account (free tier available at https://supabase.com)

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Enter project name: `lumen-ai`
4. Set a strong database password
5. Select your region (closest to you)
6. Click **"Create new project"** (wait ~2 minutes)

### Step 2: Get Your Credentials

1. Once project is created, go to **Settings** (bottom left)
2. Click **"API"**
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Key** (under "Project API keys")

### Step 3: Update Your Project Files

Create a `.env.local` file in your project root:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Update config.js

Edit `config.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 5: Enable Email Auth in Supabase

1. In Supabase Dashboard, go to **Authentication** (left sidebar)
2. Click **"Providers"**
3. Make sure **"Email"** is toggled **ON**
4. Go to **"Email Templates"**
5. Customize confirmation email if needed (optional)

### Step 6: Enable Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Google**
3. Add the Google client ID and client secret from Google Cloud Console
4. Add these redirect URLs in **Authentication** > **URL Configuration**:
  - `http://localhost:8000/auth-callback.html`
  - Your deployed callback URL, for example `https://your-domain.com/auth-callback.html`

### Step 7: Test Locally

1. Open `http://localhost:8000` (or your local server)
2. Click **"Get Started"** or go to `/signup.html`
3. Create a test account
4. You should be redirected to `/profile.html`
5. Click **"Log out"** to test logout

---

## 🔐 Security Features Implemented

✅ **Password Hashing**: Supabase handles all password hashing automatically  
✅ **Session Persistence**: Users stay logged in after refresh  
✅ **Protected Routes**: Only authenticated users can access `/profile.html`  
✅ **Email Validation**: Server-side validation prevents invalid emails  
✅ **HTTPS-Ready**: All traffic encrypted in production  
✅ **CORS Handling**: Supabase handles cross-origin requests safely  

---

## 📁 Project Files Overview

| File | Purpose |
|------|---------|
| `config.js` | Supabase client initialization |
| `auth.js` | Authentication logic (signup, login, logout) |
| `route-protection.js` | Protects `/profile.html` from unauthorized access |
| `login.html` | Login form |
| `signup.html` | Signup form with validation |
| `profile.html` | User dashboard (protected route) |
| `index.html` | Homepage (shows auth state) |

---

## 🧪 Testing Scenarios

### Test 1: Sign Up → Login → Profile → Logout
1. Go to `/signup.html`
2. Enter name, email, password
3. Confirm password matches
4. Should redirect to `/profile.html`
5. Click "Log out"
6. Should redirect to `/index.html`

### Test 2: Password Validation
1. Try signup with password < 6 characters
2. Should show error: "Password must be at least 6 characters"

### Test 3: Email Validation
1. Try login with invalid email
2. Should show error: "Please enter a valid email address"

### Test 4: Protected Routes
1. Try accessing `/profile.html` without logging in
2. Should redirect to `/login.html`

### Test 5: Session Persistence
1. Log in successfully
2. Refresh the page
3. Should still be logged in
4. User info should display

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
cd C:\Users\USER\Business-Website
git push origin main
# Then connect to Vercel at https://vercel.com/new
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify init
netlify deploy
```

### Option 3: GitHub Pages (Static Site)
```bash
git push origin main
# Enable GitHub Pages in repository settings
```

**Note:** Set environment variables on your deployment platform:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## 🔍 Troubleshooting

### Issue: "Supabase client not loaded"
**Solution**: Make sure `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` is in your HTML files.

### Issue: "Cannot read property 'signUp' of undefined"
**Solution**: Ensure `config.js` is loaded before `auth.js`.

### Issue: Login/signup not working
**Solution**:
1. Check browser console for errors (F12 → Console)
2. Verify Supabase URL and Key are correct
3. Check that Email auth is enabled in Supabase Dashboard

### Issue: Session not persisting after refresh
**Solution**: Check browser localStorage:
1. Open DevTools (F12)
2. Application > Local Storage
3. You should see `lumen_current_user` key

---

## 📚 API Reference

### Auth Functions

```javascript
// Sign up
const result = await signupUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
});
// Returns: { success, user, error, message }

// Login
const result = await loginUser('john@example.com', 'password123');
// Returns: { success, user, error }

// Logout
const result = await logoutUser();
// Returns: { success, error }

// Get current user
const user = getCurrentUser();
// Returns: { id, email, name, createdAt } or null

// Check if authenticated
const isLoggedIn = isAuthenticated();
// Returns: true or false

// Listen for auth changes
const unsubscribe = onAuthChange((event) => {
  console.log(event.type); // 'LOGIN', 'LOGOUT', 'SIGNUP'
  if (event.user) console.log(event.user);
});
```

---

## 🔐 Password Requirements

- **Minimum 6 characters** (enforced server & client-side)
- Case-sensitive
- Stored securely with bcrypt hashing
- Cannot be viewed after creation (security best practice)

---

## 📱 Responsive Design

All auth pages are mobile-friendly and work on:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

---

## 🆘 Support

- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: Create an issue on GitHub
- **Contact**: See `/contact.html`

---

## 📄 License

This project is proprietary. All rights reserved.

---

## ✅ Checklist Before Deployment

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] Tested signup flow
- [ ] Tested login flow
- [ ] Tested logout flow
- [ ] Tested route protection
- [ ] Tested session persistence
- [ ] All tests pass
- [ ] Environment variables set on deployment platform
- [ ] Deployed successfully

---

**Last Updated**: 2026-07-26  
**Version**: 1.0.0 (Production Ready)
