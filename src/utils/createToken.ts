import jwt from "jsonwebtoken";

interface Payload {
  userId: string;
}

const createToken = (payload: Payload["userId"]): string =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

export default createToken;
