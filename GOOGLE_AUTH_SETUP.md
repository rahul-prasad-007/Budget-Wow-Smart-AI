# Google OAuth Setup (Budjet Wow)

Google sign-in fails with **Error 401: invalid_client** when placeholder credentials are used. Follow these steps to fix it.

## 1. Open Google Cloud Console

Go to: [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials)

Select your project (e.g. **budjet-wow** if you used Firebase before).

## 2. Create or use an OAuth 2.0 Client ID

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Budjet Wow Local` (any name is fine)

### Authorized JavaScript origins
```
http://localhost:5173
```

### Authorized redirect URIs
```
http://localhost:5000/api/auth/google/callback
```

4. Click **Create**
5. Copy the **Client ID** and **Client secret**

## 3. Update backend `.env`

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=45406279824-xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

Replace with your real values from step 2.

## 4. Restart the backend

```bash
npm run dev:backend
```

The frontend no longer needs `VITE_GOOGLE_CLIENT_ID` for Google sign-in (backend handles OAuth).

## 5. Test

1. Open http://localhost:5173/auth
2. The amber warning should disappear when Google is configured
3. Click **Continue with Google**
4. Sign in with your Google account

## Using an existing Firebase OAuth client

If you already had Google sign-in with Firebase:

1. Firebase Console → **Project settings** → **Your apps** → Web app
2. Or Google Cloud Console → **Credentials** → look for **Web client (auto created by Google Service)**
3. Use that Client ID and Secret in `backend/.env`
4. Add redirect URI: `http://localhost:5000/api/auth/google/callback`

## Troubleshooting

| Error | Fix |
|-------|-----|
| `invalid_client` | Wrong Client ID or Secret in `.env` |
| `redirect_uri_mismatch` | Add exact callback URL in Google Console |
| Button disabled / amber warning | Restart backend after updating `.env` |
| `google_failed` after login | Check backend terminal logs for details |

## Production

For deployment, also add your production URLs:

- JavaScript origin: `https://your-domain.com`
- Redirect URI: `https://api.your-domain.com/api/auth/google/callback`

Update `API_URL` and `CLIENT_URL` in production `.env`.
