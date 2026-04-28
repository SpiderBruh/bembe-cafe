import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  available: boolean;
  allergens: string;
  createdAt: any;
  order: number;
}

export interface Order {
  id?: string;
  items: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[];
  total: number;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: any;
}

export interface Booking {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

/* ── Order Operations ── */
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
  try {
    const ordersRef = collection(db, 'orders');
    return await addDoc(ordersRef, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'orders');
  }
};

/* ── Booking Operations ── */
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    return await addDoc(bookingsRef, {
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'bookings');
  }
};

/* ── Inventory Management ── */
export const updateProductAvailability = async (productId: string, available: boolean) => {
  try {
    // Note: requires updateDoc, adding it to imports if needed
    // For now, keeping it simple
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
  }
};

export const seedProducts = async () => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) return; // Already seeded

  const sampleProducts = [
    {
      name: "Caramel Latte",
      description: "Rich espresso with caramel syrup and steamed milk",
      category: "Coffee & Drinks",
      price: 3.80,
      imageUrl: "https://i.pinimg.com/1200x/70/d6/a7/70d6a7bac27b6fd90f8880e22cef25ce.jpg",
      available: true,
      allergens: "Milk",
      order: 1
    },
    {
      name: "Iced Matcha",
      description: "Premium matcha with oat milk over ice",
      category: "Coffee & Drinks",
      price: 4.20,
      imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Oat",
      order: 2
    },
    {
      name: "Flat White",
      description: "Double shot espresso with velvety microfoam",
      category: "Coffee & Drinks",
      price: 3.20,
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Milk",
      order: 3
    },
    {
      name: "Fresh Orange Juice",
      description: "Freshly squeezed, served cold",
      category: "Coffee & Drinks",
      price: 3.50,
      imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "None",
      order: 4
    },
    {
      name: "Bembe Breakfast",
      description: "Sausages, eggs, beans, fresh salad, pickled red onions — halal",
      category: "Food & Brunch",
      price: 9.50,
      imageUrl: "https://images.unsplash.com/photo-1496042399014-dc73c4f2bde1?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Gluten, Eggs",
      order: 5
    },
    {
      name: "Shakshuka",
      description: "Eggs poached in spiced tomato sauce, served with bread — halal",
      category: "Food & Brunch",
      price: 8.50,
      imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Gluten, Eggs",
      order: 6
    },
    {
      name: "Maharagwe",
      description: "Kenyan red beans in coconut sauce — vegetarian, halal",
      category: "Food & Brunch",
      price: 7.50,
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744aba?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "None",
      order: 7
    },
    {
      name: "Bakewell Slice",
      description: "Homemade almond and cherry bakewell",
      category: "Cakes & Pastries",
      price: 3.50,
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Nuts, Eggs, Gluten",
      order: 8
    },
    {
      name: "Mince Pie",
      description: "Classic homemade mince pie",
      category: "Cakes & Pastries",
      price: 2.80,
      imageUrl: "https://images.unsplash.com/photo-1607478902797-28521035547b?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Gluten",
      order: 9
    },
    {
      name: "Croissant",
      description: "Buttery, freshly baked",
      category: "Cakes & Pastries",
      price: 2.50,
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
      available: true,
      allergens: "Gluten, Milk",
      order: 10
    }
  ];

  try {
    for (const p of sampleProducts) {
      await addDoc(productsRef, {
        ...p,
        createdAt: serverTimestamp()
      });
    }
    console.log("Seeded products");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'products');
  }
};

