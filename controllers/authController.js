import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hash });
    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id, email: user.email, name: user.name });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
