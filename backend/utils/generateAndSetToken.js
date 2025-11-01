import jwt from "jsonwebtoken";

const generateAndSetToken = ({ email, userId, expiresIn = "7d" }) => {
  try {
    const token = jwt.sign({
      id: userId,
      email: email,
    },
      process.env.JWT_SECRET,
      { expiresIn }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", err.message);
    throw new Error("Failed to generate JWT token");
  }
}

export default generateAndSetToken;

