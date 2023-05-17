import jwt, {
  Secret,
  SignOptions,
  VerifyOptions,
  SignCallback,
  VerifyCallback,
} from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const SECRET_KEY: Secret = "your-secret-key"; // Replace this with your actual secret key
const REFRESH_SECRET: Secret = "your-refresh-secret"; // Replace this with your actual refresh secret key

// Token authentication module!
export class TokenAuth {
  public static ACCESS_HEADER = "authorization";
  public static REFRESH_HEADER = "X-refresh-token";

  private static createToken(
    payload: object,
    secret: Secret,
    options: SignOptions,
    // callback: SignCallback
  ): string {
    return jwt.sign(payload, secret, options).toString();
  }

  private static verifyToken(
    token: string,
    secret: Secret,
    options: VerifyOptions,
    callback: VerifyCallback
  ): void {
    jwt.verify(token, secret, options, callback);
  }

  public static createAccessToken(
    userId: string,
    // callback: SignCallback = () => {}
  ): string {
    const payload = { userId };
    const options: SignOptions = { expiresIn: "1h" }; // Access token valid for 1 hour
    return TokenAuth.createToken(payload, SECRET_KEY, options);
  }

  public static createRefreshToken(
    userId: string,
    // callback: SignCallback = () => {}
  ): string {
    const payload = { userId };
    const options: SignOptions = { expiresIn: "7d" }; // Refresh token valid for 7 days
    return TokenAuth.createToken(payload, REFRESH_SECRET, options);
  }

  public static verifyAccessToken(
    token: string,
    callback: VerifyCallback
  ): void {
    TokenAuth.verifyToken(token, SECRET_KEY, {}, callback);
  }

  public static verifyRefreshToken(
    token: string,
    callback: VerifyCallback
  ): void {
    TokenAuth.verifyToken(token, REFRESH_SECRET, {}, callback);
  }

  public static GetAccessTokenFromRequest(req: Request): string | undefined {
    // const authHeader = req.headers[this.ACCESS_HEADER];
    const authHeader = req.body['auth'];
    if (typeof authHeader === "string") {
      const token = authHeader && authHeader.split(" ")[1];

      return token;
    } else {
      return undefined;
    }
  }

  public static GetRefreshTokenFromRequest(req: Request): string | undefined {
    console.log("HELLO");
    //const authHeader = req.headers[this.REFRESH_HEADER];
    const authHeader = req.body['auth'];
    console.log("auth header: " + authHeader);
    // check if authHeader is just a string
    if (typeof authHeader === "string") {
      return authHeader;
    } else {
      return undefined;
    }
  }

  // Middleware to authenticate user access token
  public static authenticateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = TokenAuth.GetAccessTokenFromRequest(req);

    if (token == null) return res.sendStatus(401);

    TokenAuth.verifyAccessToken(token, (err, payload) => {
      if (err) return res.sendStatus(403);
      req.tokenPayload = payload;
      next();
    });
  }

  // Middleware to authenticate user refresh token
  public static authenticateRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = TokenAuth.GetRefreshTokenFromRequest(req);

    if (token == null) return res.sendStatus(401);

    TokenAuth.verifyRefreshToken(token, (err, payload) => {
      if (err) return res.sendStatus(403);
      req.tokenPayload = payload;
      console.log("Refresh token verified. Payload: " + payload);
      next();
    });
  }
}
