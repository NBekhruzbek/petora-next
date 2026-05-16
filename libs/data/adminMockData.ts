// ─── Status Types ──────────────────────────────────────────────────────────

export type UserStatus = "active" | "paused" | "blocked" | "deleted";
export type FaqCategory =
  | "orders"
  | "delivery"
  | "returns"
  | "account"
  | "services";
export type NoticeBadge = "Important" | "Update";

export interface AdminFaq {
  id: string;
  category: FaqCategory;
  title: string;
  description: string;
  answer: string;
  bullets: string[];
}

export interface AdminNotice {
  id: string;
  title: string;
  summary: string;
  date: string;
  badge: NoticeBadge;
  fullText: string[];
  featured: boolean;
}
export type ProductStatus = "active" | "paused" | "deleted";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PostBoard = "FREE" | "NEWS" | "QNA";
export type PostStatus = "visible" | "hidden" | "deleted";
export type ReportStatus = "pending" | "resolved" | "dismissed";
export type ReportType = "post" | "comment" | "user";

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  memberType: "USER" | "SERVICE_AGENT";
  status: UserStatus;
  joinDate: string;
  avatar: string;
}

export interface AgentCertification {
  title: string;
  image: string;
}

export interface AdminAgent {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  serviceType: string;
  role?: string;
  bio?: string;
  experience?: string;
  approach?: string;
  languages?: string;
  serviceArea?: string;
  responseTime?: string;
  certifications?: AgentCertification[];
  rating: number;
  verified: boolean;
  totalBookings: number;
  status: UserStatus;
  avatar: string;
  joinDate: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  petType: string;
  price: number;
  discountedPrice: number;
  stock: number;
  status: ProductStatus;
  images: string[];
  description: string;
  benefits: string[];
  sold: number;
  createdAt: string;
}

export interface AdminService {
  id: string;
  name: string;
  category: string;
  agentUsername: string;
  agentName: string;
  location: string;
  priceMin: number;
  priceMax: number;
  availableAgents: number;
  status: ProductStatus;
}

export interface AdminOrderProduct {
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail: string;
  products: AdminOrderProduct[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface AdminPost {
  id: string;
  title: string;
  description: string;
  board: PostBoard;
  author: string;
  authorImage?: string;
  date: string;
  status: PostStatus;
  views: number;
  likes: number;
  commentsCount: number;
  answersCount?: number;
  image?: string;
}

export interface AdminReport {
  id: string;
  type: ReportType;
  targetTitle: string;
  targetAuthor: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: ReportStatus;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  active: boolean;
  pinned: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

export const dashboardStats: DashboardStats = {
  totalUsers: 1248,
  totalAgents: 86,
  totalProducts: 342,
  totalOrders: 4571,
  totalRevenue: 128450000,
};

export const mockUsers: AdminUser[] = [
  {
    id: "u1",
    username: "sophie_a",
    fullName: "Sophie Anderson",
    email: "sophie.anderson@email.com",
    memberType: "USER",
    status: "active",
    joinDate: "Jan 12, 2026",
    avatar: "/img/agent1.jpg",
  },
  {
    id: "u2",
    username: "james_kim",
    fullName: "James Kim",
    email: "james.kim@email.com",
    memberType: "USER",
    status: "active",
    joinDate: "Feb 3, 2026",
    avatar: "/img/agent2.jpg",
  },
  {
    id: "u3",
    username: "maria_g",
    fullName: "Maria Garcia",
    email: "maria.garcia@email.com",
    memberType: "SERVICE_AGENT",
    status: "active",
    joinDate: "Nov 20, 2025",
    avatar: "/img/agent3.jpg",
  },
  {
    id: "u4",
    username: "david_c",
    fullName: "David Chen",
    email: "david.chen@email.com",
    memberType: "USER",
    status: "paused",
    joinDate: "Oct 5, 2025",
    avatar: "/img/agent4.jpg",
  },
  {
    id: "u5",
    username: "emily_p",
    fullName: "Emily Park",
    email: "emily.park@email.com",
    memberType: "SERVICE_AGENT",
    status: "active",
    joinDate: "Mar 1, 2026",
    avatar: "/img/agent5.jpg",
  },
  {
    id: "u6",
    username: "lucas_m",
    fullName: "Lucas Martin",
    email: "lucas.martin@email.com",
    memberType: "USER",
    status: "active",
    joinDate: "Apr 14, 2026",
    avatar: "/img/agent1.jpg",
  },
  {
    id: "u7",
    username: "aisha_p",
    fullName: "Aisha Patel",
    email: "aisha.patel@email.com",
    memberType: "USER",
    status: "blocked",
    joinDate: "Sep 9, 2025",
    avatar: "/img/agent2.jpg",
  },
  {
    id: "u8",
    username: "tom_ng",
    fullName: "Tom Nguyen",
    email: "tom.nguyen@email.com",
    memberType: "SERVICE_AGENT",
    status: "active",
    joinDate: "May 10, 2026",
    avatar: "/img/agent3.jpg",
  },
  {
    id: "u9",
    username: "sara_lee",
    fullName: "Sara Lee",
    email: "sara.lee@email.com",
    memberType: "USER",
    status: "active",
    joinDate: "May 13, 2026",
    avatar: "/img/agent4.jpg",
  },
  {
    id: "u10",
    username: "carlos_r",
    fullName: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    memberType: "USER",
    status: "paused",
    joinDate: "May 14, 2026",
    avatar: "/img/agent5.jpg",
  },
];

export const mockAgents: AdminAgent[] = [
  {
    id: "a1",
    username: "maria_garcia",
    fullName: "Maria Garcia",
    email: "maria.garcia@petora.co.kr",
    phone: "+82 10-1234-5678",
    serviceType: "Grooming",
    role: "Pet Groomer • Skin Care Specialist",
    bio: "Maria specialises in breed-specific grooming with 6 years of hands-on experience. She works with all coat types and is particularly skilled with anxious or first-time grooming dogs. Her calm, patient approach makes every session stress-free.",
    experience: "6+ years experience",
    approach: "Gentle, patient, positive reinforcement",
    languages: "Korean, English, Spanish",
    serviceArea: "Gangnam, Seoul",
    responseTime: "Usually replies within 10 minutes",
    certifications: [
      {
        title: "Pet Care Accreditation",
        image: "/img/certifications/PACCC-fb-thumb.png",
      },
      {
        title: "Professional Grooming Certification",
        image: "/img/certifications/Pet-certification.webp",
      },
    ],
    rating: 4.9,
    verified: true,
    totalBookings: 214,
    status: "active",
    avatar: "/img/agents/topAgent1.jpg",
    joinDate: "Nov 20, 2025",
  },
  {
    id: "a2",
    username: "emily_park",
    fullName: "Emily Park",
    email: "emily.park@petora.co.kr",
    phone: "+82 10-2345-6789",
    serviceType: "Training",
    role: "Dog Trainer • Behaviour Specialist",
    bio: "Emily is a certified dog trainer who specialises in obedience training, leash manners, and puppy socialisation. She uses reward-based methods and tailors every programme to the individual dog's personality and learning pace.",
    experience: "4+ years experience",
    approach: "Reward-based, structured, confidence-building",
    languages: "Korean, English",
    serviceArea: "Mapo, Seoul",
    responseTime: "Usually replies within 20 minutes",
    certifications: [
      {
        title: "Certified Professional Dog Trainer",
        image: "/img/certifications/certificate-50_page-0001.jpg",
      },
    ],
    rating: 4.7,
    verified: true,
    totalBookings: 138,
    status: "active",
    avatar: "/img/agents/topAgent2.png",
    joinDate: "Mar 1, 2026",
  },
  {
    id: "a3",
    username: "tom_nguyen",
    fullName: "Tom Nguyen",
    email: "tom.nguyen@petora.co.kr",
    phone: "+82 10-3456-7890",
    serviceType: "Walking",
    role: "Dog Walker • Pet Sitter",
    bio: "Tom is an energetic, reliable walker who provides daily exercise and enrichment for dogs of all sizes. He sends photo updates during every walk and follows each owner's specific instructions carefully.",
    experience: "2+ years experience",
    approach: "Active, attentive, communicative",
    languages: "Korean, Vietnamese",
    serviceArea: "Yongsan, Seoul",
    responseTime: "Usually replies within 30 minutes",
    certifications: [],
    rating: 4.5,
    verified: false,
    totalBookings: 52,
    status: "paused",
    avatar: "/img/agents/topAgent3.jpg",
    joinDate: "May 10, 2026",
  },
  {
    id: "a4",
    username: "rachel_brown",
    fullName: "Rachel Brown",
    email: "rachel.brown@petora.co.kr",
    phone: "+82 10-4567-8901",
    serviceType: "Boarding",
    role: "Pet Boarder • In-Home Sitter",
    bio: "Rachel offers a home-away-from-home boarding experience for cats and dogs. Her apartment is fully pet-proofed and she provides individual attention, play sessions, and regular updates to owners.",
    experience: "5+ years experience",
    approach: "Caring, structured, home-environment boarding",
    languages: "Korean, English",
    serviceArea: "Seongdong, Seoul",
    responseTime: "Usually replies within 15 minutes",
    certifications: [
      {
        title: "Pet First Aid Certified",
        image: "/img/certifications/PFAC10.png",
      },
      {
        title: "Professional Pet Certification",
        image: "/img/certifications/certification-preview.jpg",
      },
    ],
    rating: 4.8,
    verified: true,
    totalBookings: 176,
    status: "active",
    avatar: "/img/agents/topAgent4.jpg",
    joinDate: "Aug 14, 2025",
  },
  {
    id: "a5",
    username: "kevin_yoo",
    fullName: "Kevin Yoo",
    email: "kevin.yoo@petora.co.kr",
    phone: "+82 10-5678-9012",
    serviceType: "Day-care",
    role: "Day-care Specialist • Pet Nanny",
    bio: "Kevin runs a small-group day-care programme for dogs and cats, providing supervised play, rest, and meals throughout the day. He keeps a strict pet-to-carer ratio to ensure every animal gets personal attention.",
    experience: "1+ years experience",
    approach: "Social, playful, high engagement",
    languages: "Korean",
    serviceArea: "Songpa, Seoul",
    responseTime: "Usually replies within 45 minutes",
    certifications: [],
    rating: 4.2,
    verified: false,
    totalBookings: 30,
    status: "paused",
    avatar: "/img/agents/topAgent5.jpeg",
    joinDate: "Apr 22, 2026",
  },
  {
    id: "a6",
    username: "nina_kowalski",
    fullName: "Nina Kowalski",
    email: "nina.kowalski@petora.co.kr",
    phone: "+82 10-6789-0123",
    serviceType: "Grooming",
    role: "Pet Groomer",
    bio: "Nina recently joined the Petora platform and is building her grooming portfolio. Her account is currently under review due to a reported policy violation.",
    experience: "1 year experience",
    approach: "Developing",
    languages: "Korean, Polish",
    serviceArea: "Jongno, Seoul",
    responseTime: "Typically replies within 1 hour",
    certifications: [],
    rating: 3.9,
    verified: false,
    totalBookings: 8,
    status: "blocked",
    avatar: "/img/agents/topAgent6.jpg",
    joinDate: "May 2, 2026",
  },
];

export const mockProducts: AdminProduct[] = [
  {
    id: "p1",
    name: "Royal Canin Adult Dry Food",
    category: "Foods",
    petType: "Dogs",
    price: 55000,
    discountedPrice: 48000,
    stock: 120,
    status: "active",
    images: ["/img/products/royal-canin.png"],
    description: "Premium dry food for adult dogs.",
    benefits: ["High protein", "Digestive health", "Shiny coat"],
    sold: 834,
    createdAt: "Jan 5, 2026",
  },
  {
    id: "p2",
    name: "Whiskas Tuna Wet Food",
    category: "Foods",
    petType: "Cats",
    price: 12000,
    discountedPrice: 9500,
    stock: 250,
    status: "active",
    images: ["/img/products/wellness.png"],
    description: "Tender tuna pieces in gravy.",
    benefits: ["Rich in omega-3", "Hydration boost", "Tasty"],
    sold: 1120,
    createdAt: "Dec 10, 2025",
  },
  {
    id: "p3",
    name: "Adjustable Harness — Medium",
    category: "Accessories",
    petType: "Dogs",
    price: 38000,
    discountedPrice: 32000,
    stock: 60,
    status: "active",
    images: ["/img/products/dog-toys-to-mouth.png"],
    description: "Comfortable adjustable harness for dogs 10–25kg.",
    benefits: ["No-choke design", "Reflective strips", "Easy fit"],
    sold: 312,
    createdAt: "Feb 18, 2026",
  },
  {
    id: "p4",
    name: "Interactive Feather Wand",
    category: "Toys",
    petType: "Cats",
    price: 15000,
    discountedPrice: 15000,
    stock: 88,
    status: "active",
    images: ["/img/products/ball-dog.png"],
    description: "Feather wand toy for cats.",
    benefits: ["Exercise", "Mental stimulation", "Bonding"],
    sold: 540,
    createdAt: "Mar 5, 2026",
  },
  {
    id: "p5",
    name: "Multivitamin Chews",
    category: "Health",
    petType: "All",
    price: 29000,
    discountedPrice: 25000,
    stock: 0,
    status: "paused",
    images: ["/img/products/encore.png"],
    description: "Daily chewable vitamins for pets.",
    benefits: ["Immune support", "Joint health", "Coat shine"],
    sold: 670,
    createdAt: "Nov 30, 2025",
  },
  {
    id: "p6",
    name: "Cozy Pet Sweater — Small",
    category: "Clothes",
    petType: "Dogs",
    price: 22000,
    discountedPrice: 18000,
    stock: 45,
    status: "active",
    images: ["/img/products/fillet.png"],
    description: "Warm knit sweater for small breeds.",
    benefits: ["Keeps warm", "Soft material", "Easy to wear"],
    sold: 198,
    createdAt: "Oct 12, 2025",
  },
  {
    id: "p7",
    name: "Self-Cleaning Litter Box",
    category: "Accessories",
    petType: "Cats",
    price: 180000,
    discountedPrice: 155000,
    stock: 18,
    status: "active",
    images: ["/img/products/basketball-ball.png"],
    description: "Automatic self-cleaning litter box.",
    benefits: ["Odor control", "Auto-clean", "Large capacity"],
    sold: 87,
    createdAt: "Jan 20, 2026",
  },
  {
    id: "p8",
    name: "Rope Tug Toy",
    category: "Toys",
    petType: "Dogs",
    price: 8000,
    discountedPrice: 8000,
    stock: 200,
    status: "active",
    images: ["/img/products/bone-toy.png"],
    description: "Durable braided rope toy.",
    benefits: ["Dental health", "Interactive", "Durable"],
    sold: 920,
    createdAt: "Apr 1, 2026",
  },
];

export const mockServices: AdminService[] = [
  {
    id: "s1",
    name: "Pet Grooming",
    category: "Grooming",
    agentUsername: "@maria.garcia",
    agentName: "Maria Garcia",
    location: "Gangnam, Seoul",
    priceMin: 30000,
    priceMax: 80000,
    availableAgents: 12,
    status: "active",
  },
  {
    id: "s2",
    name: "Obedience Training",
    category: "Training",
    agentUsername: "@emily.park",
    agentName: "Emily Park",
    location: "Mapo, Seoul",
    priceMin: 50000,
    priceMax: 120000,
    availableAgents: 8,
    status: "active",
  },
  {
    id: "s3",
    name: "Dog Walking",
    category: "Walking",
    agentUsername: "@tom.nguyen",
    agentName: "Tom Nguyen",
    location: "Yongsan, Seoul",
    priceMin: 15000,
    priceMax: 35000,
    availableAgents: 22,
    status: "active",
  },
  {
    id: "s4",
    name: "Pet Boarding",
    category: "Boarding",
    agentUsername: "@rachel.brown",
    agentName: "Rachel Brown",
    location: "Seongdong, Seoul",
    priceMin: 40000,
    priceMax: 90000,
    availableAgents: 7,
    status: "active",
  },
  {
    id: "s5",
    name: "Day-care",
    category: "Day-care",
    agentUsername: "@kevin.yoo",
    agentName: "Kevin Yoo",
    location: "Songpa, Seoul",
    priceMin: 20000,
    priceMax: 50000,
    availableAgents: 10,
    status: "active",
  },
  {
    id: "s6",
    name: "Veterinary Consultation",
    category: "Health",
    agentUsername: "@nina.kowalski",
    agentName: "Nina Kowalski",
    location: "Jongno, Seoul",
    priceMin: 60000,
    priceMax: 150000,
    availableAgents: 4,
    status: "paused",
  },
];

export const mockOrders: AdminOrder[] = [
  {
    id: "o1",
    orderNo: "ORD-20260001",
    customerName: "Sophie Anderson",
    customerEmail: "sophie.anderson@email.com",
    products: [
      {
        name: "Royal Canin Adult Dry Food",
        image: "/img/products/royal-canin.png",
        quantity: 2,
        unitPrice: 48000,
      },
      {
        name: "Rope Tug Toy",
        image: "/img/products/bone-toy.png",
        quantity: 1,
        unitPrice: 8000,
      },
    ],
    total: 104000,
    status: "delivered",
    date: "May 10, 2026",
  },
  {
    id: "o2",
    orderNo: "ORD-20260002",
    customerName: "James Kim",
    customerEmail: "james.kim@email.com",
    products: [
      {
        name: "Adjustable Harness — Medium",
        image: "/img/products/dog-toys-to-mouth.png",
        quantity: 1,
        unitPrice: 32000,
      },
    ],
    total: 32000,
    status: "shipped",
    date: "May 12, 2026",
  },
  {
    id: "o3",
    orderNo: "ORD-20260003",
    customerName: "David Chen",
    customerEmail: "david.chen@email.com",
    products: [
      {
        name: "Whiskas Tuna Wet Food",
        image: "/img/products/wellness.png",
        quantity: 6,
        unitPrice: 9500,
      },
    ],
    total: 57000,
    status: "processing",
    date: "May 13, 2026",
  },
  {
    id: "o4",
    orderNo: "ORD-20260004",
    customerName: "Aisha Patel",
    customerEmail: "aisha.patel@email.com",
    products: [
      {
        name: "Self-Cleaning Litter Box",
        image: "/img/products/basketball-ball.png",
        quantity: 1,
        unitPrice: 155000,
      },
    ],
    total: 155000,
    status: "pending",
    date: "May 14, 2026",
  },
  {
    id: "o5",
    orderNo: "ORD-20260005",
    customerName: "Sara Lee",
    customerEmail: "sara.lee@email.com",
    products: [
      {
        name: "Interactive Feather Wand",
        image: "/img/products/ball-dog.png",
        quantity: 2,
        unitPrice: 15000,
      },
      {
        name: "Multivitamin Chews",
        image: "/img/products/encore.png",
        quantity: 1,
        unitPrice: 25000,
      },
    ],
    total: 55000,
    status: "pending",
    date: "May 14, 2026",
  },
  {
    id: "o6",
    orderNo: "ORD-20260006",
    customerName: "Lucas Martin",
    customerEmail: "lucas.martin@email.com",
    products: [
      {
        name: "Cozy Pet Sweater — Small",
        image: "/img/products/fillet.png",
        quantity: 1,
        unitPrice: 18000,
      },
    ],
    total: 18000,
    status: "cancelled",
    date: "May 11, 2026",
  },
  {
    id: "o7",
    orderNo: "ORD-20260007",
    customerName: "Carlos Ruiz",
    customerEmail: "carlos.ruiz@email.com",
    products: [
      {
        name: "Multivitamin Chews",
        image: "/img/products/encore.png",
        quantity: 3,
        unitPrice: 25000,
      },
      {
        name: "Rope Tug Toy",
        image: "/img/products/bone-toy.png",
        quantity: 2,
        unitPrice: 8000,
      },
    ],
    total: 91000,
    status: "shipped",
    date: "May 13, 2026",
  },
  {
    id: "o8",
    orderNo: "ORD-20260008",
    customerName: "Tom Nguyen",
    customerEmail: "tom.nguyen@email.com",
    products: [
      {
        name: "Royal Canin Adult Dry Food",
        image: "/img/products/royal-canin.png",
        quantity: 1,
        unitPrice: 48000,
      },
    ],
    total: 48000,
    status: "delivered",
    date: "May 9, 2026",
  },
];

export const mockPosts: AdminPost[] = [
  {
    id: "post1",
    title: "My dog just learned to shake hands!",
    description:
      "After 3 weeks of daily training sessions, my golden retriever finally got it! Sharing the method that worked for us — positive reinforcement with small treats every time he got it right. Consistency is key!",
    board: "FREE",
    author: "sophie_a",
    authorImage: "/img/agent1.jpg",
    date: "May 14, 2026",
    status: "visible",
    views: 342,
    likes: 58,
    commentsCount: 14,
    image: "/img/products/dog-toys-to-mouth.png",
  },
  {
    id: "post2",
    title: "Petora partners with 10 new premium vets",
    description:
      "We're excited to announce that Petora has partnered with 10 new certified veterinary clinics across Seoul and Busan. This means faster appointments and better care for your pets.",
    board: "NEWS",
    author: "Admin",
    date: "May 13, 2026",
    status: "visible",
    views: 1240,
    likes: 204,
    commentsCount: 38,
  },
  {
    id: "post3",
    title: "Why is my cat knocking things off tables?",
    description:
      "My cat has been pushing everything off the table lately — glasses, books, my phone. Is this normal behaviour? Does anyone know why cats do this and how to stop it?",
    board: "QNA",
    author: "james_kim",
    authorImage: "/img/agent2.jpg",
    date: "May 12, 2026",
    status: "visible",
    views: 890,
    likes: 76,
    commentsCount: 0,
    answersCount: 12,
  },
  {
    id: "post4",
    title: "Best food for senior dogs — my experience",
    description:
      "My labrador turned 9 this year and I switched him to a senior formula. Here's what I noticed over 3 months: better digestion, shinier coat, and more energy on walks. Highly recommend Royal Canin Senior.",
    board: "FREE",
    author: "maria_g",
    authorImage: "/img/agent3.jpg",
    date: "May 11, 2026",
    status: "visible",
    views: 523,
    likes: 91,
    commentsCount: 22,
    image: "/img/products/royal-canin.png",
  },
  {
    id: "post5",
    title: "New grooming packages now available!",
    description:
      "Our verified grooming agents now offer 3 new premium packages — Full Spa, Express Clean, and Puppy First. Book directly through the app at a 15% launch discount until May 31.",
    board: "NEWS",
    author: "Admin",
    date: "May 10, 2026",
    status: "visible",
    views: 677,
    likes: 112,
    commentsCount: 7,
  },
  {
    id: "post6",
    title: "Is it safe to give cats milk?",
    description:
      "I've been giving my 2-year-old cat a small bowl of milk every morning. She loves it but I read online that cats are lactose intolerant. Should I stop? Are there safe alternatives?",
    board: "QNA",
    author: "aisha_p",
    authorImage: "/img/agent2.jpg",
    date: "May 9, 2026",
    status: "hidden",
    views: 444,
    likes: 33,
    commentsCount: 0,
    answersCount: 5,
  },
  {
    id: "post7",
    title: "Inappropriate content — flagged",
    description:
      "This post contained spam links and unrelated commercial content. Flagged for review.",
    board: "FREE",
    author: "carlos_r",
    date: "May 8, 2026",
    status: "hidden",
    views: 12,
    likes: 0,
    commentsCount: 1,
  },
  {
    id: "post8",
    title: "Tips for first-time dog owners",
    description:
      "Just got my first puppy! Here are the 10 things I wish someone had told me before bringing her home — from crate training to the right vaccination schedule. Hope this helps other new owners.",
    board: "FREE",
    author: "emily_p",
    authorImage: "/img/agent5.jpg",
    date: "May 7, 2026",
    status: "visible",
    views: 1580,
    likes: 267,
    commentsCount: 54,
    image: "/img/products/bone-toy.png",
  },
  {
    id: "post9",
    title: "How often should I bathe my rabbit?",
    description:
      "I have a Holland Lop rabbit. My friend said never to bathe rabbits but my rabbit got into something messy. What's the safest way to clean a rabbit without stressing it out?",
    board: "QNA",
    author: "sara_lee",
    date: "May 6, 2026",
    status: "visible",
    views: 231,
    likes: 18,
    commentsCount: 0,
    answersCount: 3,
  },
  {
    id: "post10",
    title: "Petora app v2.1 update released",
    description:
      "Version 2.1 is live! New features include in-app chat with your service agent, real-time order tracking, and a redesigned discovery feed. Update now from the App Store or Google Play.",
    board: "NEWS",
    author: "Admin",
    date: "May 5, 2026",
    status: "visible",
    views: 2100,
    likes: 445,
    commentsCount: 63,
  },
];

export const mockReports: AdminReport[] = [
  {
    id: "r1",
    type: "post",
    targetTitle: "Inappropriate content — flagged",
    targetAuthor: "carlos_r",
    reportedBy: "sophie_a",
    reason: "Spam / Irrelevant content",
    date: "May 8, 2026",
    status: "pending",
  },
  {
    id: "r2",
    type: "comment",
    targetTitle: 'Comment on "Why is my cat..."',
    targetAuthor: "aisha_p",
    reportedBy: "james_kim",
    reason: "Offensive language",
    date: "May 12, 2026",
    status: "pending",
  },
  {
    id: "r3",
    type: "user",
    targetTitle: "carlos_r",
    targetAuthor: "carlos_r",
    reportedBy: "tom_ng",
    reason: "Fake account / bot behaviour",
    date: "May 9, 2026",
    status: "resolved",
  },
  {
    id: "r4",
    type: "post",
    targetTitle: "Misleading pet health advice",
    targetAuthor: "david_c",
    reportedBy: "lucas_m",
    reason: "Misinformation",
    date: "May 11, 2026",
    status: "pending",
  },
  {
    id: "r5",
    type: "comment",
    targetTitle: 'Comment on "Petora partners..."',
    targetAuthor: "kevin_y",
    reportedBy: "emily_p",
    reason: "Harassment",
    date: "May 13, 2026",
    status: "dismissed",
  },
  {
    id: "r6",
    type: "user",
    targetTitle: "spammer99",
    targetAuthor: "spammer99",
    reportedBy: "maria_g",
    reason: "Posting spam links",
    date: "May 14, 2026",
    status: "pending",
  },
];

export const mockAnnouncements: AdminAnnouncement[] = [
  {
    id: "ann1",
    title: "Welcome to Petora 2.0!",
    content:
      "We have launched our completely redesigned platform with new features for pet owners and service agents. Explore the new shop, improved booking system, and expanded community.",
    author: "Admin",
    date: "May 1, 2026",
    active: true,
    pinned: true,
  },
  {
    id: "ann2",
    title: "Scheduled Maintenance — May 20, 2026",
    content:
      "The platform will be undergoing scheduled maintenance on May 20, 2026 from 02:00–04:00 KST. During this time the site may be temporarily unavailable.",
    author: "Admin",
    date: "May 10, 2026",
    active: true,
    pinned: false,
  },
  {
    id: "ann3",
    title: "New Service Agents Onboarded",
    content:
      "We are excited to welcome 18 new verified service agents this month across grooming, training, and boarding categories.",
    author: "Admin",
    date: "May 5, 2026",
    active: false,
    pinned: false,
  },
];

// ─── CS: FAQ & Notices ─────────────────────────────────────────────────────

export const mockFaqs: AdminFaq[] = [
  {
    id: "faq-1",
    category: "orders",
    title: "How do I track my order?",
    description: "Find your order status and tracking info in My Page.",
    answer:
      "You can track your order anytime by going to My Page → Orders. Each order shows its current status and, once shipped, a tracking number you can use with our delivery partner.",
    bullets: [
      "Go to My Page → Bookings & Orders",
      "Click the order you want to track",
      "Click 'Track Shipment' to see real-time delivery updates",
    ],
  },
  {
    id: "faq-2",
    category: "orders",
    title: "Can I change or cancel my order?",
    description: "Orders can be modified within 1 hour of placement.",
    answer:
      "You can change or cancel your order within 1 hour of placing it. After that, the order enters processing and changes may not be possible.",
    bullets: [
      "Visit My Page → Orders within 1 hour of ordering",
      "Click 'Edit' or 'Cancel' next to the relevant order",
      "Contact support if you need help beyond the 1-hour window",
    ],
  },
  {
    id: "faq-3",
    category: "delivery",
    title: "What are the delivery times?",
    description: "Standard delivery takes 2–4 business days.",
    answer:
      "Standard delivery typically takes 2–4 business days after dispatch. Express delivery is available at checkout for next-day delivery in Seoul and Busan.",
    bullets: [
      "Standard: 2–4 business days nationwide",
      "Express: Next business day (Seoul & Busan only)",
      "Remote areas may take 1–2 extra days",
    ],
  },
  {
    id: "faq-4",
    category: "delivery",
    title: "Do you deliver internationally?",
    description: "Currently we only deliver within South Korea.",
    answer:
      "At this time, Petora only delivers within South Korea. We are working on expanding to international shipping in the future.",
    bullets: [
      "Delivery available to all cities in South Korea",
      "International shipping coming soon",
      "Contact support for special requests",
    ],
  },
  {
    id: "faq-5",
    category: "returns",
    title: "How do I return a product?",
    description: "Returns are accepted within 7 days of delivery.",
    answer:
      "We accept returns within 7 days of delivery for unused items in original packaging. Simply submit a return request through My Page.",
    bullets: [
      "Go to My Page → Orders and select the item",
      "Click 'Request Return' and select a reason",
      "Ship the item back using our prepaid label",
    ],
  },
  {
    id: "faq-6",
    category: "returns",
    title: "When will I receive my refund?",
    description: "Refunds are processed within 3–5 business days.",
    answer:
      "Once we receive and inspect your returned item, we will process your refund within 3–5 business days. The amount will be credited to your original payment method.",
    bullets: [
      "Inspection takes 1–2 business days upon receipt",
      "Refund processing: 3–5 additional business days",
      "You will receive an email confirmation once processed",
    ],
  },
  {
    id: "faq-7",
    category: "account",
    title: "How do I reset my password?",
    description: "Use the 'Forgot Password' link on the login screen.",
    answer:
      "Click 'Forgot Password' on the login page and enter your registered email. You will receive a password reset link within 5 minutes.",
    bullets: [
      "Click 'Forgot Password' on the login screen",
      "Enter your registered email address",
      "Check your inbox for the reset link (check spam if not received)",
    ],
  },
  {
    id: "faq-8",
    category: "account",
    title: "How do I update my profile information?",
    description: "Edit your profile details anytime from My Page.",
    answer:
      "You can update your name, address, phone number, and profile photo at any time by going to My Page → My Profile.",
    bullets: [
      "Navigate to My Page → My Profile",
      "Click 'Edit Profile' to make changes",
      "Save changes — updates take effect immediately",
    ],
  },
  {
    id: "faq-9",
    category: "services",
    title: "How do I book a pet service?",
    description: "Browse agents and book directly through the Services page.",
    answer:
      "Browse our verified service agents on the Services page, select your preferred agent and service, choose a date and time, and confirm your booking.",
    bullets: [
      "Visit the Services page and choose a category",
      "Select an agent and click 'Book Now'",
      "Complete your pet details and confirm the booking",
    ],
  },
  {
    id: "faq-10",
    category: "services",
    title: "Can I cancel a service booking?",
    description:
      "Cancellations are free up to 24 hours before the appointment.",
    answer:
      "You can cancel a service booking free of charge up to 24 hours before the scheduled appointment. Cancellations within 24 hours may incur a fee.",
    bullets: [
      "Go to My Page → Bookings & Orders",
      "Find the booking and click 'Cancel'",
      "Cancellations within 24 hours: a 20% cancellation fee applies",
    ],
  },
];

export const mockNotices: AdminNotice[] = [
  {
    id: "notice-1",
    title: "Scheduled Maintenance — May 20, 2026",
    summary:
      "The platform will be temporarily unavailable on May 20 from 02:00–04:00 KST.",
    date: "May 15, 2026",
    badge: "Important",
    featured: true,
    fullText: [
      "Petora will undergo scheduled maintenance on May 20, 2026, from 02:00 to 04:00 KST.",
      "During this window, the website and mobile app will be temporarily unavailable. All ongoing orders and bookings will not be affected.",
      "We apologize for the inconvenience and thank you for your understanding.",
    ],
  },
  {
    id: "notice-2",
    title: "New Payment Method: Kakao Pay",
    summary: "Kakao Pay is now available as a payment option at checkout.",
    date: "May 12, 2026",
    badge: "Update",
    featured: false,
    fullText: [
      "We are pleased to announce that Kakao Pay is now available as a payment option across all Petora services.",
      "You can use Kakao Pay for product purchases, service bookings, and subscription upgrades.",
      "Simply select Kakao Pay at checkout and authenticate with your Kakao account.",
    ],
  },
  {
    id: "notice-3",
    title: "Updated Return Policy",
    summary: "Return window extended from 5 to 7 days effective immediately.",
    date: "May 10, 2026",
    badge: "Important",
    featured: false,
    fullText: [
      "Effective May 10, 2026, Petora has extended the return window for all product purchases from 5 days to 7 days.",
      "This change applies to all orders placed on or after this date.",
      "Items must be unused and in original packaging to qualify for a return.",
    ],
  },
  {
    id: "notice-4",
    title: "App Version 2.1 Released",
    summary:
      "New features include in-app agent chat and real-time order tracking.",
    date: "May 5, 2026",
    badge: "Update",
    featured: false,
    fullText: [
      "Petora app version 2.1 is now available on the App Store and Google Play.",
      "New features include: in-app chat with your service agent, real-time order tracking with map view, and a redesigned discovery feed.",
      "Update now to enjoy the latest improvements and bug fixes.",
    ],
  },
  {
    id: "notice-5",
    title: "Service Area Expansion — Busan & Incheon",
    summary: "Pet services are now available in Busan and Incheon.",
    date: "Apr 28, 2026",
    badge: "Update",
    featured: false,
    fullText: [
      "Petora pet services are now available in Busan and Incheon, expanding our coverage beyond Seoul.",
      "Grooming, walking, boarding, and training services are fully operational in these cities.",
      "More cities will be added throughout 2026.",
    ],
  },
  {
    id: "notice-6",
    title: "Privacy Policy Update",
    summary:
      "We updated our privacy policy to comply with the latest regulations.",
    date: "Apr 20, 2026",
    badge: "Important",
    featured: false,
    fullText: [
      "Petora has updated its Privacy Policy effective April 20, 2026, to comply with updated data protection regulations.",
      "Key changes include clearer explanations of data collection and the introduction of data export requests.",
      "Please review the full policy on our website. Continued use of the service constitutes acceptance.",
    ],
  },
];
