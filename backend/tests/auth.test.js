const { register } = require("../src/controllers/auth_controller");
const userModel = require("../src/models/users_model");
const { sendverificationEmail } = require("../src/utild/sendEmail");

jest.mock("../src/models/users_model", () => ({
  getUserByUsername: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  generateCode: jest.fn(),
}));

jest.mock("../src/utild/sendEmail", () => ({
  sendverificationEmail: jest.fn(),
}));

describe("register", () => {
  test("should return 400 if fields are missing", async () => {
    const req = { body: { username: "", email: "", password: "" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required to fill out",
    });
  });
  test("should return 400 if username short", async () => {
    const req = {
      body: {
        username: "te",
        email: "testuser@gmail.com",
        password: "Test1234!",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usename must be at least 3 characters long",
    });
  });
  test("should return 400 if email not valid", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "notemail",
        password: "Test1234!",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email format",
    });
  });
  test("should return 400 if password not valid", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "testuser@gmail.com",
        password: "qwerty!",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Password must be between 8 and 15 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, #, $, !)",
    });
  });
  test("should return 400 if username already exists", async () => {
    userModel.getUserByUsername.mockResolvedValue({
      id: 1,
      username: "testuser",
    });

    const req = {
      body: {
        username: "testuser",
        email: "testuser@gmail.com",
        password: "Test1234!",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username already exists",
    });
  });
  test("should return 400 if email already exists", async () => {
    userModel.getUserByUsername.mockResolvedValue(null);
    userModel.getUserByEmail.mockResolvedValue({
      id: 1,
      email: "testuser@gmail.com",
    });

    const req = {
      body: {
        username: "testuser",
        email: "testuser@gmail.com",
        password: "Test1234!",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already exists" });
  });
  test("should return 201 if registration succesful", async () => {
    userModel.getUserByUsername.mockResolvedValue(null);
    userModel.getUserByEmail.mockResolvedValue(null);
    userModel.createUser.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "testuser@gmail.com",
    });
    userModel.generateCode.mockResolvedValue({ code: 634634 });
    sendverificationEmail.mockResolvedValue({
      email: "testuser@gmail.com",
      code: 634634,
    });

    const req = {
      body: {
        username: "testuser",
        email: "testuser@gmail.com",
        password: "Test1234!",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "New user created successfully",
      user: { id: 1, username: "testuser", email: "testuser@gmail.com" },
    });
  });
});
