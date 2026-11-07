export type PageRoute =
  | 'home'
  | 'browse'
  | 'study'
  | 'videos'
  | 'novels'
  | 'comics'
  | 'exchange'
  | 'publish'
  | 'free'
  | 'library'
  | 'uploads'
  | 'channel'
  | 'publications'
  | 'messages'
  | 'feedback'
  | 'admin'
  | 'about'
  | 'help'
  | 'settings'
  | 'account'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-email'
  | 'auth-callback'
  | 'profile'
  | 'dashboard'
  | 'seller-dashboard'
  | 'creator-dashboard'
  | 'author-dashboard';

export type BookMainCategory = 'educational' | 'novel' | 'comic' | 'general' | 'published';

export type EducationalBoard =
  | 'CBSE'
  | 'ICSE'
  | 'NCERT'
  | 'RBSE'
  | 'UP Board'
  | 'Bihar Board'
  | 'Maharashtra Board'
  | 'College / University'
  | 'Competitive Exams';

export type EducationalClass =
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'Undergraduate (UG)'
  | 'Postgraduate (PG)'
  | 'Competitive (JEE/NEET/UPSC/GATE)';

export type MaterialType =
  | 'Chapter-wise Notes'
  | 'PDF Study Material'
  | 'Previous Year Papers'
  | 'Sample Question Papers'
  | 'Handwritten Notes'
  | 'Formula Sheets & Cheats'
  | 'Assignments & Worksheets'
  | 'Revision Guides';

export type BookCondition =
  | 'Brand New'
  | 'Like New'
  | 'Very Good'
  | 'Good'
  | 'Acceptable'
  | 'Annotated / Study-Marked';

export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  location: string;
  campusOrSchool?: string;
  isVerifiedStudent?: boolean;
  isVerifiedSeller?: boolean;
  memberSince: string;
  phone?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  mainCategory: BookMainCategory;
  subcategory: string; // e.g. "Science", "Physics", "Romance", "Manga", "JEE Advanced"
  board?: EducationalBoard;
  classLevel?: EducationalClass;
  subject?: string;
  description: string;
  originalPrice: number;
  sellingPrice: number;
  condition: BookCondition;
  conditionNotes?: string;
  seller: SellerProfile;
  location: string;
  forSale: boolean;
  forExchange: boolean;
  isFreeDonation: boolean;
  exchangeWishlist?: string[]; // what the owner wants in exchange
  isbn?: string;
  edition?: string;
  language: string;
  pageCount?: number;
  tags: string[];
  createdAt: string;
  digitalAvailable?: boolean;
  digitalSampleContent?: string;
  status: 'available' | 'reserved' | 'sold' | 'traded';
}

export interface StudyMaterial {
  id: string;
  title: string;
  board: EducationalBoard;
  classLevel: EducationalClass;
  subject: string;
  chapter: string;
  materialType: MaterialType;
  uploaderName: string;
  uploaderRole: 'Teacher' | 'Ranker Student' | 'Professor' | 'School Contributor';
  uploaderAvatar: string;
  rating: number;
  downloadsCount: number;
  pageCount: number;
  fileSize: string;
  description: string;
  previewSnippet: string;
  fullContent?: string;
  pdfUrl?: string;
  verifiedByTeacher: boolean;
  uploadedAt: string;
}

export interface VideoComment {
  id: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  comment: string;
  createdAt: string;
  likes: number;
}

export interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // embed or video stream
  creatorName: string;
  creatorAvatar: string;
  creatorChannelId: string;
  board?: EducationalBoard;
  classLevel?: EducationalClass;
  subject: string;
  chapter: string;
  category: 'Class 1-12' | 'Competitive' | 'College' | 'Practical Experiment' | 'Revision' | 'Career Guidance';
  duration: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  uploadedAt: string;
  comments: VideoComment[];
  chapters?: { time: string; title: string }[];
}

export interface CreatorChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bannerImage: string;
  description: string;
  subscribersCount: number;
  totalViews: number;
  videosCount: number;
  verified: boolean;
  playlists: { title: string; count: number; cover: string }[];
}

export interface ExchangeProposal {
  id: string;
  targetBookId: string;
  targetBook: Book;
  offeredBookIds: string[];
  offeredBooks: Book[];
  cashAdjustment: number; // positive = proposer pays cash extra; negative = asks for cash
  message: string;
  deliveryMethod: 'Campus Handover' | 'Local Public Spot' | 'Postal Courier';
  meetingPlace?: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'completed';
  createdAt: string;
  proposerId: string;
  proposerName: string;
  proposerAvatar: string;
  targetOwnerId: string;
  counterMessage?: string;
}

export interface PublishedWork {
  id: string;
  title: string;
  authorName: string;
  authorBio: string;
  authorAvatar: string;
  authorId: string;
  genre: string;
  category: 'Novel' | 'Comic' | 'Manga' | 'Textbook' | 'Poetry' | 'Short Story' | 'Graphic Novel' | 'Research' | 'Educational Guide';
  description: string;
  coverImage: string;
  manuscriptText: string;
  samplePanels?: string[]; // for comics
  pageCount: number;
  isFree: boolean;
  price: number;
  status: 'published' | 'pending_approval' | 'draft';
  likesCount: number;
  readsCount: number;
  reviewsCount: number;
  publishedAt: string;
  tags: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
  shippingOption: 'Free Campus Pickup' | 'Standard Delivery ($2.50)' | 'Express Courier ($4.99)';
  shippingCost: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOwner?: boolean;
  isAdmin: boolean;
  isModerator?: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isCreator: boolean;
  isAuthor: boolean;
  isTeacher?: boolean;
  emailVerified?: boolean;
  status?: string;
  createdAt?: string;
  location: string;
  boardOrUniversity?: string;
  phone?: string;
  bio?: string;
  reputationPoints: number;
  channelId?: string;
  activeRoleView?: 'buyer' | 'seller' | 'creator' | 'author' | 'teacher' | 'owner';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  bookReference?: { id: string; title: string; price: number };
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
  contextBookTitle?: string;
}

export interface AppNotification {
  id: string;
  type: 'order' | 'exchange' | 'message' | 'approval' | 'video' | 'like';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionRoute?: PageRoute;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  category: 'General' | 'Suggestion' | 'Complaint' | 'Bug Report' | 'Idea';
  rating: number;
  message: string;
  submittedAt: string;
  status: 'New' | 'Reviewed' | 'Resolved';
}
