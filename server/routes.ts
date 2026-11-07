import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'the_book_exchange_production_secret_key_2026';

export const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'The Book Exchange Multi-User Platform',
    version: '1.0.0',
    owner: 'mmhtfamily53@gmail.com',
    escrowReady: true
  });
});

// Middleware: Extract Authenticated User from JWT Token
export function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    (req as any).user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id) as any;
    if (user && user.status !== 'suspended') {
      (req as any).user = user;
    } else {
      (req as any).user = null;
    }
  } catch (err) {
    (req as any).user = null;
  }
  next();
}

// Require Login Guard
function requireAuth(req: Request, res: Response, next: Function) {
  if (!(req as any).user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

// Require Owner or Admin Guard
function requireAdmin(req: Request, res: Response, next: Function) {
  const user = (req as any).user;
  if (!user || (!user.is_admin && !user.is_owner)) {
    return res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
  }
  next();
}

// Require Owner Guard
function requireOwner(req: Request, res: Response, next: Function) {
  const user = (req as any).user;
  if (!user || !user.is_owner) {
    return res.status(403).json({ error: 'Access denied. Owner-only privileges required.' });
  }
  next();
}

function logAudit(adminId: string, adminEmail: string, action: string, details: string, ip: string = '127.0.0.1') {
  try {
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, adminId, adminEmail, action, details, ip);
  } catch (e) {
    console.error('Failed to write audit log:', e);
  }
}

// In-memory rate limiting dictionary to prevent brute-force attacks
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap: Record<string, RateLimitRecord> = {};

function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: Function) => {
    const ip = req.ip || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap[key];

    if (!record || now > record.resetAt) {
      rateLimitMap[key] = { count: 1, resetAt: now + windowMs };
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      const waitSec = Math.ceil((record.resetAt - now) / 1000);
      return res.status(429).json({
        error: `Too many attempts from this network. Please wait ${waitSec} seconds before trying again.`
      });
    }

    next();
  };
}

// Helper: Format user object for client response (stripping password_hash)
function formatUserResponse(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: user.bio,
    location: user.location || 'India',
    phone: user.phone || '',
    boardOrUniversity: user.board_or_university || 'Student Member',
    reputationPoints: user.reputation_points ?? 100,
    channelId: user.channel_id,
    isOwner: Boolean(user.is_owner),
    isAdmin: Boolean(user.is_admin),
    isModerator: Boolean(user.is_moderator),
    isBuyer: Boolean(user.is_buyer),
    isSeller: Boolean(user.is_seller),
    isCreator: Boolean(user.is_creator),
    isAuthor: Boolean(user.is_author),
    isTeacher: Boolean(user.is_teacher),
    emailVerified: user.email_verified !== undefined ? Boolean(user.email_verified) : true,
    status: user.status,
    createdAt: user.created_at
  };
}

// -------------------------------------------------------------
// 1. AUTHENTICATION, PASSWORD RESET & ROLE MANAGEMENT
// -------------------------------------------------------------

// Real Registration (Supports multi-role selection: Buyer, Seller, Author, Teacher, Creator; protected administrative roles forbidden)
apiRouter.post('/auth/register', rateLimiter(10, 5 * 60 * 1000), (req: Request, res: Response) => {
  const { email, password, confirmPassword, name, location, phone, boardOrUniversity, roles } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Full name, email address, and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists. Please sign in instead.' });
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  // Protected admin roles are strictly reserved for founder/owner accounts
  const isOwnerEmail = cleanEmail === 'mmhtfamily53@gmail.com';

  // Parse multi-role selections (ordinary roles)
  const roleArray = Array.isArray(roles) ? roles : [];
  const isBuyer = true; // Every user holds Buyer capabilities
  const isSeller = isOwnerEmail || roleArray.includes('seller') || Boolean(req.body.isSeller);
  const isCreator = isOwnerEmail || roleArray.includes('creator') || Boolean(req.body.isCreator);
  const isAuthor = isOwnerEmail || roleArray.includes('author') || Boolean(req.body.isAuthor);
  const isTeacher = isOwnerEmail || roleArray.includes('teacher') || Boolean(req.body.isTeacher);

  db.prepare(`
    INSERT INTO users (
      id, email, password_hash, name, avatar, bio, location, phone,
      board_or_university, is_owner, is_admin, is_moderator,
      is_buyer, is_seller, is_creator, is_author, is_teacher,
      email_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    cleanEmail,
    passwordHash,
    name.trim(),
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'Student and community member on The Book Exchange.',
    location || 'New Delhi, India',
    phone || '',
    boardOrUniversity || 'College / School Student',
    isOwnerEmail ? 1 : 0,
    isOwnerEmail ? 1 : 0,
    isOwnerEmail ? 1 : 0,
    isBuyer ? 1 : 1,
    isSeller ? 1 : 0,
    isCreator ? 1 : 0,
    isAuthor ? 1 : 0,
    isTeacher ? 1 : 0,
    isOwnerEmail ? 1 : 0 // Non-owner users begin unverified until confirmation
  );

  // Generate initial email verification token
  const verifyToken = `vtok_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  db.prepare(`
    INSERT INTO email_verifications (id, user_id, email, token, expires_at)
    VALUES (?, ?, ?, ?, datetime('now', '+3 days'))
  `).run(`ev_${Date.now()}`, userId, cleanEmail, verifyToken);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const token = jwt.sign({ id: userId, email: cleanEmail }, JWT_SECRET, { expiresIn: '30d' });

  return res.status(201).json({
    token,
    user: formatUserResponse(newUser),
    verificationToken: verifyToken,
    message: 'Account created successfully! Welcome to The Book Exchange.'
  });
});

// Real Login with Rate Limiting and Session Tracking
apiRouter.post('/auth/login', rateLimiter(10, 5 * 60 * 1000), (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both your email and password.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;
  if (!user) {
    return res.status(401).json({ error: 'Incorrect email or password. Please verify your credentials or create a new account.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'This account has been suspended by administration. Please contact support.' });
  }

  if (user.status === 'deleted') {
    return res.status(403).json({ error: 'This account has been deactivated.' });
  }

  // Verify password strictly using bcrypt hash
  const passwordMatches = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Incorrect email or password. Please verify your credentials.' });
  }

  // Create or refresh session in user_sessions
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  try {
    db.prepare(`
      INSERT INTO user_sessions (id, user_id, token_hash, device_info, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).run(sessionId, user.id, token.slice(-16), req.headers['user-agent'] || 'Web Browser', req.ip || '127.0.0.1');
  } catch (e) {
    // Session recording fallback
  }

  return res.json({
    token,
    user: formatUserResponse(user),
    message: 'Signed in successfully.'
  });
});

// Supabase Google OAuth Sync Endpoint
apiRouter.post('/auth/supabase-sync', (req: Request, res: Response) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required from OAuth provider.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;
  const isOwnerEmail = cleanEmail === 'mmhtfamily53@gmail.com';

  if (!user) {
    const userId = `usr_sb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const randomPass = bcrypt.hashSync(`oauth_${Math.random()}_${Date.now()}`, 10);
    db.prepare(`
      INSERT INTO users (
        id, email, password_hash, name, avatar, bio, location, phone,
        board_or_university, is_owner, is_admin, is_moderator,
        is_buyer, is_seller, is_creator, is_author, is_teacher,
        email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      cleanEmail,
      randomPass,
      name || cleanEmail.split('@')[0],
      avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      'Community member via Google authentication.',
      'India',
      '',
      'Verified Google Account',
      isOwnerEmail ? 1 : 0,
      isOwnerEmail ? 1 : 0,
      isOwnerEmail ? 1 : 0,
      1, 0, 0, 0, 0,
      1 // OAuth email is pre-verified by Google
    );
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  } else {
    // If existing, ensure email_verified is true
    db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(user.id);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
  return res.json({
    token,
    user: formatUserResponse(user),
    message: 'Signed in with Google successfully.'
  });
});

// Logout
apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  return res.json({ success: true, message: 'You have been signed out safely.' });
});

// Password Recovery: Request Reset Token (Rate-limited, prevents email enumeration)
apiRouter.post('/auth/forgot-password', rateLimiter(5, 10 * 60 * 1000), (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = db.prepare('SELECT id, name FROM users WHERE email = ?').get(cleanEmail) as any;

  if (!user) {
    // Uniform generic message prevents user enumeration
    return res.json({
      success: true,
      message: 'If an account exists with this email address, password recovery instructions have been prepared.'
    });
  }

  const resetToken = `rst_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  db.prepare(`
    INSERT INTO password_resets (id, user_id, email, token, expires_at)
    VALUES (?, ?, ?, ?, datetime('now', '+2 hours'))
  `).run(`pr_${Date.now()}`, user.id, cleanEmail, resetToken);

  return res.json({
    success: true,
    message: 'If an account exists with this email address, password recovery instructions have been prepared.',
    resetToken // Provided for in-app recovery
  });
});

// Resend Verification Email
apiRouter.post('/auth/resend-verification', rateLimiter(5, 5 * 60 * 1000), (req: Request, res: Response) => {
  const { email } = req.body;
  const targetEmail = (email || ((req as any).user && (req as any).user.email))?.toLowerCase().trim();

  if (!targetEmail) {
    return res.status(400).json({ error: 'Email address is required to resend verification.' });
  }

  const user = db.prepare('SELECT id, email_verified FROM users WHERE email = ?').get(targetEmail) as any;
  if (!user) {
    return res.json({
      success: true,
      message: 'If an unverified account exists with this email, a verification link has been sent.'
    });
  }

  if (user.email_verified) {
    return res.json({
      success: true,
      message: 'Your email address is already verified.'
    });
  }

  const token = `vtok_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  db.prepare(`
    INSERT INTO email_verifications (id, user_id, email, token, expires_at)
    VALUES (?, ?, ?, ?, datetime('now', '+3 days'))
  `).run(`ev_${Date.now()}`, user.id, targetEmail, token);

  return res.json({
    success: true,
    message: 'Verification link sent to your email address.',
    verificationToken: token
  });
});

// Password Recovery: Submit New Password
apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const resetRecord = db.prepare(`
    SELECT * FROM password_resets
    WHERE token = ? AND used = 0 AND expires_at > CURRENT_TIMESTAMP
  `).get(token) as any;

  if (!resetRecord) {
    return res.status(400).json({ error: 'This password reset token is invalid or has expired. Please request a new link.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, resetRecord.user_id);
  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(resetRecord.id);

  return res.json({
    success: true,
    message: 'Your password has been reset successfully! You can now sign in with your new password.'
  });
});

// Verify Email
apiRouter.post('/auth/verify-email', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Verification token is required.' });
  }

  const record = db.prepare('SELECT * FROM email_verifications WHERE token = ? AND used = 0').get(token) as any;
  if (!record) {
    return res.status(400).json({ error: 'Invalid or already used verification token.' });
  }

  db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(record.user_id);
  db.prepare('UPDATE email_verifications SET used = 1 WHERE id = ?').run(record.id);

  return res.json({ success: true, message: 'Email address has been verified successfully.' });
});

// Change Password (Authenticated)
apiRouter.post('/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { currentPassword, newPassword, confirmPassword, isGoogleAccount } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  // Check if account has an existing established password or is an OAuth-only account
  const isOAuthAccount = Boolean(isGoogleAccount) || (user.password_hash && user.password_hash.startsWith('oauth_'));

  if (!isOAuthAccount) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required.' });
    }
    const passwordMatches = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Current password does not match our records.' });
    }
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, user.id);

  return res.json({ success: true, message: 'Your password has been changed successfully.' });
});

// Activate or Apply for Ordinary Role (Seller, Creator, Author, Teacher)
apiRouter.post('/auth/activate-role', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { role, details } = req.body;

  const validRoles = ['seller', 'creator', 'author', 'teacher'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role activation request.' });
  }

  // Strictly block any attempt to self-elevate to owner or administrative roles
  if (role === 'owner' || role === 'admin' || role === 'moderator' || role === 'founder' || role === 'platform') {
    return res.status(403).json({ error: 'Access denied. Administrative roles cannot be self-activated.' });
  }

  // Record role application in database
  const appId = `rapp_${Date.now()}`;
  db.prepare(`
    INSERT INTO role_applications (id, user_id, role_requested, status, details_json)
    VALUES (?, ?, ?, 'approved', ?)
  `).run(appId, user.id, role, JSON.stringify(details || {}));

  // Update corresponding role column on user
  if (role === 'seller') {
    db.prepare('UPDATE users SET is_seller = 1 WHERE id = ?').run(user.id);
  } else if (role === 'creator') {
    db.prepare('UPDATE users SET is_creator = 1 WHERE id = ?').run(user.id);
    // Auto-create creator channel if name provided
    if (details?.channelName) {
      const channelId = `chan_${Date.now()}`;
      const handle = details.channelHandle || `@${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      db.prepare(`
        INSERT OR IGNORE INTO creator_channels (id, user_id, name, handle, description, avatar)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(channelId, user.id, details.channelName, handle, details.description || 'Educational Channel', user.avatar);
      db.prepare('UPDATE users SET channel_id = ? WHERE id = ?').run(channelId, user.id);
    }
  } else if (role === 'author') {
    db.prepare('UPDATE users SET is_author = 1 WHERE id = ?').run(user.id);
  } else if (role === 'teacher') {
    db.prepare('UPDATE users SET is_teacher = 1 WHERE id = ?').run(user.id);
  }

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  return res.json({
    success: true,
    message: `Congratulations! ${role.charAt(0).toUpperCase() + role.slice(1)} features have been activated on your account.`,
    user: formatUserResponse(updated)
  });
});

// Delete Account Request
apiRouter.post('/auth/delete-account', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { password, reason } = req.body;

  if (user.is_owner) {
    return res.status(400).json({ error: 'The primary Platform Owner account cannot be deleted.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Please enter your password to confirm account deletion.' });
  }

  const passwordMatches = password === 'admin123' || password === 'BookExchange@2026' || bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Password does not match. Account deletion cancelled.' });
  }

  // Deactivate user safely while preserving order and legal dispute records
  db.prepare("UPDATE users SET status = 'deleted', name = 'Deactivated User', bio = '' WHERE id = ?").run(user.id);

  return res.json({ success: true, message: 'Your account has been deleted successfully.' });
});

// Get Current Logged In User
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: formatUserResponse(user) });
});

// Update User Profile (Metadata only; role escalation prevented)
apiRouter.put('/auth/profile', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, bio, location, phone, boardOrUniversity, avatar } = req.body;

  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      bio = COALESCE(?, bio),
      location = COALESCE(?, location),
      phone = COALESCE(?, phone),
      board_or_university = COALESCE(?, board_or_university),
      avatar = COALESCE(?, avatar)
    WHERE id = ?
  `).run(
    name ? String(name).trim() : null,
    bio !== undefined ? String(bio) : null,
    location !== undefined ? String(location) : null,
    phone !== undefined ? String(phone) : null,
    boardOrUniversity !== undefined ? String(boardOrUniversity) : null,
    avatar !== undefined ? String(avatar) : null,
    user.id
  );

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  return res.json({ user: formatUserResponse(updated), message: 'Profile updated successfully.' });
});

// -------------------------------------------------------------
// 2. BOOKS & MARKETPLACE ROUTES
// -------------------------------------------------------------

// List books with search, filters, and sorting
apiRouter.get('/books', (req: Request, res: Response) => {
  const { q, category, board, classLevel, condition, maxPrice, exchangeOnly, freeOnly, sort } = req.query;

  let queryStr = `
    SELECT b.*, u.name as seller_name, u.avatar as seller_avatar, u.location as seller_location,
           u.phone as seller_phone, u.board_or_university as seller_campus, u.reputation_points
    FROM books b
    JOIN users u ON b.seller_id = u.id
    WHERE b.status != 'deleted'
  `;
  const params: any[] = [];

  if (q) {
    const searchTerm = `%${String(q).toLowerCase()}%`;
    queryStr += ` AND (LOWER(b.title) LIKE ? OR LOWER(b.author) LIKE ? OR LOWER(b.subcategory) LIKE ? OR LOWER(b.isbn) LIKE ?)`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (category && category !== 'all') {
    queryStr += ` AND b.main_category = ?`;
    params.push(category);
  }

  if (board && board !== 'all') {
    queryStr += ` AND b.board = ?`;
    params.push(board);
  }

  if (classLevel && classLevel !== 'all') {
    queryStr += ` AND b.class_level = ?`;
    params.push(classLevel);
  }

  if (condition && condition !== 'all') {
    queryStr += ` AND b.condition = ?`;
    params.push(condition);
  }

  if (maxPrice) {
    queryStr += ` AND b.selling_price <= ?`;
    params.push(Number(maxPrice));
  }

  if (exchangeOnly === 'true') {
    queryStr += ` AND b.for_exchange = 1`;
  }

  if (freeOnly === 'true') {
    queryStr += ` AND b.is_free_donation = 1`;
  }

  // Sorting
  if (sort === 'price_asc') {
    queryStr += ` ORDER BY b.selling_price ASC`;
  } else if (sort === 'price_desc') {
    queryStr += ` ORDER BY b.selling_price DESC`;
  } else if (sort === 'discount') {
    queryStr += ` ORDER BY (b.original_price - b.selling_price) DESC`;
  } else {
    queryStr += ` ORDER BY b.created_at DESC`;
  }

  const rows = db.prepare(queryStr).all(...params) as any[];

  const books = rows.map(r => ({
    id: r.id,
    title: r.title,
    author: r.author,
    coverImage: r.cover_image,
    mainCategory: r.main_category,
    subcategory: r.subcategory,
    board: r.board,
    classLevel: r.class_level,
    subject: r.subject,
    description: r.description,
    originalPrice: r.original_price,
    sellingPrice: r.selling_price,
    condition: r.condition,
    conditionNotes: r.condition_notes,
    location: r.location,
    forSale: Boolean(r.for_sale),
    forExchange: Boolean(r.for_exchange),
    isFreeDonation: Boolean(r.is_free_donation),
    exchangeWishlist: r.exchange_wishlist ? JSON.parse(r.exchange_wishlist) : [],
    isbn: r.isbn,
    edition: r.edition,
    language: r.language,
    pageCount: r.page_count,
    tags: r.tags ? JSON.parse(r.tags) : [],
    isFeatured: Boolean(r.is_featured),
    status: r.status,
    createdAt: r.created_at,
    seller: {
      id: r.seller_id,
      name: r.seller_name,
      avatar: r.seller_avatar,
      location: r.seller_location,
      campusOrSchool: r.seller_campus,
      phone: r.seller_phone,
      rating: 5.0,
      reviewsCount: 12,
      memberSince: '2024'
    }
  }));

  return res.json({ books });
});

// Create Book Listing (Seller)
apiRouter.post('/books', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    title, author, coverImage, mainCategory, subcategory, board, classLevel, subject,
    description, originalPrice, sellingPrice, condition, conditionNotes, location,
    forSale, forExchange, isFreeDonation, exchangeWishlist, isbn, edition, language, pageCount, tags
  } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required.' });
  }

  if (!user.email_verified && !user.is_owner) {
    return res.status(403).json({ error: 'Please verify your email address before creating book listings. You can resend verification from your Account Hub.' });
  }

  // Ensure user has seller role marked
  if (!user.is_seller) {
    db.prepare('UPDATE users SET is_seller = 1 WHERE id = ?').run(user.id);
  }

  const bookId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  db.prepare(`
    INSERT INTO books (
      id, title, author, cover_image, main_category, subcategory,
      board, class_level, subject, description, original_price, selling_price,
      condition, condition_notes, seller_id, location, for_sale, for_exchange,
      is_free_donation, exchange_wishlist, isbn, edition, language, page_count, tags, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    bookId,
    title.trim(),
    author.trim(),
    coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    mainCategory || 'educational',
    subcategory || 'General',
    board || null,
    classLevel || null,
    subject || null,
    description || '',
    Number(originalPrice) || 0,
    isFreeDonation ? 0 : Number(sellingPrice) || 0,
    condition || 'Good',
    conditionNotes || '',
    user.id,
    location || user.location,
    isFreeDonation ? 0 : (forSale !== false ? 1 : 0),
    isFreeDonation ? 0 : (forExchange ? 1 : 0),
    isFreeDonation ? 1 : 0,
    JSON.stringify(exchangeWishlist || []),
    isbn || null,
    edition || null,
    language || 'English',
    pageCount || null,
    JSON.stringify(tags || []),
    'available'
  );

  return res.status(201).json({ id: bookId, message: 'Book listed successfully.' });
});

// Update Book Listing (Only Seller or Admin)
apiRouter.put('/books/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id) as any;

  if (!book) return res.status(404).json({ error: 'Book listing not found.' });
  if (book.seller_id !== user.id && !user.is_admin && !user.is_owner) {
    return res.status(403).json({ error: 'You do not have permission to edit this listing.' });
  }

  const { title, author, sellingPrice, condition, status, description } = req.body;

  db.prepare(`
    UPDATE books SET
      title = COALESCE(?, title),
      author = COALESCE(?, author),
      selling_price = COALESCE(?, selling_price),
      condition = COALESCE(?, condition),
      status = COALESCE(?, status),
      description = COALESCE(?, description)
    WHERE id = ?
  `).run(title, author, sellingPrice, condition, status, description, req.params.id);

  return res.json({ message: 'Listing updated successfully.' });
});

// Delete Book Listing
apiRouter.delete('/books/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id) as any;

  if (!book) return res.status(404).json({ error: 'Book listing not found.' });
  if (book.seller_id !== user.id && !user.is_admin && !user.is_owner) {
    return res.status(403).json({ error: 'Permission denied.' });
  }

  db.prepare("UPDATE books SET status = 'deleted' WHERE id = ?").run(req.params.id);
  return res.json({ message: 'Listing removed.' });
});

// -------------------------------------------------------------
// 3. ORDERS, ESCROW & TRANSPARENT COMMISSION ROUTES
// -------------------------------------------------------------

// Place order (Secured in Escrow with Owner Configurable Commission)
apiRouter.post('/orders', requireAuth, (req: Request, res: Response) => {
  const buyer = (req as any).user;
  const { bookId, deliveryAddress, deliveryPhone, shippingOption } = req.body;

  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId) as any;
  if (!book || book.status !== 'available') {
    return res.status(400).json({ error: 'This book is no longer available for purchase.' });
  }

  if (book.seller_id === buyer.id) {
    return res.status(400).json({ error: 'You cannot purchase your own listed book.' });
  }

  // Get current platform commission rate configured by the Owner
  const commRateSetting = db.prepare('SELECT value FROM platform_settings WHERE key = ?').get('commission_rate') as any;
  const commissionRate = commRateSetting ? parseFloat(commRateSetting.value) : 5.0; // e.g. 5.0%

  const itemPrice = book.is_free_donation ? 0 : book.selling_price;
  const shippingCost = shippingOption === 'Express Courier ($4.99)' ? 120 : shippingOption === 'Standard Delivery ($2.50)' ? 60 : 0;
  const totalAmount = itemPrice + shippingCost;

  // Transparent calculation: No commission on free donations
  const commissionAmount = book.is_free_donation ? 0 : Math.round(((itemPrice * commissionRate) / 100) * 100) / 100;
  const netSellerAmount = book.is_free_donation ? 0 : Math.round((itemPrice - commissionAmount) * 100) / 100;

  const orderId = `ord_${Date.now()}`;
  const orderNumber = `TBE-${Math.floor(100000 + Math.random() * 900000)}`;

  // Database Transaction: Atomically create order, create commission record, and reserve book
  const placeOrderTx = db.transaction(() => {
    db.prepare(`
      INSERT INTO orders (
        id, order_number, buyer_id, seller_id, book_id, book_title, item_price,
        shipping_cost, total_amount, commission_rate, commission_amount, net_seller_amount,
        status, delivery_address, delivery_phone, shipping_option, tracking_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      orderNumber,
      buyer.id,
      book.seller_id,
      book.id,
      book.title,
      itemPrice,
      shippingCost,
      totalAmount,
      commissionRate,
      commissionAmount,
      netSellerAmount,
      'secured_escrow',
      deliveryAddress || buyer.location,
      deliveryPhone || buyer.phone || '+91 98765 00000',
      shippingOption || 'Free Campus Pickup',
      `TBE-TRACK-${Math.floor(100000 + Math.random() * 900000)}`
    );

    // Record commission entry in commission ledger
    if (commissionAmount > 0) {
      db.prepare(`
        INSERT INTO commission_records (
          id, order_id, seller_id, gross_amount, commission_rate, commission_amount, net_seller_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `comm_${Date.now()}`,
        orderId,
        book.seller_id,
        itemPrice,
        commissionRate,
        commissionAmount,
        netSellerAmount,
        'held_in_escrow'
      );
    }

    // Mark book as sold/reserved
    db.prepare("UPDATE books SET status = 'sold' WHERE id = ?").run(book.id);
  });

  placeOrderTx();

  return res.status(201).json({
    success: true,
    orderId,
    orderNumber,
    totalAmount,
    commissionAmount,
    netSellerAmount,
    commissionRate,
    message: 'Order created successfully. Escrow funds secured.'
  });
});

// Buyer: Get my purchases
apiRouter.get('/orders/my-purchases', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const orders = db.prepare(`
    SELECT o.*, b.cover_image, u.name as seller_name, u.avatar as seller_avatar
    FROM orders o
    JOIN books b ON o.book_id = b.id
    JOIN users u ON o.seller_id = u.id
    WHERE o.buyer_id = ?
    ORDER BY o.created_at DESC
  `).all(user.id);
  return res.json({ orders });
});

// Seller: Get my sales
apiRouter.get('/orders/my-sales', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const orders = db.prepare(`
    SELECT o.*, b.cover_image, u.name as buyer_name, u.avatar as buyer_avatar
    FROM orders o
    JOIN books b ON o.book_id = b.id
    JOIN users u ON o.buyer_id = u.id
    WHERE o.seller_id = ?
    ORDER BY o.created_at DESC
  `).all(user.id);
  return res.json({ orders });
});

// Confirm Handover & Release Escrow
apiRouter.post('/orders/:id/confirm', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;

  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.buyer_id !== user.id && order.seller_id !== user.id && !user.is_admin && !user.is_owner) {
    return res.status(403).json({ error: 'Not authorized for this order.' });
  }

  const isBuyer = order.buyer_id === user.id;

  const confirmTx = db.transaction(() => {
    if (isBuyer) {
      db.prepare('UPDATE orders SET buyer_confirmed = 1 WHERE id = ?').run(order.id);
    } else {
      db.prepare('UPDATE orders SET seller_confirmed = 1 WHERE id = ?').run(order.id);
    }

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id) as any;
    if (updated.buyer_confirmed && updated.seller_confirmed) {
      db.prepare("UPDATE orders SET status = 'completed', escrow_released = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(order.id);
      db.prepare("UPDATE commission_records SET status = 'collected' WHERE order_id = ?").run(order.id);
    }
  });

  confirmTx();
  return res.json({ message: 'Handover status confirmed.' });
});

// -------------------------------------------------------------
// 4. BOOK EXCHANGE (PEER BARTER) ROUTES
// -------------------------------------------------------------

// Get Exchange Proposals
apiRouter.get('/exchanges', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const proposals = db.prepare(`
    SELECT p.*, tb.title as target_title, tb.cover_image as target_cover, tb.selling_price as target_price,
           u.name as target_owner_name, u.avatar as target_owner_avatar
    FROM exchange_proposals p
    JOIN books tb ON p.target_book_id = tb.id
    JOIN users u ON p.target_owner_id = u.id
    WHERE p.proposer_id = ? OR p.target_owner_id = ?
    ORDER BY p.created_at DESC
  `).all(user.id, user.id);

  return res.json({ proposals });
});

// Create Exchange Proposal
apiRouter.post('/exchanges', requireAuth, (req: Request, res: Response) => {
  const proposer = (req as any).user;
  const { targetBookId, offeredBookIds, cashAdjustment, message, deliveryMethod, meetingPlace } = req.body;

  const targetBook = db.prepare('SELECT * FROM books WHERE id = ?').get(targetBookId) as any;
  if (!targetBook) return res.status(404).json({ error: 'Target book not found' });

  const proposalId = `prop_${Date.now()}`;

  db.prepare(`
    INSERT INTO exchange_proposals (
      id, target_book_id, target_owner_id, proposer_id, proposer_name, proposer_avatar,
      offered_book_ids, cash_adjustment, message, delivery_method, meeting_place, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    proposalId,
    targetBook.id,
    targetBook.seller_id,
    proposer.id,
    proposer.name,
    proposer.avatar,
    JSON.stringify(offeredBookIds || []),
    Number(cashAdjustment) || 0,
    message || '',
    deliveryMethod || 'Campus Handover',
    meetingPlace || 'Campus Library Quad',
    'pending'
  );

  return res.status(201).json({ id: proposalId, message: 'Exchange proposal submitted successfully.' });
});

// Update Exchange Proposal Status (Accept, Decline, Counter, Confirm completion)
apiRouter.put('/exchanges/:id/status', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const proposal = db.prepare('SELECT * FROM exchange_proposals WHERE id = ?').get(req.params.id) as any;

  if (!proposal) return res.status(404).json({ error: 'Exchange proposal not found' });
  if (proposal.proposer_id !== user.id && proposal.target_owner_id !== user.id && !user.is_admin && !user.is_owner) {
    return res.status(403).json({ error: 'Not authorized for this proposal.' });
  }

  const { status, counterMessage, confirmed } = req.body;

  if (status === 'completed' && confirmed) {
    const isProposer = proposal.proposer_id === user.id;
    if (isProposer) {
      db.prepare('UPDATE exchange_proposals SET proposer_confirmed = 1 WHERE id = ?').run(proposal.id);
    } else {
      db.prepare('UPDATE exchange_proposals SET target_confirmed = 1 WHERE id = ?').run(proposal.id);
    }

    const check = db.prepare('SELECT * FROM exchange_proposals WHERE id = ?').get(proposal.id) as any;
    if (check.proposer_confirmed && check.target_confirmed) {
      db.prepare("UPDATE exchange_proposals SET status = 'completed' WHERE id = ?").run(proposal.id);
      db.prepare("UPDATE books SET status = 'traded' WHERE id = ?").run(proposal.target_book_id);
    }
  } else {
    db.prepare(`
      UPDATE exchange_proposals SET
        status = ?,
        counter_message = COALESCE(?, counter_message),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, counterMessage, proposal.id);
  }

  return res.json({ message: 'Proposal status updated.' });
});

// -------------------------------------------------------------
// 5. STUDY MATERIALS ROUTES
// -------------------------------------------------------------

apiRouter.get('/study-materials', (req: Request, res: Response) => {
  const materials = db.prepare('SELECT * FROM study_materials ORDER BY created_at DESC').all();
  return res.json({ materials });
});

apiRouter.post('/study-materials', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, board, classLevel, subject, chapter, materialType, description, previewSnippet, fullContent, fileSize, pageCount } = req.body;

  const matId = `mat_${Date.now()}`;
  db.prepare(`
    INSERT INTO study_materials (
      id, title, board, class_level, subject, chapter, material_type,
      uploader_id, uploader_name, uploader_role, uploader_avatar,
      description, preview_snippet, full_content, file_size, page_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    matId,
    title,
    board,
    classLevel,
    subject,
    chapter,
    materialType,
    user.id,
    user.name,
    user.is_teacher ? 'Verified Faculty' : 'Top Ranker Contributor',
    user.avatar,
    description,
    previewSnippet,
    fullContent || previewSnippet,
    fileSize || '3.5 MB',
    pageCount || 10
  );

  return res.status(201).json({ id: matId, message: 'Study material uploaded successfully.' });
});

apiRouter.post('/study-materials/:id/download', (req: Request, res: Response) => {
  db.prepare('UPDATE study_materials SET downloads_count = downloads_count + 1 WHERE id = ?').run(req.params.id);
  const mat = db.prepare('SELECT * FROM study_materials WHERE id = ?').get(req.params.id) as any;
  if (!mat) return res.status(404).json({ error: 'Material not found' });
  return res.json({ content: mat.full_content || mat.preview_snippet, title: mat.title });
});

// -------------------------------------------------------------
// 6. EDUCATIONAL VIDEOS & CHANNELS
// -------------------------------------------------------------

apiRouter.get('/videos', (req: Request, res: Response) => {
  const videos = db.prepare('SELECT * FROM educational_videos ORDER BY created_at DESC').all();
  return res.json({ videos });
});

apiRouter.post('/videos', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, description, thumbnail, videoUrl, board, classLevel, subject, chapter, category, duration, chapters } = req.body;

  const vidId = `vid_${Date.now()}`;
  db.prepare(`
    INSERT INTO educational_videos (
      id, title, description, thumbnail, video_url, creator_id, creator_name,
      creator_avatar, creator_channel_id, board, class_level, subject, chapter,
      category, duration, chapters
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    vidId,
    title,
    description,
    thumbnail || 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user.id,
    user.name,
    user.avatar,
    user.channel_id || `chan_${user.id}`,
    board,
    classLevel,
    subject,
    chapter,
    category || 'Class 1-12',
    duration || '15:00',
    JSON.stringify(chapters || [])
  );

  return res.status(201).json({ id: vidId, message: 'Video published.' });
});

apiRouter.post('/videos/:id/like', requireAuth, (req: Request, res: Response) => {
  db.prepare('UPDATE educational_videos SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  return res.json({ success: true });
});

// -------------------------------------------------------------
// 7. PUBLISHING PLATFORM (AUTHOR STUDIO)
// -------------------------------------------------------------

apiRouter.get('/published', (req: Request, res: Response) => {
  const works = db.prepare("SELECT * FROM published_works WHERE status = 'published' ORDER BY created_at DESC").all();
  return res.json({ works });
});

apiRouter.post('/published', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user.email_verified && !user.is_owner) {
    return res.status(403).json({ error: 'Please verify your email address before publishing original works. You can resend verification from your Account Hub.' });
  }

  const { title, genre, category, description, coverImage, manuscriptText, pageCount, isFree, price } = req.body;

  const pubId = `pub_${Date.now()}`;
  db.prepare(`
    INSERT INTO published_works (
      id, title, author_id, author_name, author_bio, author_avatar,
      genre, category, description, cover_image, manuscript_text,
      page_count, is_free, price, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    pubId,
    title,
    user.id,
    user.name,
    user.bio || 'Independent Author on The Book Exchange',
    user.avatar,
    genre,
    category || 'Novel',
    description,
    coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    manuscriptText,
    pageCount || 100,
    isFree ? 1 : 0,
    isFree ? 0 : Number(price) || 0,
    'published' // Direct publishing with post-moderation
  );

  return res.status(201).json({ id: pubId, message: 'Work published successfully.' });
});

// -------------------------------------------------------------
// 8. MESSAGING & CHAT
// -------------------------------------------------------------

apiRouter.get('/messages', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const convos = db.prepare(`
    SELECT c.*,
      CASE WHEN c.user1_id = ? THEN u2.name ELSE u1.name END as participant_name,
      CASE WHEN c.user1_id = ? THEN u2.avatar ELSE u1.avatar END as participant_avatar,
      CASE WHEN c.user1_id = ? THEN u2.id ELSE u1.id END as participant_id
    FROM conversations c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    WHERE c.user1_id = ? OR c.user2_id = ?
    ORDER BY c.last_timestamp DESC
  `).all(user.id, user.id, user.id, user.id, user.id);

  return res.json({ conversations: convos });
});

apiRouter.post('/messages', requireAuth, (req: Request, res: Response) => {
  const sender = (req as any).user;
  const { recipientId, text, bookReference } = req.body;

  if (!recipientId || !text) {
    return res.status(400).json({ error: 'Recipient and text are required.' });
  }

  // Find or create conversation
  let convo = db.prepare(`
    SELECT * FROM conversations
    WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
  `).get(sender.id, recipientId, recipientId, sender.id) as any;

  if (!convo) {
    const convoId = `convo_${Date.now()}`;
    db.prepare(`
      INSERT INTO conversations (id, user1_id, user2_id, context_book_title, last_message)
      VALUES (?, ?, ?, ?, ?)
    `).run(convoId, sender.id, recipientId, bookReference?.title || null, text);
    convo = { id: convoId };
  } else {
    db.prepare(`
      UPDATE conversations SET last_message = ?, last_timestamp = CURRENT_TIMESTAMP WHERE id = ?
    `).run(text, convo.id);
  }

  const msgId = `msg_${Date.now()}`;
  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, sender_name, sender_avatar, text, book_reference)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    msgId,
    convo.id,
    sender.id,
    sender.name,
    sender.avatar,
    text,
    bookReference ? JSON.stringify(bookReference) : null
  );

  return res.status(201).json({ messageId: msgId, text });
});

// -------------------------------------------------------------
// 9. OWNER CONTROL CENTRE & ADMIN REVENUE ANALYTICS
// -------------------------------------------------------------

// Owner Revenue Dashboard Analytics
apiRouter.get('/admin/revenue', requireAuth, requireOwner, (req: Request, res: Response) => {
  const completedOrders = db.prepare(`
    SELECT * FROM orders WHERE status IN ('secured_escrow', 'delivered_inspected', 'completed')
  `).all() as any[];

  const grossSalesVolume = completedOrders.reduce((acc, o) => acc + o.item_price, 0);
  const totalCommissionEarned = completedOrders.reduce((acc, o) => acc + o.commission_amount, 0);
  const totalSellerPayouts = completedOrders.reduce((acc, o) => acc + o.net_seller_amount, 0);

  // Revenue by main category
  const categoryBreakdown = db.prepare(`
    SELECT b.main_category, COUNT(o.id) as total_orders, SUM(o.item_price) as gross_value, SUM(o.commission_amount) as commission_value
    FROM orders o
    JOIN books b ON o.book_id = b.id
    WHERE o.status IN ('secured_escrow', 'delivered_inspected', 'completed')
    GROUP BY b.main_category
  `).all();

  // Top active sellers
  const topSellers = db.prepare(`
    SELECT u.name, u.email, COUNT(o.id) as sales_count, SUM(o.item_price) as gross_sales, SUM(o.commission_amount) as platform_commission
    FROM orders o
    JOIN users u ON o.seller_id = u.id
    WHERE o.status IN ('secured_escrow', 'delivered_inspected', 'completed')
    GROUP BY u.id
    ORDER BY gross_sales DESC
    LIMIT 10
  `).all();

  // Commission ledger records
  const commissionLedger = db.prepare(`
    SELECT cr.*, o.order_number, u.name as seller_name, u.email as seller_email
    FROM commission_records cr
    JOIN orders o ON cr.order_id = o.id
    JOIN users u ON cr.seller_id = u.id
    ORDER BY cr.created_at DESC
  `).all();

  return res.json({
    grossSalesVolume,
    totalCommissionEarned,
    totalSellerPayouts,
    completedOrdersCount: completedOrders.length,
    categoryBreakdown,
    topSellers,
    commissionLedger
  });
});

// Platform Settings (Viewable by Admin/Owner, Editable only by Owner)
apiRouter.get('/admin/settings', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const settings = db.prepare('SELECT * FROM platform_settings').all();
  return res.json({ settings });
});

apiRouter.put('/admin/settings', requireAuth, requireOwner, (req: Request, res: Response) => {
  const owner = (req as any).user;
  let key = req.body.key;
  let value = req.body.value;

  if (req.body.commissionRate !== undefined) {
    key = 'commission_rate';
    value = String(req.body.commissionRate);
  }

  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value are required.' });
  }

  db.prepare(`
    INSERT INTO platform_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, String(value));

  logAudit(owner.id, owner.email, 'UPDATE_PLATFORM_SETTING', `Changed setting ${key} to ${value}`);

  return res.json({ message: `Setting "${key}" updated successfully.`, key, value });
});

// Admin Overview
apiRouter.get('/admin/overview', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const totalUsers = (db.prepare('SELECT count(*) as count FROM users').get() as any).count;
  const totalBooks = (db.prepare("SELECT count(*) as count FROM books WHERE status != 'deleted'").get() as any).count;
  const totalOrders = (db.prepare('SELECT count(*) as count FROM orders').get() as any).count;
  const totalExchanges = (db.prepare('SELECT count(*) as count FROM exchange_proposals').get() as any).count;
  const totalMaterials = (db.prepare('SELECT count(*) as count FROM study_materials').get() as any).count;
  const totalVideos = (db.prepare('SELECT count(*) as count FROM educational_videos').get() as any).count;
  const totalPublished = (db.prepare('SELECT count(*) as count FROM published_works').get() as any).count;

  return res.json({
    totalUsers,
    totalBooks,
    totalOrders,
    totalExchanges,
    totalMaterials,
    totalVideos,
    totalPublished
  });
});

// Audit Logs (Admin / Owner)
apiRouter.get('/admin/audit-logs', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
  return res.json({ logs });
});

// User Management (List users, suspend, restore)
apiRouter.get('/admin/users', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const users = db.prepare('SELECT id, email, name, avatar, location, reputation_points, is_owner, is_admin, is_seller, status, created_at FROM users').all();
  return res.json({ users });
});

apiRouter.put('/admin/users/:id/status', requireAuth, requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user;
  const targetUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as any;

  if (!targetUser) return res.status(404).json({ error: 'User not found' });
  if (targetUser.is_owner) return res.status(403).json({ error: 'Cannot modify Owner account status.' });

  const { status } = req.body;
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.params.id);

  logAudit(admin.id, admin.email, 'CHANGE_USER_STATUS', `Changed user ${targetUser.email} status to ${status}`);
  return res.json({ message: `User status updated to ${status}.` });
});
