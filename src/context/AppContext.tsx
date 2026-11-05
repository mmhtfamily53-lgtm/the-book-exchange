import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  PageRoute,
  Book,
  StudyMaterial,
  EducationalVideo,
  CreatorChannel,
  PublishedWork,
  ExchangeProposal,
  CartItem,
  UserAccount,
  ChatConversation,
  AppNotification,
  FeedbackSubmission,
  SellerProfile,
  ChatMessage
} from '../types';
import {
  mockBooks,
  mockStudyMaterials,
  mockEducationalVideos,
  mockCreatorChannels,
  mockPublishedWorks,
  mockExchangeProposals,
  mockChatConversations,
  mockNotifications,
  mockFeedbacks,
  initialCurrentUser
} from '../data/mockData';
import { api } from '../services/api';

export const guestProfile: UserAccount = {
  id: 'guest_user',
  name: 'Guest Visitor',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  bio: 'Exploring The Book Exchange as a guest.',
  location: 'India',
  phone: '',
  boardOrUniversity: 'Guest Reader',
  isBuyer: true,
  isSeller: false,
  isCreator: false,
  isAuthor: false,
  isAdmin: false,
  isOwner: false,
  emailVerified: false,
  status: 'active',
  reputationPoints: 0,
  activeRoleView: 'buyer'
};

export function routeToPath(route: PageRoute): string {
  switch (route) {
    case 'home':
      return '/';
    case 'browse':
      return '/browse';
    case 'study':
      return '/study';
    case 'videos':
      return '/videos';
    case 'novels':
      return '/novels';
    case 'comics':
      return '/comics';
    case 'exchange':
      return '/exchange';
    case 'publish':
      return '/publish';
    case 'free':
      return '/free';
    case 'library':
      return '/library';
    case 'uploads':
      return '/uploads';
    case 'channel':
      return '/channel';
    case 'publications':
      return '/publications';
    case 'messages':
      return '/messages';
    case 'feedback':
      return '/feedback';
    case 'admin':
      return '/admin';
    case 'about':
      return '/about';
    case 'help':
      return '/help';
    case 'settings':
      return '/settings';
    case 'account':
      return '/account';
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'forgot-password':
      return '/forgot-password';
    case 'verify-email':
      return '/verify-email';
    case 'profile':
      return '/profile';
    case 'dashboard':
      return '/dashboard';
    case 'seller-dashboard':
      return '/seller/dashboard';
    case 'creator-dashboard':
      return '/creator/dashboard';
    case 'author-dashboard':
      return '/author/dashboard';
    default:
      return '/';
  }
}

export function pathToRoute(pathname: string): PageRoute {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';
  switch (clean) {
    case '/':
      return 'home';
    case '/browse':
      return 'browse';
    case '/study':
      return 'study';
    case '/videos':
      return 'videos';
    case '/novels':
      return 'novels';
    case '/comics':
      return 'comics';
    case '/exchange':
      return 'exchange';
    case '/publish':
      return 'publish';
    case '/free':
      return 'free';
    case '/library':
      return 'library';
    case '/uploads':
      return 'uploads';
    case '/channel':
      return 'channel';
    case '/publications':
      return 'publications';
    case '/messages':
      return 'messages';
    case '/feedback':
      return 'feedback';
    case '/admin':
    case '/owner':
      return 'admin';
    case '/about':
      return 'about';
    case '/help':
      return 'help';
    case '/settings':
      return 'settings';
    case '/account':
      return 'account';
    case '/login':
      return 'login';
    case '/register':
      return 'register';
    case '/forgot-password':
      return 'forgot-password';
    case '/verify-email':
      return 'verify-email';
    case '/profile':
      return 'profile';
    case '/dashboard':
      return 'dashboard';
    case '/seller/dashboard':
    case '/seller-dashboard':
      return 'seller-dashboard';
    case '/creator/dashboard':
    case '/creator-dashboard':
      return 'creator-dashboard';
    case '/author/dashboard':
    case '/author-dashboard':
      return 'author-dashboard';
    default:
      return 'home';
  }
}

interface AppContextType {
  // Navigation & Routing
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  returnUrl: PageRoute | null;
  setReturnUrl: (url: PageRoute | null) => void;
  navigateWithAuthCheck: (targetRoute: PageRoute) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  isUniversalSearchOpen: boolean;
  openUniversalSearch: () => void;
  closeUniversalSearch: () => void;

  // Modals
  selectedBook: Book | null;
  openBookDetailModal: (book: Book) => void;
  closeBookDetailModal: () => void;

  selectedVideo: EducationalVideo | null;
  openVideoPlayerModal: (video: EducationalVideo) => void;
  closeVideoPlayerModal: () => void;

  selectedReader: {
    title: string;
    author: string;
    content: string;
    panels?: string[];
    category?: string;
  } | null;
  openReaderModal: (item: { title: string; author: string; content: string; panels?: string[]; category?: string }) => void;
  closeReaderModal: () => void;

  isExchangeModalOpen: boolean;
  targetBookForExchange: Book | null;
  openExchangeModal: (book: Book) => void;
  closeExchangeModal: () => void;

  isListBookModalOpen: boolean;
  openListBookModal: () => void;
  closeListBookModal: () => void;

  isPublishModalOpen: boolean;
  openPublishModal: () => void;
  closePublishModal: () => void;

  isUploadVideoModalOpen: boolean;
  openUploadVideoModal: () => void;
  closeUploadVideoModal: () => void;

  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;

  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Authentication & Multi-Role State
  currentUser: UserAccount;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  isAuthenticated: boolean;
  activeRoleView: 'buyer' | 'seller' | 'creator' | 'author' | 'teacher' | 'owner';
  setActiveRoleView: (role: 'buyer' | 'seller' | 'creator' | 'author' | 'teacher' | 'owner') => void;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string; user?: any }>;
  register: (data: any) => Promise<{ success: boolean; error?: string; user?: any }>;
  logout: () => Promise<void>;
  activateOrdinaryRole: (role: 'seller' | 'creator' | 'author' | 'teacher', details?: any) => Promise<{ success: boolean; error?: string }>;
  toggleUserRole: (roleKey: 'isBuyer' | 'isSeller' | 'isCreator' | 'isAuthor' | 'isAdmin') => void;
  loginUser: (email: string, name: string, roleSelection: { isBuyer: boolean; isSeller: boolean; isCreator: boolean; isAuthor: boolean }) => void;

  // Books
  books: Book[];
  addBook: (newBook: Omit<Book, 'id' | 'createdAt' | 'status' | 'seller'>) => void;
  deleteBook: (id: string) => void;
  updateBookStatus: (id: string, status: Book['status']) => void;

  // Study Materials
  studyMaterials: StudyMaterial[];
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'downloadsCount' | 'rating' | 'verifiedByTeacher'>) => void;
  downloadMaterial: (id: string) => void;

  // Videos & Channels
  videos: EducationalVideo[];
  channels: CreatorChannel[];
  addVideo: (vid: Omit<EducationalVideo, 'id' | 'views' | 'likes' | 'uploadedAt' | 'comments'>) => void;
  likeVideo: (id: string) => void;
  addVideoComment: (videoId: string, commentText: string) => void;
  createOrUpdateChannel: (name: string, description: string, handle: string) => void;

  // Publishing
  publishedWorks: PublishedWork[];
  publishWork: (work: Omit<PublishedWork, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorBio' | 'publishedAt' | 'likesCount' | 'readsCount' | 'reviewsCount' | 'status'>) => void;
  approvePublication: (id: string) => void;
  rejectPublication: (id: string) => void;

  // Exchange
  exchangeProposals: ExchangeProposal[];
  createExchangeProposal: (
    targetBook: Book,
    offeredBooks: Book[],
    cashDiff: number,
    message: string,
    delivery: ExchangeProposal['deliveryMethod'],
    meetingPlace?: string
  ) => void;
  updateProposalStatus: (id: string, status: ExchangeProposal['status'], counterMsg?: string) => void;

  // Cart & Orders
  cartItems: CartItem[];
  addToCart: (book: Book, shipping?: CartItem['shippingOption']) => void;
  removeFromCart: (bookId: string) => void;
  updateCartShipping: (bookId: string, shipping: CartItem['shippingOption']) => void;
  clearCart: () => void;
  checkoutCart: () => { success: boolean; orderId: string };
  orderHistory: { id: string; items: CartItem[]; total: number; date: string; status: string }[];

  // Library & Wishlist
  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
  libraryBookIds: string[];
  addToLibrary: (bookId: string) => void;

  // Messages & Notifications
  conversations: ChatConversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (chatId: string, text: string) => void;
  startChatWithSeller: (seller: SellerProfile, initialMessage?: string, bookRef?: { id: string; title: string; price: number }) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Feedback
  feedbacks: FeedbackSubmission[];
  submitFeedback: (fb: Omit<FeedbackSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  updateFeedbackStatus: (id: string, status: FeedbackSubmission['status']) => void;

  // Global search
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  globalFilterCategory: string;
  setGlobalFilterCategory: (c: string) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & URL Routing
  const [currentPage, setCurrentPageState] = useState<PageRoute>(() => pathToRoute(window.location.pathname));
  const [returnUrl, setReturnUrl] = useState<PageRoute | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState<boolean>(false);

  const setCurrentPage = (page: PageRoute) => {
    setCurrentPageState(page);
    const targetPath = routeToPath(page);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPageState(pathToRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateWithAuthCheck = (targetRoute: PageRoute) => {
    const protectedRoutes: PageRoute[] = [
      'account',
      'profile',
      'settings',
      'dashboard',
      'seller-dashboard',
      'creator-dashboard',
      'author-dashboard',
      'library',
      'uploads',
      'channel',
      'publications',
      'messages',
      'admin'
    ];
    if (protectedRoutes.includes(targetRoute) && !isAuthenticated) {
      setReturnUrl(targetRoute);
      setCurrentPage('login');
    } else {
      setCurrentPage(targetRoute);
    }
  };

  // Modals
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo | null>(null);
  const [selectedReader, setSelectedReader] = useState<{
    title: string;
    author: string;
    content: string;
    panels?: string[];
    category?: string;
  } | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState<boolean>(false);
  const [targetBookForExchange, setTargetBookForExchange] = useState<Book | null>(null);
  const [isListBookModalOpen, setIsListBookModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('tbe_dark_mode') === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('tbe_dark_mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Authentication & Multi-Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('tbe_auth_token'));
  });

  const [activeRoleView, setActiveRoleView] = useState<'buyer' | 'seller' | 'creator' | 'author' | 'teacher' | 'owner'>('buyer');

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const token = localStorage.getItem('tbe_auth_token');
    const saved = localStorage.getItem('tbe_user');
    if (token && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return guestProfile;
      }
    }
    return guestProfile;
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('tbe_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tbe_user');
    }
  }, [currentUser, isAuthenticated]);

  // Synchronize initial state with backend SQLite database
  useEffect(() => {
    let isMounted = true;
    async function syncBackendData() {
      try {
        const token = localStorage.getItem('tbe_auth_token');
        if (token) {
          const me = await api.getMe().catch(() => null);
          if (me && me.user && isMounted) {
            setCurrentUser(me.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('tbe_auth_token');
            if (isMounted) {
              setIsAuthenticated(false);
              setCurrentUser(guestProfile);
            }
          }
        } else {
          if (isMounted) {
            setIsAuthenticated(false);
            setCurrentUser(guestProfile);
          }
        }

        const booksRes = await api.getBooks().catch(() => null);
        if (booksRes && Array.isArray(booksRes.books) && booksRes.books.length > 0 && isMounted) {
          setBooks(booksRes.books);
        }

        const notesRes = await api.getStudyMaterials().catch(() => null);
        if (notesRes && Array.isArray(notesRes.materials) && notesRes.materials.length > 0 && isMounted) {
          setStudyMaterials(notesRes.materials);
        }

        const vidsRes = await api.getVideos().catch(() => null);
        if (vidsRes && Array.isArray(vidsRes.videos) && vidsRes.videos.length > 0 && isMounted) {
          setVideos(vidsRes.videos);
        }

        const pubRes = await api.getPublishedWorks().catch(() => null);
        if (pubRes && Array.isArray(pubRes.works) && pubRes.works.length > 0 && isMounted) {
          setPublishedWorks(pubRes.works);
        }

        const propRes = await api.getExchangeProposals().catch(() => null);
        if (propRes && Array.isArray(propRes.proposals) && propRes.proposals.length > 0 && isMounted) {
          setExchangeProposals(propRes.proposals);
        }
      } catch (err) {
        console.warn('Initial backend sync info:', err);
      }
    }
    syncBackendData();
    return () => { isMounted = false; };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.login(credentials);
      if (res && res.token && res.user) {
        localStorage.setItem('tbe_auth_token', res.token);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        if (returnUrl) {
          const target = returnUrl;
          setReturnUrl(null);
          setCurrentPage(target);
        } else {
          setCurrentPage('account');
        }
        return { success: true, user: res.user };
      }
      return { success: false, error: res?.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      if (res && res.token && res.user) {
        localStorage.setItem('tbe_auth_token', res.token);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        if (returnUrl) {
          const target = returnUrl;
          setReturnUrl(null);
          setCurrentPage(target);
        } else {
          setCurrentPage('account');
        }
        return { success: true, user: res.user };
      }
      return { success: false, error: res?.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      localStorage.removeItem('tbe_auth_token');
      localStorage.removeItem('tbe_user');
      setIsAuthenticated(false);
      setCurrentUser(guestProfile);
      setCurrentPage('account');
    }
  };

  const activateOrdinaryRole = async (role: 'seller' | 'creator' | 'author' | 'teacher', details?: any) => {
    try {
      const res = await api.activateRole(role, details);
      if (res && res.user) {
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: res?.error || 'Activation failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Role activation failed' };
    }
  };

  const toggleUserRole = (roleKey: 'isBuyer' | 'isSeller' | 'isCreator' | 'isAuthor' | 'isAdmin') => {
    setCurrentUser(prev => ({
      ...prev,
      [roleKey]: !prev[roleKey]
    }));
  };

  const loginUser = (email: string, name: string, roleSelection: { isBuyer: boolean; isSeller: boolean; isCreator: boolean; isAuthor: boolean }) => {
    setCurrentUser(prev => ({
      ...prev,
      name,
      email,
      ...roleSelection
    }));
    setIsAuthModalOpen(false);
  };

  // Books
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('tbe_books');
    return saved ? JSON.parse(saved) : mockBooks;
  });

  useEffect(() => {
    localStorage.setItem('tbe_books', JSON.stringify(books));
  }, [books]);

  const addBook = (newBookData: Omit<Book, 'id' | 'createdAt' | 'status' | 'seller'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `bk_usr_${Date.now()}`,
      createdAt: 'Just now',
      status: 'available',
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        rating: 5.0,
        reviewsCount: 1,
        location: currentUser.location,
        campusOrSchool: currentUser.boardOrUniversity || 'Campus Member',
        isVerifiedStudent: true,
        isVerifiedSeller: true,
        memberSince: '2024'
      }
    };
    setBooks(prev => [newBook, ...prev]);
    // Ensure seller role is enabled
    if (!currentUser.isSeller) {
      setCurrentUser(prev => ({ ...prev, isSeller: true }));
    }
    // Asynchronously persist to SQLite
    api.createBook(newBook).catch((e: any) => console.warn('Sync create book:', e));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    api.deleteBook(id).catch((e: any) => console.warn('Sync delete book:', e));
  };

  const updateBookStatus = (id: string, status: Book['status']) => {
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
    api.updateBook(id, { status }).catch((e: any) => console.warn('Sync update book status:', e));
  };

  // Study Materials
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('tbe_study_materials');
    return saved ? JSON.parse(saved) : mockStudyMaterials;
  });

  useEffect(() => {
    localStorage.setItem('tbe_study_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  const addStudyMaterial = (mat: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'downloadsCount' | 'rating' | 'verifiedByTeacher'>) => {
    const newMat: StudyMaterial = {
      ...mat,
      id: `mat_${Date.now()}`,
      uploadedAt: 'Just now',
      downloadsCount: 1,
      rating: 5.0,
      verifiedByTeacher: true
    };
    setStudyMaterials(prev => [newMat, ...prev]);
    api.createStudyMaterial(newMat).catch((e: any) => console.warn('Sync study material:', e));
    confetti({ particleCount: 40, spread: 50 });
  };

  const downloadMaterial = (id: string) => {
    setStudyMaterials(prev =>
      prev.map(m => (m.id === id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m))
    );
    api.incrementDownload(id).catch((e: any) => console.warn('Sync increment download:', e));
  };

  // Videos
  const [videos, setVideos] = useState<EducationalVideo[]>(() => {
    const saved = localStorage.getItem('tbe_videos');
    return saved ? JSON.parse(saved) : mockEducationalVideos;
  });

  useEffect(() => {
    localStorage.setItem('tbe_videos', JSON.stringify(videos));
  }, [videos]);

  const [channels, setChannels] = useState<CreatorChannel[]>(() => {
    const saved = localStorage.getItem('tbe_channels');
    return saved ? JSON.parse(saved) : mockCreatorChannels;
  });

  const addVideo = (vid: Omit<EducationalVideo, 'id' | 'views' | 'likes' | 'uploadedAt' | 'comments'>) => {
    const newVid: EducationalVideo = {
      ...vid,
      id: `vid_${Date.now()}`,
      views: 1,
      likes: 1,
      uploadedAt: 'Just now',
      comments: []
    };
    setVideos(prev => [newVid, ...prev]);
    if (!currentUser.isCreator) {
      setCurrentUser(prev => ({ ...prev, isCreator: true }));
    }
    api.createVideo(newVid).catch((e: any) => console.warn('Sync create video:', e));
    confetti({ particleCount: 50, spread: 60 });
  };

  const likeVideo = (id: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === id) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likes: isLiked ? v.likes + 1 : Math.max(0, v.likes - 1)
          };
        }
        return v;
      })
    );
    api.likeVideo(id).catch((e: any) => console.warn('Sync like video:', e));
  };

  const addVideoComment = (videoId: string, commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userBadge: currentUser.boardOrUniversity || 'Student',
      comment: commentText,
      createdAt: 'Just now',
      likes: 0
    };
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            comments: [newComment, ...v.comments]
          };
        }
        return v;
      })
    );
    api.addVideoComment(videoId, commentText).catch((e: any) => console.warn('Sync add comment:', e));
  };

  const createOrUpdateChannel = (name: string, description: string, handle: string) => {
    const updatedChannel: CreatorChannel = {
      id: currentUser.channelId || `chan_${Date.now()}`,
      name,
      description,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatar: currentUser.avatar,
      bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      subscribersCount: 1,
      totalViews: 10,
      videosCount: 1,
      verified: true,
      playlists: [{ title: 'Popular Uploads', count: 1, cover: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80' }]
    };

    setChannels(prev => {
      const existing = prev.find(c => c.id === updatedChannel.id);
      if (existing) {
        return prev.map(c => (c.id === updatedChannel.id ? updatedChannel : c));
      }
      return [updatedChannel, ...prev];
    });

    setCurrentUser(prev => ({
      ...prev,
      isCreator: true,
      channelId: updatedChannel.id
    }));
  };

  // Publishing
  const [publishedWorks, setPublishedWorks] = useState<PublishedWork[]>(() => {
    const saved = localStorage.getItem('tbe_published');
    return saved ? JSON.parse(saved) : mockPublishedWorks;
  });

  useEffect(() => {
    localStorage.setItem('tbe_published', JSON.stringify(publishedWorks));
  }, [publishedWorks]);

  const publishWork = (
    work: Omit<
      PublishedWork,
      'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorBio' | 'publishedAt' | 'likesCount' | 'readsCount' | 'reviewsCount' | 'status'
    >
  ) => {
    const newWork: PublishedWork = {
      ...work,
      id: `pub_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorBio: currentUser.bio || 'Independent Author & Creator on The Book Exchange.',
      publishedAt: 'Today',
      likesCount: 0,
      readsCount: 0,
      reviewsCount: 0,
      status: 'published' // Immediately ready for reader preview and public reading!
    };
    setPublishedWorks(prev => [newWork, ...prev]);

    // Also optionally cross-post to Marketplace as a published book!
    const newBookListing: Book = {
      id: `bk_pub_${newWork.id}`,
      title: newWork.title,
      author: `${newWork.authorName} (Indie Author)`,
      coverImage: newWork.coverImage,
      mainCategory: 'published',
      subcategory: newWork.category,
      description: newWork.description,
      originalPrice: newWork.price ? Math.round(newWork.price * 1.5) : 199,
      sellingPrice: newWork.price,
      condition: 'Brand New',
      conditionNotes: 'Direct digital eBook and author print release.',
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        rating: 5.0,
        reviewsCount: 0,
        location: currentUser.location,
        isVerifiedStudent: false,
        isVerifiedSeller: true,
        memberSince: '2024'
      },
      location: currentUser.location,
      forSale: true,
      forExchange: false,
      isFreeDonation: newWork.isFree,
      digitalAvailable: true,
      digitalSampleContent: newWork.manuscriptText.slice(0, 800),
      language: 'English',
      pageCount: newWork.pageCount,
      tags: ['Indie Author', 'Self-Published', newWork.genre],
      createdAt: 'Just now',
      status: 'available'
    };
    setBooks(prev => [newBookListing, ...prev]);

    if (!currentUser.isAuthor) {
      setCurrentUser(prev => ({ ...prev, isAuthor: true }));
    }

    // Persist to backend
    api.publishWork(newWork).catch((e: any) => console.warn('Sync publish work:', e));
    api.createBook(newBookListing).catch((e: any) => console.warn('Sync publish book listing:', e));

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const approvePublication = (id: string) => {
    setPublishedWorks(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'published' } : p))
    );
    api.updateWorkStatus(id, 'published').catch((e: any) => console.warn('Sync approve work:', e));
  };

  const rejectPublication = (id: string) => {
    setPublishedWorks(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'draft' } : p))
    );
    api.updateWorkStatus(id, 'draft').catch((e: any) => console.warn('Sync reject work:', e));
  };

  // Exchange
  const [exchangeProposals, setExchangeProposals] = useState<ExchangeProposal[]>(() => {
    const saved = localStorage.getItem('tbe_proposals');
    return saved ? JSON.parse(saved) : mockExchangeProposals;
  });

  useEffect(() => {
    localStorage.setItem('tbe_proposals', JSON.stringify(exchangeProposals));
  }, [exchangeProposals]);

  const createExchangeProposal = (
    targetBook: Book,
    offeredBooks: Book[],
    cashDiff: number,
    message: string,
    delivery: ExchangeProposal['deliveryMethod'],
    meetingPlace?: string
  ) => {
    const newProposal: ExchangeProposal = {
      id: `prop_${Date.now()}`,
      targetBookId: targetBook.id,
      targetBook,
      offeredBookIds: offeredBooks.map(b => b.id),
      offeredBooks,
      cashAdjustment: cashDiff,
      message,
      deliveryMethod: delivery,
      meetingPlace,
      status: 'pending',
      createdAt: 'Just now',
      proposerId: currentUser.id,
      proposerName: currentUser.name,
      proposerAvatar: currentUser.avatar,
      targetOwnerId: targetBook.seller.id
    };
    setExchangeProposals(prev => [newProposal, ...prev]);

    // Persist to backend SQLite
    api.createExchangeProposal({
      targetBookId: targetBook.id,
      offeredBookIds: offeredBooks.map(b => b.id),
      cashAdjustment: cashDiff,
      message,
      deliveryMethod: delivery,
      meetingPlace
    }).catch((e: any) => console.warn('Sync create exchange proposal:', e));

    // Send automated chat message to seller
    startChatWithSeller(
      targetBook.seller,
      `Hello ${targetBook.seller.name}! I proposed an exchange for "${targetBook.title}". Offered ${offeredBooks.length} book(s) with ${cashDiff >= 0 ? `+Rs ${cashDiff} cash` : `Rs ${Math.abs(cashDiff)} cash request`}. Delivery: ${delivery}.`,
      { id: targetBook.id, title: targetBook.title, price: targetBook.sellingPrice }
    );

    confetti({ particleCount: 60, spread: 70 });
  };

  const updateProposalStatus = (id: string, status: ExchangeProposal['status'], counterMsg?: string) => {
    setExchangeProposals(prev =>
      prev.map(p => (p.id === id ? { ...p, status, counterMessage: counterMsg || p.counterMessage } : p))
    );
    api.updateExchangeProposalStatus(id, status, counterMsg).catch((e: any) => console.warn('Sync proposal status:', e));
  };

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tbe_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tbe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book: Book, shipping: CartItem['shippingOption'] = 'Free Campus Pickup') => {
    const shippingCost = shipping === 'Express Courier ($4.99)' ? 4.99 : shipping === 'Standard Delivery ($2.50)' ? 2.5 : 0;
    setCartItems(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        return prev;
      }
      return [...prev, { book, quantity: 1, shippingOption: shipping, shippingCost }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (bookId: string) => {
    setCartItems(prev => prev.filter(i => i.book.id !== bookId));
  };

  const updateCartShipping = (bookId: string, shipping: CartItem['shippingOption']) => {
    const shippingCost = shipping === 'Express Courier ($4.99)' ? 4.99 : shipping === 'Standard Delivery ($2.50)' ? 2.5 : 0;
    setCartItems(prev =>
      prev.map(i => (i.book.id === bookId ? { ...i, shippingOption: shipping, shippingCost } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const [orderHistory, setOrderHistory] = useState<{ id: string; items: CartItem[]; total: number; date: string; status: string }[]>(() => {
    const saved = localStorage.getItem('tbe_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const checkoutCart = () => {
    const total = cartItems.reduce((acc, curr) => acc + curr.book.sellingPrice + curr.shippingCost, 0);
    const orderId = `TBE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      items: [...cartItems],
      total,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Confirmed & Escrow Protected'
    };

    setOrderHistory(prev => [newOrder, ...prev]);
    localStorage.setItem('tbe_orders', JSON.stringify([newOrder, ...orderHistory]));

    // Mark books as sold
    const purchasedBookIds = cartItems.map(c => c.book.id);
    setBooks(prev => prev.map(b => (purchasedBookIds.includes(b.id) ? { ...b, status: 'sold' } : b)));

    // Asynchronously persist to backend SQLite to generate real commission ledger and escrow records
    cartItems.forEach(item => {
      api.createOrder({
        bookId: item.book.id,
        deliveryAddress: currentUser.location || 'Campus Student Hostel, Delhi University',
        deliveryPhone: currentUser.phone || '+91 98765 43210',
        shippingOption: item.shippingOption
      }).catch((e: any) => console.warn('Sync create backend order:', e));
    });

    clearCart();
    confetti({ particleCount: 80, spread: 80 });
    return { success: true, orderId };
  };

  // Wishlist & Library
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tbe_wishlist');
    return saved ? JSON.parse(saved) : ['bk_edu_02', 'bk_nov_02'];
  });

  useEffect(() => {
    localStorage.setItem('tbe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (bookId: string) => {
    setWishlist(prev => {
      const isAlready = prev.includes(bookId);
      if (isAlready) {
        api.removeFromWishlist(bookId).catch((e: any) => console.warn('Sync remove wishlist:', e));
        return prev.filter(id => id !== bookId);
      } else {
        api.addToWishlist(bookId).catch((e: any) => console.warn('Sync add wishlist:', e));
        return [...prev, bookId];
      }
    });
  };

  const isWishlisted = (bookId: string) => wishlist.includes(bookId);

  const [libraryBookIds, setLibraryBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tbe_library');
    return saved ? JSON.parse(saved) : ['bk_edu_01', 'pub_01'];
  });

  const addToLibrary = (bookId: string) => {
    setLibraryBookIds(prev => (prev.includes(bookId) ? prev : [...prev, bookId]));
  };

  // Messages & Notifications
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('tbe_chats');
    return saved ? JSON.parse(saved) : mockChatConversations;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tbe_chats', JSON.stringify(conversations));
  }, [conversations]);

  const sendMessage = (chatId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now'
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );
  };

  const startChatWithSeller = (seller: SellerProfile, initialMessage?: string, bookRef?: { id: string; title: string; price: number }) => {
    let existing = conversations.find(c => c.participantId === seller.id);
    if (!existing) {
      const newChat: ChatConversation = {
        id: `chat_${Date.now()}`,
        participantId: seller.id,
        participantName: seller.name,
        participantAvatar: seller.avatar,
        participantRole: seller.campusOrSchool || 'Book Exchange Member',
        contextBookTitle: bookRef?.title,
        lastMessage: initialMessage || 'Started conversation',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: initialMessage
          ? [
              {
                id: `m_${Date.now()}`,
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderAvatar: currentUser.avatar,
                text: initialMessage,
                timestamp: 'Just now',
                bookReference: bookRef
              }
            ]
          : []
      };
      setConversations(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    } else {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      setActiveChatId(existing.id);
    }
    setCurrentPage('messages');
  };

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('tbe_notifs');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Feedback
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => {
    const saved = localStorage.getItem('tbe_feedback');
    return saved ? JSON.parse(saved) : mockFeedbacks;
  });

  const submitFeedback = (fb: Omit<FeedbackSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newFb: FeedbackSubmission = {
      ...fb,
      id: `fb_${Date.now()}`,
      submittedAt: 'Just now',
      status: 'New'
    };
    setFeedbacks(prev => [newFb, ...prev]);
    api.submitFeedback(newFb).catch((e: any) => console.warn('Sync submit feedback:', e));
    confetti({ particleCount: 35, spread: 45 });
  };

  const updateFeedbackStatus = (id: string, status: FeedbackSubmission['status']) => {
    setFeedbacks(prev => prev.map(f => (f.id === id ? { ...f, status } : f)));
    api.updateFeedbackStatus(id, status).catch((e: any) => console.warn('Sync feedback status:', e));
  };

  // Search & Global filters
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalFilterCategory, setGlobalFilterCategory] = useState('all');

  // Modal open helpers
  const openBookDetailModal = (book: Book) => setSelectedBook(book);
  const closeBookDetailModal = () => setSelectedBook(null);

  const openVideoPlayerModal = (video: EducationalVideo) => setSelectedVideo(video);
  const closeVideoPlayerModal = () => setSelectedVideo(null);

  const openReaderModal = (item: { title: string; author: string; content: string; panels?: string[]; category?: string }) => {
    setSelectedReader(item);
  };
  const closeReaderModal = () => setSelectedReader(null);

  const openExchangeModal = (book: Book) => {
    setTargetBookForExchange(book);
    setIsExchangeModalOpen(true);
  };
  const closeExchangeModal = () => {
    setIsExchangeModalOpen(false);
    setTargetBookForExchange(null);
  };

  const openListBookModal = () => setIsListBookModalOpen(true);
  const closeListBookModal = () => setIsListBookModalOpen(false);

  const openPublishModal = () => setIsPublishModalOpen(true);
  const closePublishModal = () => setIsPublishModalOpen(false);

  const openUploadVideoModal = () => setIsUploadVideoModalOpen(true);
  const closeUploadVideoModal = () => setIsUploadVideoModalOpen(false);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openUniversalSearch = () => setIsUniversalSearchOpen(true);
  const closeUniversalSearch = () => setIsUniversalSearchOpen(false);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        returnUrl,
        setReturnUrl,
        navigateWithAuthCheck,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileSidebarOpen,
        setMobileSidebarOpen,
        isUniversalSearchOpen,
        openUniversalSearch,
        closeUniversalSearch,

        selectedBook,
        openBookDetailModal,
        closeBookDetailModal,

        selectedVideo,
        openVideoPlayerModal,
        closeVideoPlayerModal,

        selectedReader,
        openReaderModal,
        closeReaderModal,

        isExchangeModalOpen,
        targetBookForExchange,
        openExchangeModal,
        closeExchangeModal,

        isListBookModalOpen,
        openListBookModal,
        closeListBookModal,

        isPublishModalOpen,
        openPublishModal,
        closePublishModal,

        isUploadVideoModalOpen,
        openUploadVideoModal,
        closeUploadVideoModal,

        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,

        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,

        currentUser,
        setCurrentUser,
        isAuthenticated,
        activeRoleView,
        setActiveRoleView,
        login,
        register,
        logout,
        activateOrdinaryRole,
        toggleUserRole,
        loginUser,

        books,
        addBook,
        deleteBook,
        updateBookStatus,

        studyMaterials,
        addStudyMaterial,
        downloadMaterial,

        videos,
        channels,
        addVideo,
        likeVideo,
        addVideoComment,
        createOrUpdateChannel,

        publishedWorks,
        publishWork,
        approvePublication,
        rejectPublication,

        exchangeProposals,
        createExchangeProposal,
        updateProposalStatus,

        cartItems,
        addToCart,
        removeFromCart,
        updateCartShipping,
        clearCart,
        checkoutCart,
        orderHistory,

        wishlist,
        toggleWishlist,
        isWishlisted,
        libraryBookIds,
        addToLibrary,

        conversations,
        activeChatId,
        setActiveChatId,
        sendMessage,
        startChatWithSeller,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,

        feedbacks,
        submitFeedback,
        updateFeedbackStatus,

        globalSearchQuery,
        setGlobalSearchQuery,
        globalFilterCategory,
        setGlobalFilterCategory,

        darkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
