import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../server";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import * as authUtils from "../utils/generateToken";

vi.mock("../models/User");
vi.mock("bcrypt");
vi.mock("jsonwebtoken");
vi.mock("../utils/generateToken");

type MockUser = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  save?: () => Promise<boolean>;
  deleteOne?: () => Promise<boolean>;
};

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("User Controller Tests", () => {
  describe("POST /api/users/register", () => {
    it("should register a user successfully", async () => {
      const mockUser = {
        _id: "testId",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (authUtils.generateToken as jest.Mock).mockReturnValue("fakeToken");

      const res = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: "User registered successfully...!",
          user: {
            _id: "testId",
            name: "Test User",
            email: "test@example.com",
          },
          token: "fakeToken",
        })
      );
    });

    it("should return 400 if email is already in use", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });

      const res = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Email already in use");
    });
  });

  describe("POST /api/users/login", () => {
    it("should log in successfully with valid credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (authUtils.generateToken as jest.Mock).mockReturnValue("fakeToken");

      const res = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: "Login successful",
          token: "fakeToken",
          user: {
            _id: "testId",
            name: "Test User",
            email: "test@example.com",
          },
        })
      );
    });

    it("should return 401 with invalid credentials", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "wrongPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });
  });

  describe("GET /api/users/profile", () => {
    it("should return user profile", async () => {
      const mockUser = {
        _id: "testId",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "testId" });
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer valid.test.token");

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });

      expect(new Date(res.body.user.createdAt)).toBeInstanceOf(Date);
    });
  });

  describe("PUT /api/users/profile", () => {
    it("should update user profile", async () => {
      const mockUser: MockUser = {
        _id: "testId",
        name: "Test User",
        email: "test@example.com",
        password: "oldPassword",
        save: vi.fn().mockResolvedValue(true),
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "testId" });
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .put("/api/users/profile")
        .set("Authorization", "Bearer valid.test.token")
        .send({
          name: "Updated User",
          email: "updated@example.com",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Profile updated successfully"
      );
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/users/profile", () => {
    it("should delete user profile", async () => {
      const mockUser: MockUser = {
        _id: "testId",
        name: "Test User",
        email: "test@example.com",
        deleteOne: vi.fn().mockResolvedValue(true),
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: "testId" });
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .delete("/api/users/profile")
        .set("Authorization", "Bearer valid.test.token");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted successfully");
      expect(mockUser.deleteOne).toHaveBeenCalled();
    });
  });
});
