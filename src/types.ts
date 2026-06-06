/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  description: string;
  price: number;
  ingredients: string[];
  isBestSeller?: boolean;
  isChefSpecial?: boolean;
  calories: number;
  prepTime: number; // in minutes
  rating: number;
  spicyLevel?: 0 | 1 | 2 | 3;
}

export enum MenuItemCategory {
  NEMS = "Nems",
  SOUPES = "Soupes",
  COMBOS = "Combos",
  BOEUFS = "Bœufs",
  CALIFORNIA_ROLLS = "California Rolls",
  RIZ_CANTONNAIS = "Riz Cantonnais",
  EBIS = "Ebis",
  BOISSONS = "Boissons",
  SAMURAI_FRY = "Samurai Fry",
  SALADES = "Salades",
  WOKS = "Woks",
  BROCHETTES = "Brochettes",
  AROMAKIS = "Aromakis",
  TAPANYAKIS = "Tapanyakis"
}

export interface CartItem {
  id: string; // unique cart instance id
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  role?: string;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  customerName: string;
  address: string;
  phone: string;
  notes?: string;
  paymentMethod: "cod" | "card" | "applepay" | "googlepay";
  status: "pending" | "preparing" | "cooking" | "dispatched" | "arriving" | "delivered";
  createdAt: string;
}

export interface AppSettings {
  restaurantName: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  openingHours: { day: string; hours: string; enabled: boolean }[];
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
}

export interface WebsiteSEO {
  title: string;
  description: string;
  keywords: string;
  perPage: { [key: string]: { title: string; description: string; keywords: string } };
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "flat" | "free_delivery";
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  videoUrl?: string;
  ctaText: string;
  promotionBanner: string;
}

export interface StoryContent {
  title: string;
  text: string;
  imageAlt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  minOrder: number;
  enabled: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "owner" | "manager" | "staff";
  active: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "inventory" | "review" | "payment";
  createdAt: string;
  read: boolean;
}

export interface IngredientLevel {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minAlert: number;
}

