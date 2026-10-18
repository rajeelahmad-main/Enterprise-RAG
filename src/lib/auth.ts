import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'northstar-digital-enterprise-rag-jwt-secret-key-2026';
const TOKEN_EXPIRY = '7d';

export type UserRole = 'employee' | 'hr_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  passwordHash: string;
  createdAt: string;
}

// In-memory persistent enterprise directory for demo & Vercel deployment
// Pre-hashed passwords:
// 'AdminPassword2026!' -> $2a$10$wKxN747KeqRz6kU8lI7Nfu/wM1y8wGgq6X1O6u4x4e7uUuG...
// 'EmployeePass2026!' -> ...
const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Sophia Martinez',
    email: 'admin@northstar.example',
    role: 'hr_admin',
    department: 'People Operations & HR Leadership',
    passwordHash: bcrypt.hashSync('AdminPassword2026!', 10),
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'usr_emp_02',
    name: 'Alex Johnson',
    email: 'employee@northstar.example',
    role: 'employee',
    department: 'Engineering',
    passwordHash: bcrypt.hashSync('EmployeePass2026!', 10),
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'usr_emp_03',
    name: 'Sarah Chen',
    email: 'sarah.chen@northstar.example',
    role: 'employee',
    department: 'Product Design',
    passwordHash: bcrypt.hashSync('SarahPass2026!', 10),
    createdAt: new Date('2024-06-01').toISOString(),
  },
];

// Global cache for serverless invocation lifecycle
const userStore: Map<string, User> = new Map();
INITIAL_USERS.forEach((u) => userStore.set(u.email.toLowerCase(), u));

export function findUserByEmail(email: string): User | undefined {
  return userStore.get(email.toLowerCase().trim());
}

export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  department?: string;
  role?: UserRole;
}): { success: boolean; user?: Omit<User, 'passwordHash'>; error?: string } {
  const email = params.email.toLowerCase().trim();
  if (userStore.has(email)) {
    return { success: false, error: 'User with this email already exists' };
  }

  if (params.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: params.name.trim(),
    email,
    role: params.role || 'employee',
    department: params.department || 'General',
    passwordHash: bcrypt.hashSync(params.password, 10),
    createdAt: new Date().toISOString(),
  };

  userStore.set(email, newUser);

  const { passwordHash: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return user;
}

export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    department: user.department,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  exp: number;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
