import express from "express";
import User from "../../../database/models/User.js";
import { formatUser, protect, signToken } from "../middleware/auth.js";
import {
  createGoogleOAuthClient,
  findOrCreateGoogleUser,
  getGoogleRedirectUri,
  isGoogleConfigured,
} from "../config/google.js";
import { getClientUrl } from "../utils/url.js";

const router = express.Router();
const clientUrl = getClientUrl();

const sendAuthResponse = (res, user, status = 200) => {
  const token = signToken(user._id);
  return res.status(status).json({
    token,
    user: formatUser(user),
  });
};

router.get("/google/status", (_req, res) => {
  res.json({
    configured: isGoogleConfigured(),
    redirectUri: getGoogleRedirectUri(),
  });
});

router.get("/google", (_req, res) => {
  if (!isGoogleConfigured()) {
    return res.status(503).json({
      message:
        "Google OAuth is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env",
    });
  }

  const client = createGoogleOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    prompt: "select_account",
  });

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${clientUrl}/auth?error=google_cancelled`);
  }

  if (!isGoogleConfigured()) {
    return res.redirect(`${clientUrl}/auth?error=google_not_configured`);
  }

  try {
    const client = createGoogleOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    let profile;

    if (tokens.id_token) {
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      profile = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } else {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch Google user profile");
      }

      const userInfo = await userInfoResponse.json();
      profile = {
        googleId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
    }

    if (!profile.email) {
      return res.redirect(`${clientUrl}/auth?error=google_no_email`);
    }

    const user = await findOrCreateGoogleUser(User, profile);
    const token = signToken(user._id);

    res.redirect(`${clientUrl}/auth/google/callback#token=${token}`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect(`${clientUrl}/auth?error=google_failed`);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      provider: "local",
    });

    sendAuthResponse(res, user, 201);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Failed to create account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    sendAuthResponse(res, user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login." });
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: formatUser(req.user) });
});

export default router;
