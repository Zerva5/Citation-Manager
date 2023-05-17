import express from 'express';

declare global {
    namespace Express {
      interface Request {
        tokenPayload?: any; // or the actual type of your user object
      }
    }
  }