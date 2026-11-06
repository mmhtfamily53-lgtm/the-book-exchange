import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'book_exchange.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  console.log('[DB] Initializing The Book Exchange database schema...');

  db.exec(`
    -- Platform Settings Table
    CREATE TABLE IF NOT EXISTS platform_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      location TEXT DEFAULT 'New Delhi, India',
      phone TEXT,
      board_or_university TEXT,
      reputation_points INTEGER DEFAULT 100,
      channel_id TEXT,
      is_owner INTEGER DEFAULT 0,
      is_admin INTEGER DEFAULT 0,
      is_moderator INTEGER DEFAULT 0,
      is_buyer INTEGER DEFAULT 1,
      is_seller INTEGER DEFAULT 0,
      is_creator INTEGER DEFAULT 0,
      is_author INTEGER DEFAULT 0,
      is_teacher INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active', -- active, suspended, pending
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Books Table
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      main_category TEXT NOT NULL,
      subcategory TEXT NOT NULL,
      board TEXT,
      class_level TEXT,
      subject TEXT,
      description TEXT,
      original_price REAL DEFAULT 0,
      selling_price REAL NOT NULL,
      condition TEXT NOT NULL,
      condition_notes TEXT,
      seller_id TEXT NOT NULL,
      location TEXT,
      for_sale INTEGER DEFAULT 1,
      for_exchange INTEGER DEFAULT 1,
      is_free_donation INTEGER DEFAULT 0,
      exchange_wishlist TEXT, -- JSON array
      isbn TEXT,
      edition TEXT,
      language TEXT DEFAULT 'English',
      page_count INTEGER,
      tags TEXT, -- JSON array
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'available', -- available, reserved, sold, traded
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Orders Table (Escrow Protected)
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      book_title TEXT NOT NULL,
      item_price REAL NOT NULL,
      shipping_cost REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      commission_rate REAL NOT NULL, -- e.g. 5.0%
      commission_amount REAL NOT NULL,
      net_seller_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending_escrow', -- pending_escrow, secured_escrow, handover_scheduled, delivered_inspected, completed, refunded, cancelled
      delivery_address TEXT NOT NULL,
      delivery_phone TEXT NOT NULL,
      shipping_option TEXT NOT NULL,
      tracking_code TEXT,
      escrow_released INTEGER DEFAULT 0,
      buyer_confirmed INTEGER DEFAULT 0,
      seller_confirmed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    -- Commission Records Table
    CREATE TABLE IF NOT EXISTS commission_records (
      id TEXT PRIMARY KEY,
      order_id TEXT UNIQUE NOT NULL,
      seller_id TEXT NOT NULL,
      gross_amount REAL NOT NULL,
      commission_rate REAL NOT NULL,
      commission_amount REAL NOT NULL,
      net_seller_amount REAL NOT NULL,
      status TEXT DEFAULT 'held_in_escrow', -- held_in_escrow, collected, refunded
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    -- Exchange Proposals Table
    CREATE TABLE IF NOT EXISTS exchange_proposals (
      id TEXT PRIMARY KEY,
      target_book_id TEXT NOT NULL,
      target_owner_id TEXT NOT NULL,
      proposer_id TEXT NOT NULL,
      proposer_name TEXT NOT NULL,
      proposer_avatar TEXT,
      offered_book_ids TEXT NOT NULL, -- JSON array
      cash_adjustment REAL DEFAULT 0,
      message TEXT,
      delivery_method TEXT NOT NULL,
      meeting_place TEXT,
      status TEXT DEFAULT 'pending', -- pending, accepted, rejected, countered, confirmed, completed, cancelled
      counter_message TEXT,
      proposer_confirmed INTEGER DEFAULT 0,
      target_confirmed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (target_book_id) REFERENCES books(id),
      FOREIGN KEY (target_owner_id) REFERENCES users(id),
      FOREIGN KEY (proposer_id) REFERENCES users(id)
    );

    -- Study Materials Table
    CREATE TABLE IF NOT EXISTS study_materials (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      board TEXT NOT NULL,
      class_level TEXT NOT NULL,
      subject TEXT NOT NULL,
      chapter TEXT NOT NULL,
      material_type TEXT NOT NULL,
      uploader_id TEXT NOT NULL,
      uploader_name TEXT NOT NULL,
      uploader_role TEXT NOT NULL,
      uploader_avatar TEXT,
      rating REAL DEFAULT 5.0,
      downloads_count INTEGER DEFAULT 0,
      page_count INTEGER DEFAULT 10,
      file_size TEXT DEFAULT '3.5 MB',
      description TEXT,
      preview_snippet TEXT,
      full_content TEXT,
      verified_by_teacher INTEGER DEFAULT 1,
      copyright_confirmed INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploader_id) REFERENCES users(id)
    );

    -- Educational Videos Table
    CREATE TABLE IF NOT EXISTS educational_videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail TEXT NOT NULL,
      video_url TEXT NOT NULL,
      creator_id TEXT NOT NULL,
      creator_name TEXT NOT NULL,
      creator_avatar TEXT,
      creator_channel_id TEXT NOT NULL,
      board TEXT,
      class_level TEXT,
      subject TEXT NOT NULL,
      chapter TEXT NOT NULL,
      category TEXT NOT NULL,
      duration TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      chapters TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id)
    );

    -- Creator Channels Table
    CREATE TABLE IF NOT EXISTS creator_channels (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      handle TEXT UNIQUE NOT NULL,
      avatar TEXT,
      banner_image TEXT,
      description TEXT,
      subscribers_count INTEGER DEFAULT 0,
      total_views INTEGER DEFAULT 0,
      videos_count INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 1,
      playlists TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Published Works Table (Author Studio)
    CREATE TABLE IF NOT EXISTS published_works (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_bio TEXT,
      author_avatar TEXT,
      genre TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      cover_image TEXT NOT NULL,
      manuscript_text TEXT NOT NULL,
      sample_panels TEXT, -- JSON array
      page_count INTEGER DEFAULT 100,
      is_free INTEGER DEFAULT 1,
      price REAL DEFAULT 0,
      status TEXT DEFAULT 'published', -- draft, pending_approval, approved, published, rejected
      moderation_notes TEXT,
      likes_count INTEGER DEFAULT 0,
      reads_count INTEGER DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    -- Conversations & Messages
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user1_id TEXT NOT NULL,
      user2_id TEXT NOT NULL,
      context_book_title TEXT,
      last_message TEXT,
      last_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user1_id) REFERENCES users(id),
      FOREIGN KEY (user2_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_avatar TEXT,
      text TEXT NOT NULL,
      book_reference TEXT, -- JSON object
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    );

    -- Wishlists Table
    CREATE TABLE IF NOT EXISTS wishlists (
      user_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, book_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    -- Feedback Submissions Table
    CREATE TABLE IF NOT EXISTS feedback_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      category TEXT NOT NULL,
      rating INTEGER NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'New', -- New, Reviewed, Resolved
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Reviews & Ratings Table
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL, -- seller, book, publication
      target_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      reviewer_name TEXT NOT NULL,
      reviewer_avatar TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      verified_transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reviewer_id) REFERENCES users(id)
    );

    -- Admin Audit Logs Table
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      admin_email TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Password Resets Table
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Email Verifications Table
    CREATE TABLE IF NOT EXISTS email_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Role Applications & Activations Table
    CREATE TABLE IF NOT EXISTS role_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role_requested TEXT NOT NULL, -- seller, creator, author, teacher
      status TEXT DEFAULT 'approved', -- approved, pending, rejected
      details_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- User Sessions Table
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT,
      device_info TEXT,
      ip_address TEXT,
      last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Safe column migrations for existing databases
  try {
    db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 1');
  } catch (e) {
    // Column already exists
  }

  seedInitialData();

  // Synchronize owner password hash with requested founder password (@Momi5253)
  try {
    const ownerHash = bcrypt.hashSync('@Momi5253', 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(ownerHash, 'mmhtfamily53@gmail.com');
  } catch (e) {
    // Safe fallback
  }
}

function seedInitialData() {
  // Check if platform settings exist
  const existingSetting = db.prepare('SELECT value FROM platform_settings WHERE key = ?').get('commission_rate');
  if (!existingSetting) {
    console.log('[DB] Seeding platform configuration & settings...');
    const insertSetting = db.prepare('INSERT INTO platform_settings (key, value, description) VALUES (?, ?, ?)');
    insertSetting.run('commission_rate', '5.0', 'Platform commission percentage on completed book sales (e.g. 5.0%)');
    insertSetting.run('currency', 'INR', 'Default transaction currency');
    insertSetting.run('currency_symbol', '₹', 'Currency symbol');
    insertSetting.run('featured_listings_enabled', '0', 'Enable optional paid featured listings (disabled by default)');
    insertSetting.run('featured_listing_price', '49', 'Price in INR to feature a listing for 14 days');
    insertSetting.run('escrow_hold_days', '3', 'Days to hold funds before automated seller payout if no dispute');
    insertSetting.run('payment_gateway_mode', 'escrow_safe_mode', 'Current gateway mode (escrow_safe_mode / razorpay_live)');
    insertSetting.run('maintenance_mode', '0', 'Platform maintenance status');
    insertSetting.run('owner_email', 'mmhtfamily53@gmail.com', 'Founder and platform owner email');
  }

  // Check if users exist, seed the Owner and initial community profiles
  const usersCount = (db.prepare('SELECT count(*) as count FROM users').get() as { count: number }).count;
  if (usersCount === 0) {
    console.log('[DB] Seeding Owner account and community users...');
    const defaultPasswordHash = bcrypt.hashSync('@Momi5253', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (
        id, email, password_hash, name, avatar, bio, location, phone,
        board_or_university, reputation_points, is_owner, is_admin, is_moderator,
        is_buyer, is_seller, is_creator, is_author, is_teacher
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. OWNER ACCOUNT (Permanent founder account for mmhtfamily53@gmail.com)
    insertUser.run(
      'usr_owner_01',
      'mmhtfamily53@gmail.com',
      defaultPasswordHash,
      'Platform Owner (Founder)',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      'Founder and Chief Architect of The Book Exchange. Dedicated to making knowledge affordable for all students.',
      'New Delhi, India',
      '+91 98765 00001',
      'Platform Headquarters',
      1000,
      1, // is_owner
      1, // is_admin
      1, // is_moderator
      1, // is_buyer
      1, // is_seller
      1, // is_creator
      1, // is_author
      1  // is_teacher
    );

    // 2. Active Student Seller & Swapper
    insertUser.run(
      'usr_priya_02',
      'priya.sundaram@iit.edu',
      defaultPasswordHash,
      'Priya Sundaram',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      'Freshman at IIT Madras. Sharing semester physics guides and classic novels.',
      'Koramangala, Bengaluru',
      '+91 98765 43211',
      'IIT Madras / CBSE Alumnus',
      480,
      0, 0, 0, 1, 1, 0, 0, 0
    );

    // 3. Teacher & Educational Video Creator
    insertUser.run(
      'usr_teacher_03',
      'rajesh.physics@gmail.com',
      defaultPasswordHash,
      'Er. Rajesh Gupta',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      'Senior Physics Faculty (20+ yrs). Publishing visual lab experiments and formula sheets.',
      'South Extension, New Delhi',
      '+91 98765 43212',
      'Kendriya Vidyalaya Faculty',
      850,
      0, 0, 0, 1, 0, 1, 0, 1
    );

    // 4. Published Indie Author
    insertUser.run(
      'usr_author_04',
      'suniti.author@gmail.com',
      defaultPasswordHash,
      'Suniti Banerjee',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      'Independent historical novelist & essayist exploring old Delhi archives.',
      'Old Delhi, India',
      '+91 98765 43213',
      'Delhi Literary Guild',
      620,
      0, 0, 0, 1, 1, 0, 1, 0
    );

    // Record initial audit log
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, admin_email, action, details)
      VALUES (?, ?, ?, ?, ?)
    `).run('log_init', 'usr_owner_01', 'mmhtfamily53@gmail.com', 'PLATFORM_INITIALIZATION', 'Database schema bootstrapped and owner account seeded');
  }

  // Seed books if empty
  const booksCount = (db.prepare('SELECT count(*) as count FROM books').get() as { count: number }).count;
  if (booksCount === 0) {
    console.log('[DB] Seeding curriculum and general marketplace books...');
    const insertBook = db.prepare(`
      INSERT INTO books (
        id, title, author, cover_image, main_category, subcategory,
        board, class_level, subject, description, original_price, selling_price,
        condition, condition_notes, seller_id, location, for_sale, for_exchange,
        is_free_donation, exchange_wishlist, isbn, edition, language, page_count, tags, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBook.run(
      'bk_seed_01',
      'Concepts of Physics (Vol 1 & 2 Set) - HC Verma',
      'Dr. H.C. Verma',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
      'educational',
      'Physics',
      'CBSE',
      'Class 12',
      'Physics',
      'The foundational preparation set for CBSE Class 12 Boards and JEE Main/Advanced. Spines crisp, formulas sheet included.',
      950,
      380,
      'Like New',
      'Includes handwritten derivation formula sheet in pristine condition.',
      'usr_priya_02',
      'Bengaluru (Campus Handover / Courier)',
      1, 1, 0,
      JSON.stringify(['Halliday & Resnick Fundamentals of Physics', 'Calculus by Spivak']),
      '978-81-7709-187-8',
      '2023 Edition',
      'English',
      462,
      JSON.stringify(['Physics', 'JEE Main', 'Class 12', 'HC Verma']),
      'available'
    );

    insertBook.run(
      'bk_seed_02',
      'NCERT Mathematics for Class X (Annotated with Past Solved Papers)',
      'NCERT Editorial Board',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'educational',
      'Mathematics',
      'NCERT',
      'Class 10',
      'Mathematics',
      'Complete Class 10 NCERT Maths with pencil annotations on key theorems and 2018-2024 board questions.',
      220,
      85,
      'Very Good',
      'Pencil formulas in margins, intact binding, zero water stains.',
      'usr_owner_01',
      'New Delhi (Connaught Place / Campus)',
      1, 1, 0,
      JSON.stringify(['Class 11 NCERT Physics', 'RD Sharma Class 11']),
      '978-81-7450-634-4',
      '2024 Revised Edition',
      'English',
      328,
      JSON.stringify(['Class 10', 'CBSE', 'Maths', 'Board Exam']),
      'available'
    );

    insertBook.run(
      'bk_seed_03',
      'Introduction to Algorithms (CLRS 4th Edition)',
      'Cormen, Leiserson, Rivest, Stein',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
      'educational',
      'Computer Science',
      'College / University',
      'Undergraduate (UG)',
      'Computer Science',
      'Undergraduate computer science algorithms bible. Dynamic programming, graph algorithms, NP completeness.',
      1650,
      650,
      'Like New',
      'Hardly opened, no creases, clean white pages.',
      'usr_owner_01',
      'Delhi University North Campus',
      1, 1, 0,
      JSON.stringify(['Clean Code by Robert Martin', 'Designing Data-Intensive Apps']),
      '978-02-62046-30-5',
      '4th Edition',
      'English',
      1312,
      JSON.stringify(['Computer Science', 'Algorithms', 'CLRS', 'College']),
      'available'
    );

    insertBook.run(
      'bk_seed_04',
      'NCERT Science for Class IX (Free Student Donation)',
      'NCERT Board',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      'educational',
      'Science',
      'NCERT',
      'Class 9',
      'Science',
      'Donated for students who cannot afford new textbooks. Available completely free of cost.',
      195,
      0,
      'Good',
      'All pages intact, well preserved with brown protective cover.',
      'usr_owner_01',
      'Pan-India Dispatch / Free Pickup',
      0, 0, 1,
      JSON.stringify([]),
      '978-81-7450-492-0',
      '2023 Edition',
      'English',
      240,
      JSON.stringify(['Free Books', 'Class 9', 'NCERT', 'Donation']),
      'available'
    );

    insertBook.run(
      'bk_seed_05',
      'Dune (Deluxe Hardcover Collector Edition)',
      'Frank Herbert',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      'novel',
      'Science Fiction',
      null, null, null,
      'Set on the desert planet Arrakis. Deluxe edition with colored page edges and poster map.',
      1200,
      490,
      'Like New',
      'Original dust jacket and pull-out map included.',
      'usr_priya_02',
      'Bengaluru',
      1, 1, 0,
      JSON.stringify(['The Three-Body Problem', 'Hyperion']),
      '978-05-93099-32-2',
      'Deluxe Hardcover',
      'English',
      688,
      JSON.stringify(['Sci-Fi', 'Dune', 'Collector', 'Hardcover']),
      'available'
    );

    insertBook.run(
      'bk_seed_06',
      'Death Note: Complete All-in-One Edition',
      'Tsugumi Ohba & Takeshi Obata',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      'comic',
      'Manga',
      null, null, null,
      'All 12 volumes and 2,400 pages of the legendary psychological manga collected into a single black-edge tome.',
      1800,
      750,
      'Very Good',
      'Corners clean, silver spine lettering crisp.',
      'usr_priya_02',
      'Bengaluru / Mumbai',
      1, 1, 0,
      JSON.stringify(['Berserk Deluxe Vol 1', 'Vinland Saga Book 1']),
      '978-14-21598-10-9',
      'All-in-One Compendium',
      'English',
      2400,
      JSON.stringify(['Manga', 'Death Note', 'Psychological', 'Shonen Jump']),
      'available'
    );
  }

  // Seed study materials if empty
  const matsCount = (db.prepare('SELECT count(*) as count FROM study_materials').get() as { count: number }).count;
  if (matsCount === 0) {
    console.log('[DB] Seeding study materials...');
    const insertMat = db.prepare(`
      INSERT INTO study_materials (
        id, title, board, class_level, subject, chapter, material_type,
        uploader_id, uploader_name, uploader_role, uploader_avatar, rating,
        downloads_count, page_count, file_size, description, preview_snippet, full_content, verified_by_teacher
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMat.run(
      'mat_seed_01',
      'Class 10 CBSE Science: Complete Chapter-wise Formula & Revision Notes',
      'CBSE',
      'Class 10',
      'Science',
      'All Chapters (Electricity, Chemical Reactions, Carbon Compounds)',
      'Handwritten Notes',
      'usr_teacher_03',
      'Er. Rajesh Gupta',
      'Senior Faculty',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      4.95,
      14200,
      48,
      '4.8 MB',
      'Concise handwritten formula sheets with color diagrams for Ohm’s law, ray diagrams, and saponification reactions.',
      '• Ohm’s Law: V = I × R\n• Mirror Formula: 1/f = 1/v + 1/u\n• Lens Formula: 1/f = 1/v - 1/u\n• Bleaching Powder: CaOCl2\n• Plaster of Paris: CaSO4·1/2H2O',
      'COMPREHENSIVE CBSE CLASS 10 SCIENCE REVISION DOSSIER\n\nChapter 1: Chemical Reactions\n- Combination: CaO + H2O -> Ca(OH)2 + Heat\n- Decomposition: 2FeSO4 -> Fe2O3 + SO2 + SO3\n\nChapter 12: Electricity\n- Current: I = Q / t (Ampere)\n- Resistance: R = ρ (l / A)\n- Series: R_eq = R1 + R2 + R3\n- Parallel: 1/R_eq = 1/R1 + 1/R2 + 1/R3',
      1
    );

    insertMat.run(
      'mat_seed_02',
      'Class 12 Physics: Derivations Master Sheet for Board Examination 2026',
      'CBSE',
      'Class 12',
      'Physics',
      'Electrostatics, Optics & Magnetism',
      'Formula Sheets & Cheats',
      'usr_owner_01',
      'Aarav Sharma (AIR 142 JEE)',
      'Ranker Contributor',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      4.9,
      19800,
      32,
      '3.2 MB',
      'Every single 5-mark and 3-mark derivation for CBSE Class 12: Gauss Theorem, Cyclotron, Transformer, Lens Maker Formula.',
      '1. Gauss Theorem: Φ = ∮ E·dA = q_in / ε₀\n2. Lens Maker: 1/f = (μ - 1)(1/R1 - 1/R2)\n3. De Broglie Wavelength: λ = h / p',
      'COMPLETE DERIVATION PROOFS FOR CLASS 12 BOARDS\n\n1. Electric field of infinite sheet: E = σ / (2ε₀)\n2. Prism formula: μ = sin((A + Dm)/2) / sin(A/2)\n3. Induced EMF: ε = -N (dΦ / dt)',
      1
    );
  }

  // Seed channels & videos if empty
  const vidsCount = (db.prepare('SELECT count(*) as count FROM educational_videos').get() as { count: number }).count;
  if (vidsCount === 0) {
    console.log('[DB] Seeding creator channel and educational videos...');
    db.prepare(`
      INSERT INTO creator_channels (
        id, user_id, name, handle, avatar, banner_image, description, subscribers_count, total_views, videos_count, playlists
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'chan_sharma_01',
      'usr_teacher_03',
      'Sharma Sir Physics Hub',
      '@SharmaPhysicsCBSE',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      'Simplifying Class 9-12 Physics and JEE Concepts through real-life lab demonstrations.',
      185000,
      4200000,
      32,
      JSON.stringify([{ title: 'Class 12 Boards Complete Revision', count: 18, cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=400&q=80' }])
    );

    db.prepare(`
      INSERT INTO educational_videos (
        id, title, description, thumbnail, video_url, creator_id, creator_name,
        creator_avatar, creator_channel_id, board, class_level, subject, chapter,
        category, duration, views, likes, chapters
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'vid_seed_01',
      'Electromagnetic Induction & Lenz’s Law in 15 Minutes | Visual Experiment Demo',
      'Watch copper pipe and neodymium magnet demonstrate Lenz’s Law in real-time. Derivation of induced EMF and solved board questions.',
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'usr_teacher_03',
      'Sharma Sir Physics Hub',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      'chan_sharma_01',
      'CBSE',
      'Class 12',
      'Physics',
      'Electromagnetic Induction',
      'Practical Experiment',
      '15:24',
      48900,
      3820,
      JSON.stringify([
        { time: '00:00', title: 'Introduction & Apparatus' },
        { time: '03:15', title: 'Live Copper Pipe Drop' },
        { time: '07:40', title: 'Derivation of Induced EMF' },
        { time: '12:10', title: 'Board Exam Questions' }
      ])
    );
  }

  // Seed published works if empty
  const pubsCount = (db.prepare('SELECT count(*) as count FROM published_works').get() as { count: number }).count;
  if (pubsCount === 0) {
    console.log('[DB] Seeding published indie works...');
    db.prepare(`
      INSERT INTO published_works (
        id, title, author_id, author_name, author_bio, author_avatar,
        genre, category, description, cover_image, manuscript_text, page_count,
        is_free, price, status, likes_count, reads_count, reviews_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'pub_seed_01',
      'The Silent Clocktower of Chandni Chowk',
      'usr_author_04',
      'Suniti Banerjee',
      'Historian, essayist, and debut historical mystery novelist.',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      'Historical Mystery',
      'Novel',
      'Set in 1932 old Delhi, where a reclusive clockmaker uncovers a clandestine freedom-movement telegraph machine inside the municipal clocktower.',
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      `PROLOGUE: THE CHANDNI NIGHTS\n\nBefore the electric cables crisscrossed the city sky like spiderwebs, the city lived by three sounds: the muezzin’s dawn call from Jama Masjid, the brass gong of the British garrison across the Yamuna, and the clocktower at the intersection of Fatehpuri.\n\nMaster Gagan had tended that clock since the Coronation Durbar of 1911. He knew every tooth of its eighty-four gears. But on the rainy Tuesday of August 9th, the clock struck thirteen.\n\nCHAPTER ONE: THE FOURTEENTH TOLL\n\n"A clock that tells thirteen lies twice," Gagan said, dipping a goose feather in machine lubricant. "A clock that tells fourteen is talking to somebody."\n\nBeside him, nineteen-year-old Shambhu wiped oil from his palms. "The police inspector from Kotwali came by at noon, Master. He was asking if anyone had keys to the attic staircase behind the face."\n\n"And what did you say?"\n\n"I told him the termites ate the door thirty years ago."`,
      220,
      0,
      0,
      'published',
      342,
      1840,
      46
    );
  }

  // Seed sample real order with commission calculation if empty
  const ordersCount = (db.prepare('SELECT count(*) as count FROM orders').get() as { count: number }).count;
  if (ordersCount === 0) {
    console.log('[DB] Seeding sample escrow order with commission calculation...');
    const orderId = 'ord_seed_01';
    const bookPrice = 380;
    const shipping = 60;
    const total = bookPrice + shipping;
    const commRate = 5.0; // 5%
    const commAmount = Math.round((bookPrice * commRate) / 100 * 100) / 100; // ₹19.00
    const netSeller = Math.round((bookPrice - commAmount) * 100) / 100; // ₹361.00

    db.prepare(`
      INSERT INTO orders (
        id, order_number, buyer_id, seller_id, book_id, book_title, item_price,
        shipping_cost, total_amount, commission_rate, commission_amount, net_seller_amount,
        status, delivery_address, delivery_phone, shipping_option, tracking_code, escrow_released,
        buyer_confirmed, seller_confirmed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      'TBE-982145',
      'usr_owner_01',
      'usr_priya_02',
      'bk_seed_01',
      'Concepts of Physics (Vol 1 & 2 Set) - HC Verma',
      bookPrice,
      shipping,
      total,
      commRate,
      commAmount,
      netSeller,
      'delivered_inspected',
      'Hostel 4, Room 218, Delhi University North Campus',
      '+91 98765 00001',
      'Standard Courier (₹60)',
      'TBE-INPOST-88192',
      1,
      1,
      1
    );

    db.prepare(`
      INSERT INTO commission_records (
        id, order_id, seller_id, gross_amount, commission_rate, commission_amount, net_seller_amount, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'comm_seed_01',
      orderId,
      'usr_priya_02',
      bookPrice,
      commRate,
      commAmount,
      netSeller,
      'collected'
    );
  }

  console.log('[DB] Database initialization and seeding complete.');
}
