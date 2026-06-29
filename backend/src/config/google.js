import { OAuth2Client } from "google-auth-library";

const INVALID_PATTERNS = [
  "your_google_client_id",
  "placeholder",
  "changeme",
  "example",
];

export const isGoogleConfigured = () => {
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();

  if (!clientId || !clientSecret) return false;
  if (!clientId.endsWith(".apps.googleusercontent.com")) return false;
  if (INVALID_PATTERNS.some((pattern) => clientId.toLowerCase().includes(pattern))) {
    return false;
  }
  if (clientSecret.length < 10) return false;

  return true;
};

export const getGoogleRedirectUri = () => {
  const base = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${base.replace(/\/$/, "")}/api/auth/google/callback`;
};

export const createGoogleOAuthClient = () =>
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getGoogleRedirectUri()
  );

export const findOrCreateGoogleUser = async (User, profile) => {
  const { googleId, email, name, picture } = profile;

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      user.photoURL = picture || user.photoURL;
      if (!user.password) user.provider = "google";
      await user.save();
    }
  } else {
    user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      googleId,
      photoURL: picture || null,
      provider: "google",
    });
  }

  return user;
};
