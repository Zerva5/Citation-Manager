import express, { Request, Response } from "express";
import Auth from "./Auth";
import jwt, { SignCallback } from "jsonwebtoken";
import { User } from "./User";
import { TokenAuth } from "./TokenAuth";

export function PublicRouting(): express.Router {
  const router = express.Router();

  router.get("/ping", (req: Request, res: Response) => {
    res.send("pong");
  });

  router.get("/help", (req: Request, res: Response) => {
    res.send("No help for you! I haven't written it yet. :(");
  });

  // Register endpoint
  router.post("/register", async (req: Request, res: Response) => {
    // Try and create new user
    try {
      const email = req.body["email"];
      const password = req.body["password"];
      const name = req.body["name"];

      const userAuth = new Auth({ email, password });
      await userAuth.save();

      const user = new User({
        email: req.body["email"],
        name: req.body["name"],
      });
      await user.save();

      res.status(200).send();
    } catch (error: any) {
      // If error is duplicate key error (ie email already exists), send 400 with message
      if (error.code === 11000) {
        res.status(400).send({ message: "Email already in use" });
      } else {
        // Otherwise, send 400 with error
        res.status(400).send(error);
      }
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    // Try and find user
    try {
      const password = req.body["password"];
      const email = req.body["email"];
      const userAuth = await Auth.findOne({ email });

      // If user not found, send 400 with message
      if (!userAuth) {
        return res.status(400).send({ message: "User not found" });
      }

      // If user found, compare passwords
      const isMatch = await userAuth.comparePassword(password);

      // If passwords don't match, send 400 with message
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect password" });
      }

      // If passwords match, create a new refresh and access token
      var accessToken: string | undefined;
      var refreshToken: string | undefined;
      TokenAuth.createAccessToken(userAuth._id, (err, token) => {
        // check if there is an issue with the tokens
        accessToken = token;
      });

      TokenAuth.createRefreshToken(userAuth._id, (err, token) => {
        refreshToken = token;
      });

      // check if there is an issue with the tokens
      if (!accessToken || !refreshToken) {
        return res.status(400).send({ message: "Token error" });
      }

      // Fetch user info from email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }

      const usrObj = user.toObject();
      // If user not found, there is a problem with the database
      // We won't handle that yet
      res.setHeader("Authorization", `Bearer ${accessToken}`);
      res.setHeader("X-Refresh-Token", refreshToken);

      // If user found, send 200 with token and user info
      res.status(200).send({ token, user: usrObj });
    } catch (err: any) {
      console.log("Error in /login. " + err.message);
      res.status(400).send(err);
    }
  });

  return router;
}

export function AccessProtectedRouting(): express.Router {
  const router = express.Router();

  router.get("/ping", (req: Request, res: Response) => {
    res.send("protected pong");
  });

  return router;
}

export function RefreshProtectedRouting(): express.Router {
  const router = express.Router();

  router.get("/ping", (req: Request, res: Response) => {
    res.send("refresh protected pong");
  });

  // Add token refresh endpoint
  router.post("/token", (req: Request, res: Response) => {
    const userData = req.tokenPayload;
    // Create new access and refresh tokens
    const accessToken = TokenAuth.createAccessToken(userData);
    const newRefreshToken = TokenAuth.createRefreshToken(userData);

    // Send new tokens
    res.json({ accessToken: accessToken, refreshToken: newRefreshToken });
  });

  return router;
}

export default function GetRouting(): express.Router {
  const router = express.Router();

  return router;
}

/// CHAT GPT EXAMPLE CODE
// import express, { Request, Response } from "express";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.post('/login', async (req: Request, res: Response) => {
//   try {
//     // ... Authenticate the user first, for example, by checking username and password from req.body

//     // ... If user is authenticated:

//     // User payload that will be used in the tokens
//     const payload = {
//       id: user.id, // Example payload
//       // ... More payload data
//     };

//     // Create an access token
//     const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' });

//     // Create a refresh token
//     const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!);

//     // ... Save the refresh token in your database against the user for later use

//     // Send tokens
//     res.json({ accessToken, refreshToken });

//   } catch (error) {
//     // Handle error
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.post('/refresh', async (req: Request, res: Response) => {
//   try {
//     // Get refresh token from request
//     const { refreshToken } = req.body;

//     // ... Fetch refresh token from your database and validate

//     // Verify the refresh token
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
//       if (err) return res.sendStatus(403);

//       // If valid, create a new access token and return it
//       const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' });
//       res.json({ accessToken });
//     });

//   } catch (error) {
//     // Handle error
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// export default router;
