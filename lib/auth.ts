import { pool } from './db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '1h'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export interface User {
  id: string
  email: string
  role: 'Applicant' | 'Recruiter'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateAccessToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function generateRefreshToken(): string {
  return jwt.sign(
    { purpose: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )
}

export function verifyAccessToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function registerUser(
  email: string,
  password: string,
  role: 'Applicant' | 'Recruiter'
): Promise<User> {
  const passwordHash = await hashPassword(password)
  
  const result = await pool.query(
    `INSERT INTO public.users (email, password_hash, role) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, role`,
    [email, passwordHash, role]
  )
  
  return result.rows[0]
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; tokens: AuthTokens } | null> {
  const result = await pool.query(
    'SELECT id, email, password_hash, role FROM public.users WHERE email = $1',
    [email]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  const user = result.rows[0]
  const isValidPassword = await verifyPassword(password, user.password_hash)
  
  if (!isValidPassword) {
    return null
  }
  
  const userObj: User = {
    id: user.id,
    email: user.email,
    role: user.role
  }
  
  const accessToken = generateAccessToken(userObj)
  const refreshToken = generateRefreshToken()
  
  // Store refresh token in database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  
  await pool.query(
    `INSERT INTO public.refresh_tokens (user_id, token, expires_at) 
     VALUES ($1, $2, $3)`,
    [user.id, refreshToken, expiresAt]
  )
  
  return {
    user: userObj,
    tokens: { accessToken, refreshToken }
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    jwt.verify(refreshToken, JWT_SECRET)
    
    const result = await pool.query(
      `SELECT rt.user_id, u.email, u.role, rt.expires_at 
       FROM public.refresh_tokens rt 
       JOIN public.users u ON rt.user_id = u.id 
       WHERE rt.token = $1 AND rt.revoked_at IS NULL`,
      [refreshToken]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    const tokenData = result.rows[0]
    
    if (new Date() > new Date(tokenData.expires_at)) {
      await pool.query(
        'UPDATE public.refresh_tokens SET revoked_at = NOW() WHERE token = $1',
        [refreshToken]
      )
      return null
    }
    
    const user: User = {
      id: tokenData.user_id,
      email: tokenData.email,
      role: tokenData.role
    }
    
    return generateAccessToken(user)
  } catch (error) {
    return null
  }
}

export async function logout(refreshToken: string): Promise<void> {
  await pool.query(
    'UPDATE public.refresh_tokens SET revoked_at = NOW() WHERE token = $1',
    [refreshToken]
  )
}