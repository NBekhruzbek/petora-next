export const MOCK_PERSONAL_INFO = {
  fullName: "John Doe",
  username: "johndoe",
  email: "john.doe@company.com",
  phone: "010-1234-5678",
  address: "Seoul, Gangnam-gu, Teheran-ro 123",
  bio: "Product designer and entrepreneur passionate about creating meaningful digital experiences.",
  image: "/img/profile/defaultUser.png",
  memberType: "User" as "User" | "Agent",
};

export const MOCK_AGENT_PROFILE = {
  fullName: "Sophia Kim",
  username: "sophiakim",
  email: "sophia.kim@petora.co.kr",
  phone: "010-2456-7812",
  address: "Seoul, Gangnam-gu",
  bio: "Sophia works with puppies, adult dogs, and senior pets that need patient, structured care. Her approach is calm, friendly, and confidence-building, with a strong focus on positive reinforcement and safe handling.",
  image: "/img/profile/defaultUser.png",
  memberType: "Agent" as "User" | "Agent",
  role: "Pet Groomer • Skin Care Specialist",
  serviceType: "Grooming",
  experience: "6+ years experience",
  approach: "Gentle, patient, positive reinforcement",
  languages: "Korean, English",
  serviceArea: "Gangnam, Seocho, Mapo (Seoul)",
  responseTime: "Usually replies within 10 minutes",
  certifications: [
    {
      title: "Pet Care Accreditation",
      image: "/img/certifications/PACCC-fb-thumb.png",
    },
    {
      title: "Professional Pet Certification",
      image: "/img/certifications/certificate-50_page-0001.jpg",
    },
  ],
};

export const MOCK_BILLING_INFO = {
  cardHolder: "JOHN DOE",
  cardNumber: "4242 4242 4242 4242",
  expiryDate: "12/28",
  cvv: "281",
  companyName: "Acme Inc.",
  vatNumber: "GB123456789",
  address: "123 Market Street",
  city: "Seoul",
  zipCode: "06234",
  country: "South Korea",
};
