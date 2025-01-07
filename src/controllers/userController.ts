import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    res.status(201).json({
      message: "User registered successfully...!",
      user: userWithoutPassword,
      token: generateToken(user._id),
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: userWithoutPassword,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUser;

  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
  res.json({ user: userWithoutPassword });
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];
    const isValid = updates.every((key) => allowedUpdates.includes(key));

    if (!isValid) {
      res.status(400).json({ error: "Invalid updates" });
      return;
    }

    const user = req.user as IUser;
    updates.forEach((key: string) => {
      if (key === "password") {
        user.password = bcrypt.hashSync(req.body[key], 10);
      } else {
        (user as any)[key] = req.body[key];
      }
    });

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUser;
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
};
