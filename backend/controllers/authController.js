import User from "../models/Authmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const signup = async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await User.findOne({ username: username });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!username || !name || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  if (existingUser) {
    return res.status(401).json({
      message: "user already exists",
    });
  }

  const user = await User.create({
    name: name,
    username: username,
    password: hashedPassword,
  });

  let token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      picture: user.picture,
      bio: user.bio,
    },
    process.env.JWTSECRET,
    { expiresIn: "30d" }
  );

  res.cookie("token", token, cookieOptions);
  return res.status(200).json({
    message: "signed up successfully",
  });
};

export const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await User.findOne({
    username: username,
  });

  if (!existingUser) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const comparedPassword = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (existingUser && comparedPassword) {
    let token = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        username: existingUser.username,
        picture: existingUser.picture,
        bio: existingUser.bio,
      },
      process.env.JWTSECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Logged in successfully",
    });
  }

  res.status(401).json({
    msg: "Invalid credentials",
  });
};

export const callback = async (req, res) => {
  try {
    const code = req.query.code;

    const tokenRes = await axios.post(process.env.TOKEN_URI, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { name, email, picture } = userRes.data;
    let user = await User.findOne({ username: email });

    if (!user) {
      user = await User.create({
        name: name,
        username: email,
        password: "GOOGLE_USER_NO_PASSWORD",
        picture: picture,
      });
    }

    let token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        picture: user.picture,
        bio: user.bio,
      },
      process.env.JWTSECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, cookieOptions);
    res.redirect(process.env.FRONTEND_SERVICE);
  } catch (error) {
    console.error(
      "Error during Google OAuth callback:",
      error.response?.data || error.message
    );
    res.redirect(
      `${process.env.FRONTEND_SERVICE}/auth/login?error=google_oauth_failed`
    );
  }
};

export const googleLogin = async (req, res) => {
  const redirectUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  res.redirect(redirectUrl);
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    ...cookieOptions,
    expires: new Date(0),
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
};
