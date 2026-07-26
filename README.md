# Lumen AI - Interactive 3D Product Experiences

A modern, production-ready business website with **complete authentication system**, secure user sessions, and protected routes.

## ✨ Features

- 🔐 **Secure Authentication** - Supabase-based login/signup with encrypted passwords
- 👤 **User Sessions** - Persistent login across page refreshes
- 🚀 **Protected Routes** - User dashboard accessible only to logged-in users
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Production-Ready** - Ready to deploy to Vercel, Netlify, or GitHub Pages
- 🔒 **Security Best Practices** - Password hashing, input validation, error handling

## 📚 Quick Start

### Prerequisites
- Supabase account (free at https://supabase.com)
- A modern web browser
- Git and GitHub account

### Setup (5 minutes)

1. **Clone the repository**
   ```bash
   git clone https://github.com/NonchalantGamer/Business-Website.git
   cd Business-Website
   ```

2. **Create Supabase project** (see [SETUP.md](./SETUP.md) for detailed steps)

3. **Configure credentials**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and Anon Key

4. **Run locally**
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

## 🗂️ Project Structure

```
Business-Website/
├── index.html              # Homepage
├── login.html              # Login page
├── signup.html             # Signup page
├── profile.html            # Protected user dashboard
│
├── auth.js                 # Authentication logic
├── config.js               # Supabase configuration
├── route-protection.js     # Route protection middleware
│
├── styles.css              # Global styles
├── script.js               # General utilities
├── components.js           # Shared components (header, footer)
│
├── SETUP.md                # Detailed setup guide
├── .env.example            # Environment variables template
└── .gitignore              # Git ignore rules
```

## 🔐 Authentication Flow

### Signup
1. User enters name, email, password, confirm password
2. Client validates input (email format, password length)
3. Request sent to Supabase
4. Supabase hashes password with bcrypt
5. User account created in database
6. Session token stored in browser
7. User redirected to `/profile.html`

### Login
1. User enters email and password
2. Client validates input
3. Request sent to Supabase
4. Supabase verifies credentials
5. Session token stored in browser
6. User redirected to `/profile.html`

### Protected Routes
- **`/profile.html`** - Requires authentication
- Public pages redirect to `/login.html` if accessed without auth

## 📋 API Reference

### Authentication Functions

```javascript
// Sign up
const result = await signupUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
});
// Returns: { success: true|false, user, error, message }

// Login
const result = await loginUser('john@example.com', 'password123');
// Returns: { success: true|false, user, error }

// Logout
const result = await logoutUser();
// Returns: { success: true|false, error }

// Get current user
const user = getCurrentUser();
// Returns: { id, email, name, createdAt } | null

// Check authentication
const isLoggedIn = isAuthenticated();
// Returns: true | false

// Listen for auth changes
const unsubscribe = onAuthChange((event) => {
  console.log(event.type); // 'LOGIN', 'LOGOUT', 'SIGNUP'
  console.log(event.user); // User object
});
```

## 🧪 Testing

### Test Scenarios

1. **Signup Flow**
   - Navigate to `/signup.html`
   - Enter valid credentials
   - Should redirect to `/profile.html`

2. **Login Flow**
   - Navigate to `/login.html`
   - Enter valid email/password
   - Should redirect to `/profile.html`

3. **Session Persistence**
   - Login successfully
   - Refresh page
   - User should remain logged in

4. **Route Protection**
   - Try accessing `/profile.html` without login
   - Should redirect to `/login.html`

5. **Logout**
   - From `/profile.html`, click "Log out"
   - Should redirect to `/index.html`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Set environment variables in Vercel dashboard
```

### Netlify
```bash
npm install -g netlify-cli
netlify init
netlify deploy
```

### GitHub Pages
```bash
git push origin main
# Enable GitHub Pages in repository settings
```

**Note**: Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables on your deployment platform.

## 🔒 Security

- ✅ **Password Hashing**: Bcrypt via Supabase
- ✅ **HTTPS-Ready**: All traffic encrypted in production
- ✅ **Session Management**: Secure, httpOnly cookies (Supabase)
- ✅ **Input Validation**: Client + server-side validation
- ✅ **CORS Protection**: Handled by Supabase
- ✅ **Rate Limiting**: Supported by Supabase Pro
- ✅ **Error Handling**: Secure error messages (no sensitive leaks)

## ❓ Troubleshooting

### "Supabase client not loaded"
- Ensure Supabase CDN script is in your HTML

### "Cannot read property 'signUp' of undefined"
- Check that `config.js` is loaded before `auth.js`

### Login not working
- Open DevTools (F12) and check Console for errors
- Verify Supabase credentials in `config.js`

### Session not persisting
- Check browser localStorage (F12 → Application > Local Storage)
- Look for `lumen_current_user` key

## 📖 Documentation

- [Full Setup Guide](./SETUP.md) - Detailed Supabase configuration
- [Supabase Docs](https://supabase.com/docs) - Official Supabase documentation
- [JavaScript Client](https://supabase.com/docs/reference/javascript) - Supabase JS SDK reference

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## ✅ Checklist

- [x] User authentication (signup/login/logout)
- [x] Session persistence
- [x] Protected routes
- [x] Password hashing
- [x] Error handling
- [x] Form validation
- [x] Auth state management
- [x] Responsive design
- [x] Deployment-ready

## 🆘 Support

- **GitHub Issues**: Report bugs or request features
- **Supabase Support**: https://supabase.com/support
- **Contact Page**: See `/contact.html`

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-26  
**Status**: Production Ready ✅
