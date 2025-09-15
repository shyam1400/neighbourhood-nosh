export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  deliveryTime: string;
  distance: string;
  isOpen: boolean;
  owner: string;
  phone: string;
  categories: string[];
  image: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export const stores: Store[] = [
  {
    id: "1",
    name: "Koramangala Fresh Mart",
    address: "5th Block, Koramangala, Bangalore - 560034",
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.5,
    deliveryTime: "15-20 min",
    distance: "0.8 km",
    isOpen: true,
    owner: "Rajesh Kumar",
    phone: "+91 98765 43210",
    categories: ["Rice & Grains", "Pulses", "Cooking Oil", "Dairy", "Vegetables", "Spices"],
    image: "🏪",
    reviews: [
      {
        id: "review1",
        userId: "user1",
        userName: "John Doe",
        rating: 5,
        comment: "Great store with a wide variety of products!",
        date: "2022-01-01",
        helpful: 10,
        images: ["image1.jpg", "image2.jpg"]
      },
      {
        id: "review2",
        userId: "user2",
        userName: "Jane Doe",
        rating: 4,
        comment: "Good store, but the staff could be more friendly.",
        date: "2022-01-15",
        helpful: 5
      }
    ]
  },
  {
    id: "2",
    name: "Indiranagar Daily Needs",
    address: "100 Feet Road, Indiranagar, Bangalore - 560038",
    latitude: 12.9716,
    longitude: 77.6412,
    rating: 4.3,
    deliveryTime: "20-25 min",
    distance: "1.2 km",
    isOpen: true,
    owner: "Priya Sharma",
    phone: "+91 98765 43211",
    categories: ["Dairy", "Vegetables", "Bakery", "Beverages", "Snacks"],
    image: "🏬",
    reviews: [
      {
        id: "review3",
        userId: "user3",
        userName: "Bob Smith",
        rating: 4,
        comment: "Good store with a wide variety of dairy products.",
        date: "2022-02-01",
        helpful: 8
      }
    ]
  },
  {
    id: "3",
    name: "HSR Layout Grocery Hub",
    address: "27th Main, HSR Layout, Bangalore - 560102",
    latitude: 12.9116,
    longitude: 77.6460,
    rating: 4.4,
    deliveryTime: "18-22 min",
    distance: "1.5 km",
    isOpen: true,
    owner: "Suresh Reddy",
    phone: "+91 98765 43212",
    categories: ["Rice & Grains", "Pulses", "Cooking Oil", "Personal Care", "Household"],
    image: "🏪",
    reviews: [
      {
        id: "review4",
        userId: "user4",
        userName: "Alice Johnson",
        rating: 5,
        comment: "Great store with a wide variety of products and good customer service.",
        date: "2022-03-01",
        helpful: 12
      }
    ]
  },
  {
    id: "4",
    name: "Whitefield Local Store",
    address: "ITPL Road, Whitefield, Bangalore - 560066",
    latitude: 12.9698,
    longitude: 77.7500,
    rating: 4.2,
    deliveryTime: "25-30 min",
    distance: "2.1 km",
    isOpen: true,
    owner: "Anita Singh",
    phone: "+91 98765 43213",
    categories: ["Vegetables", "Dairy", "Bakery", "Beverages", "Snacks"],
    image: "🏬",
    reviews: [
      {
        id: "review5",
        userId: "user5",
        userName: "Mike Brown",
        rating: 4,
        comment: "Good store with a wide variety of products, but the delivery time could be faster.",
        date: "2022-04-01",
        helpful: 9
      }
    ]
  },
  {
    id: "5",
    name: "Jayanagar Kirana Corner",
    address: "4th T Block, Jayanagar, Bangalore - 560041",
    latitude: 12.9308,
    longitude: 77.5838,
    rating: 4.6,
    deliveryTime: "12-15 min",
    distance: "0.5 km",
    isOpen: true,
    owner: "Vikram Patel",
    phone: "+91 98765 43214",
    categories: ["Rice & Grains", "Pulses", "Cooking Oil", "Spices", "Personal Care"],
    image: "🏪",
    reviews: [
      {
        id: "review6",
        userId: "user6",
        userName: "Emily Davis",
        rating: 5,
        comment: "Great store with a wide variety of products and good customer service.",
        date: "2022-05-01",
        helpful: 11
      }
    ]
  },
  {
    id: "6",
    name: "BTM Layout Quick Mart",
    address: "16th Main, BTM Layout, Bangalore - 560076",
    latitude: 12.9166,
    longitude: 77.6101,
    rating: 4.1,
    deliveryTime: "20-25 min",
    distance: "1.8 km",
    isOpen: true,
    owner: "Meera Iyer",
    phone: "+91 98765 43215",
    categories: ["Dairy", "Vegetables", "Bakery", "Household", "Snacks"],
    image: "🏬",
    reviews: [
      {
        id: "review7",
        userId: "user7",
        userName: "David Lee",
        rating: 4,
        comment: "Good store with a wide variety of products, but the staff could be more friendly.",
        date: "2022-06-01",
        helpful: 7
      }
    ]
  },
  {
    id: "7",
    name: "Marathahalli Fresh Store",
    address: "Outer Ring Road, Marathahalli, Bangalore - 560037",
    latitude: 12.9581,
    longitude: 77.7010,
    rating: 4.3,
    deliveryTime: "22-28 min",
    distance: "2.3 km",
    isOpen: true,
    owner: "Kumar Swamy",
    phone: "+91 98765 43216",
    categories: ["Rice & Grains", "Pulses", "Cooking Oil", "Beverages", "Personal Care"],
    image: "🏪",
    reviews: [
      {
        id: "review8",
        userId: "user8",
        userName: "Sophia Kim",
        rating: 5,
        comment: "Great store with a wide variety of products and good customer service.",
        date: "2022-07-01",
        helpful: 13
      }
    ]
  },
  {
    id: "8",
    name: "Electronic City Grocery",
    address: "Hosur Road, Electronic City, Bangalore - 560100",
    latitude: 12.8456,
    longitude: 77.6603,
    rating: 4.0,
    deliveryTime: "30-35 min",
    distance: "3.2 km",
    isOpen: false,
    owner: "Deepa Nair",
    phone: "+91 98765 43217",
    categories: ["Vegetables", "Dairy", "Bakery", "Household", "Snacks"],
    image: "🏬",
    reviews: [
      {
        id: "review9",
        userId: "user9",
        userName: "Oliver Martin",
        rating: 4,
        comment: "Good store with a wide variety of products, but the delivery time could be faster.",
        date: "2022-08-01",
        helpful: 8
      }
    ]
  },
  {
    id: "9",
    name: "More Supermarket",
    address: "Brigade Road, Bangalore - 560001",
    latitude: 12.9716,
    longitude: 77.6061,
    rating: 4.6,
    deliveryTime: "20-25 min",
    distance: "1.8 km",
    isOpen: true,
    owner: "More Retail Ltd",
    phone: "+91 98765 43218",
    categories: ["Rice & Grains", "Pulses", "Cooking Oil", "Dairy", "Vegetables", "Spices", "Bakery", "Beverages", "Snacks", "Frozen Foods", "Household"],
    image: "🏪",
    reviews: [
      {
        id: "review10",
        userId: "user10",
        userName: "Ava Chen",
        rating: 5,
        comment: "Great store with a wide variety of products and good customer service.",
        date: "2022-09-01",
        helpful: 14
      }
    ]
  },
  {
    id: "10",
    name: "Reliance Fresh",
    address: "Commercial Street, Bangalore - 560001",
    latitude: 12.9716,
    longitude: 77.6061,
    rating: 4.5,
    deliveryTime: "18-22 min",
    distance: "1.5 km",
    isOpen: true,
    owner: "Reliance Retail",
    phone: "+91 98765 43219",
    categories: ["Rice & Grains", "Pulses", "Cooking Oil", "Dairy", "Vegetables", "Spices", "Bakery", "Beverages", "Snacks", "Frozen Foods", "Household"],
    image: "🏪",
    reviews: [
      {
        id: "review11",
        userId: "user11",
        userName: "Liam Hall",
        rating: 4,
        comment: "Good store with a wide variety of products, but the staff could be more friendly.",
        date: "2022-10-01",
        helpful: 6
      }
    ]
  },
  {
    id: "11",
    name: "Bangalore Meat Mart",
    address: "Russell Market, Shivajinagar, Bangalore - 560001",
    latitude: 12.9716,
    longitude: 77.6061,
    rating: 4.7,
    deliveryTime: "15-20 min",
    distance: "1.2 km",
    isOpen: true,
    owner: "Ahmed Khan",
    phone: "+91 98765 43220",
    categories: ["Chicken", "Mutton", "Fish", "Seafood", "Eggs"],
    image: "🥩",
    reviews: [
      {
        id: "review12",
        userId: "user12",
        userName: "Noah Patel",
        rating: 5,
        comment: "Great store with a wide variety of meat products and good customer service.",
        date: "2022-11-01",
        helpful: 15
      }
    ]
  },
  {
    id: "12",
    name: "Fresh Fish & Meat Center",
    address: "Malleshwaram, Bangalore - 560003",
    latitude: 12.9914,
    longitude: 77.5704,
    rating: 4.4,
    deliveryTime: "20-25 min",
    distance: "2.0 km",
    isOpen: true,
    owner: "Ravi Kumar",
    phone: "+91 98765 43221",
    categories: ["Chicken", "Mutton", "Fish", "Seafood", "Eggs"],
    image: "🥩",
    reviews: [
      {
        id: "review13",
        userId: "user13",
        userName: "Ethan Kim",
        rating: 4,
        comment: "Good store with a wide variety of meat products, but the delivery time could be faster.",
        date: "2022-12-01",
        helpful: 9
      }
    ]
  }
];

export const getStoreById = (id: string) => {
  return stores.find(store => store.id === id);
};

export const getStoresByCategory = (category: string) => {
  return stores.filter(store => store.categories.includes(category));
};

export const getNearbyStores = (userLat: number, userLng: number, radiusKm: number = 5) => {
  return stores.filter(store => {
    const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);
    return distance <= radiusKm;
  });
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
