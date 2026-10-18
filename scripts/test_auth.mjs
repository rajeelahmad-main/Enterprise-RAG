import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'northstar-digital-enterprise-rag-jwt-secret-key-2026';

console.log('🔐 Running Enterprise Authentication Verification Suite...');

// Simulated in-memory database
const users = new Map();

function register(name, email, password, role = 'employee', department = 'General') {
  if (users.has(email.toLowerCase())) {
    return { success: false, error: 'User already exists' };
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name,
    email: email.toLowerCase(),
    role,
    department,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  users.set(email.toLowerCase(), user);
  return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

function login(email, password) {
  const user = users.get(email.toLowerCase());
  if (!user) return { success: false, error: 'Invalid email or password' };

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return { success: false, error: 'Invalid email or password' };

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

function verify(token) {
  try {
    return { success: true, payload: jwt.verify(token, JWT_SECRET) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 1. Seed Accounts
console.log('\n--- Test 1: Seeding Enterprise Accounts ---');
register('Sophia Martinez', 'admin@northstar.example', 'AdminPassword2026!', 'hr_admin', 'People Operations');
register('Alex Johnson', 'employee@northstar.example', 'EmployeePass2026!', 'employee', 'Engineering');
console.log('✅ Seeded admin & employee accounts.');

// 2. Admin Login
console.log('\n--- Test 2: Admin Login & RBAC Verification ---');
const adminLogin = login('admin@northstar.example', 'AdminPassword2026!');
if (!adminLogin.success || !adminLogin.token) {
  throw new Error('Admin login failed: ' + adminLogin.error);
}
const adminPayload = verify(adminLogin.token);
if (!adminPayload.success || adminPayload.payload.role !== 'hr_admin') {
  throw new Error('Admin RBAC verification failed!');
}
console.log(`✅ Admin authenticated successfully: ${adminPayload.payload.name} (Role: ${adminPayload.payload.role})`);

// 3. Employee Login
console.log('\n--- Test 3: Employee Login & RBAC Verification ---');
const empLogin = login('employee@northstar.example', 'EmployeePass2026!');
if (!empLogin.success || !empLogin.token) {
  throw new Error('Employee login failed: ' + empLogin.error);
}
const empPayload = verify(empLogin.token);
if (!empPayload.success || empPayload.payload.role !== 'employee') {
  throw new Error('Employee RBAC verification failed!');
}
console.log(`✅ Employee authenticated successfully: ${empPayload.payload.name} (Role: ${empPayload.payload.role})`);

// 4. Invalid Password Rejection
console.log('\n--- Test 4: Invalid Password Security Test ---');
const badLogin = login('admin@northstar.example', 'WrongPassword123');
if (badLogin.success) {
  throw new Error('Security flaw: Invalid password was accepted!');
}
console.log('✅ Correctly rejected invalid password with generic error message.');

// 5. Registration & Token Tampering
console.log('\n--- Test 5: Dynamic Registration Test ---');
const regResult = register('David Kim', 'david.kim@northstar.example', 'DavidSecure2026!', 'employee', 'Marketing');
if (!regResult.success) throw new Error('Registration failed');
const newLogin = login('david.kim@northstar.example', 'DavidSecure2026!');
if (!newLogin.success) throw new Error('Login for new user failed');
console.log(`✅ Registered new employee ${regResult.user.name} and logged in successfully.`);

// 6. Token Tampering Test
console.log('\n--- Test 6: Tampered Token Rejection Test ---');
const tamperedToken = adminLogin.token.slice(0, -6) + 'abcdef';
const tamperedCheck = verify(tamperedToken);
if (tamperedCheck.success) {
  throw new Error('Security flaw: Tampered token was accepted!');
}
console.log('✅ Correctly rejected tampered JWT token signature.');

console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED WITH 100% SUCCESS!');
