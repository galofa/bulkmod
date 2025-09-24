import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { JwtPayload } from '../types';

export class JwtService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
  private static readonly TOKEN_EXPIRY = '24h';
  
  // Generate JWT token
  static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.TOKEN_EXPIRY });
  }
  
  // Verify JWT token
  static verifyToken(token: string): JwtPayload {
    try {
      console.log('JwtService.verifyToken - attempting to verify token');
      const payload = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
      console.log('JwtService.verifyToken - token verified successfully for user:', payload.userId);
      return payload;
    } catch (error) {
      console.log('JwtService.verifyToken - token verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }
  
  // Note: Token blacklisting functionality has been removed
  // JWT tokens are now stateless and rely on expiration for security
  
  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
}
