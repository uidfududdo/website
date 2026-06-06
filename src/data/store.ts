/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  MenuItem, MenuItemCategory, Review, Order, AppSettings, WebsiteSEO, 
  Coupon, HeroContent, StoryContent, DeliveryZone, AdminUser, Notification, IngredientLevel, CartItem 
} from "../types";
import { MENU_ITEMS, REVIEWS } from "./menu";

// Define the shape of our global database state
export interface AppState {
  menuItems: MenuItem[];
  categories: string[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  deliveryZones: DeliveryZone[];
  adminUsers: AdminUser[];
  notifications: Notification[];
  ingredients: IngredientLevel[];
  settings: AppSettings;
  seo: WebsiteSEO;
  hero: HeroContent;
  story: StoryContent;
  currentUser: AdminUser | null;
}

// Default initial state setup
const DEFAULT_CATEGORIES = Object.values(MenuItemCategory) as string[];

const DEFAULT_COUPONS: Coupon[] = [
  { id: "cop-1", code: "SAMURAI10", type: "percent", value: 10, expiryDate: "2026-12-31", usageLimit: 500, usedCount: 142, active: true },
  { id: "cop-2", code: "FREESHIP", type: "free_delivery", value: 0, expiryDate: "2026-09-30", usageLimit: 100, usedCount: 28, active: true },
  { id: "cop-3", code: "SATO25", type: "flat", value: 25, expiryDate: "2026-08-15", usageLimit: 50, usedCount: 12, active: true }
];

const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { id: "zone-1", name: "Premium Paris Center (Zone A)", fee: 4.90, minOrder: 15.00, enabled: true },
  { id: "zone-2", name: "Neuilly & Boulogne (Zone B)", fee: 6.90, minOrder: 25.00, enabled: true },
  { id: "zone-3", name: "Versailles Luxury Sector (Zone C)", fee: 12.50, minOrder: 50.00, enabled: true },
  { id: "zone-4", name: "La Défense Hub (Zone D)", fee: 5.90, minOrder: 20.00, enabled: false }
];

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  { id: "usr-1", email: "owner@samurai.com", name: "Chef Kenzo Sato", role: "owner", active: true },
  { id: "usr-2", email: "manager@samurai.com", name: "Yuki Tanaka", role: "manager", active: true },
  { id: "usr-3", email: "staff@samurai.com", name: "Hiroshi Akata", role: "staff", active: true }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "not-1", title: "New Luxury Order", message: "Order SMR-892304 arrived from Claire de Lune", type: "order", createdAt: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
  { id: "not-2", title: "Low Ingredient Stock Alert", message: "Premium Atlantic Salmon levels are below safety margin (1.8kg remaining)", type: "inventory", createdAt: new Date(Date.now() - 1 * 3600000).toISOString(), read: false },
  { id: "not-3", title: "5-Star Review Received", message: "Mai Tanaka left an editorial rating", type: "review", createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), read: true }
];

const DEFAULT_INGREDIENTS: IngredientLevel[] = [
  { id: "ing-1", name: "Premium Atlantic Salmon", stock: 12.5, unit: "kg", minAlert: 5.0 },
  { id: "ing-2", name: "Bluefin Tuna Prime Cut", stock: 8.2, unit: "kg", minAlert: 3.0 },
  { id: "ing-3", name: "King Tiger Prawns", stock: 110, unit: "pcs", minAlert: 30 },
  { id: "ing-4", name: "Koshihikari Sushi Rice", stock: 45.0, unit: "kg", minAlert: 15.0 },
  { id: "ing-5", name: "Hass Avocados (Ripe)", stock: 85, unit: "pcs", minAlert: 20 },
  { id: "ing-6", name: "Authentic Shizuoka Wasabi", stock: 1.4, unit: "kg", minAlert: 0.5 }
];

const DEFAULT_SETTINGS: AppSettings = {
  restaurantName: "SAMURAI TOKYO FUSION",
  logo: "侍",
  address: "71 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
  phone: "+33 1 42 68 53 00",
  email: "concierge@samuraifusion.com",
  openingHours: [
    { day: "Monday", hours: "18:00 - 23:30", enabled: true },
    { day: "Tuesday", hours: "18:00 - 23:30", enabled: true },
    { day: "Wednesday", hours: "18:00 - 23:30", enabled: true },
    { day: "Thursday", hours: "18:00 - 23:30", enabled: true },
    { day: "Friday", hours: "17:30 - 00:30", enabled: true },
    { day: "Saturday", hours: "12:00 - 15:00, 17:30 - 00:30", enabled: true },
    { day: "Sunday", hours: "12:00 - 15:00, 18:00 - 23:00", enabled: true }
  ],
  instagram: "@samurai.tokyofusion",
  facebook: "samurai.tokyofusion",
  tiktok: "@samurai.tokyofusion",
  whatsapp: "+33 6 45 88 12 90"
};

const DEFAULT_SEO: WebsiteSEO = {
  title: "SAMURAI | Award-Winning Digital Haute Cuisine Experience",
  description: "Experience Paris' premier luxury thermal-wood box sushi delivery. Sourced daily, built with geometric perfection and Chef Sato's 25 years of discipline.",
  keywords: "luxury sushi delivery, premium roll Paris, authentic wasabi, Michelin quality Japanese fusion",
  perPage: {
    homepage: {
      title: "SAMURAI | Premium Tokyo Fusion Gastronomy",
      description: "Paris' premier award-winning traditional yet modernized Japanese visual cuisine, delivered in signature insulated thermal cases.",
      keywords: "best sushi Paris, high-end bento, premium sake, Kaiseki delivery"
    },
    menu: {
      title: "Our Selection Index | SAMURAI Haute Cuisine",
      description: "Explore five categories of edible Japanese art. Aromakis, Teppanyaki Gambas, and volcanic-seared skewers flamed with premium dashi butter.",
      keywords: "King Crab California, chef special sato rolls, Bluefin tuna sashimi"
    },
    promotions: {
      title: "Seasonal Enclosures | SAMURAI Curation Banners",
      description: "Access curated promotional discount enclosure codes and custom corporate banquets tailored by Chef Sato.",
      keywords: "sushi discount codes, premium corporate catering Paris"
    }
  }
};

const DEFAULT_HERO: HeroContent = {
  title: "Haut-Choc Culinary Artistry",
  subtitle: "Sourced daily. Prepared live with samurai precision. Sealed within bespoke thermal cedar cases, dispatched via private routes directly to your salon.",
  ctaText: "BEGIN DEGUSTATION",
  promotionBanner: "SAMURAI10"
};

const DEFAULT_STORY: StoryContent = {
  title: "The Sato Philosophy",
  text: "Chef Kenzo Sato holds 25 years of uncompromising sushi mastercraft. After training in Ginza, he realized true luxury transcends the restaurant stool. SAMURAI was born from a single principle: luxury food should arrive at your residential table possessing exact core temperatures, zero degradation, and cinematic visual beauty.",
  imageAlt: "Chef Kenzo Sato preparing sashimis"
};

// Generate realistic simulated historic orders spanning the last 7 days
function generateHistoricOrders(): Order[] {
  const orders: Order[] = [];
  const names = [
    "Alexander Vance", "Claire de Lune", "Jean-Pierre Laurent", "Aria Montaigne", 
    "Sébastien Roche", "Lady Penelope", "Kenji Yoshimara", "Sophia Dubois", 
    "Marc-Antoine", "Chantal Mercier", "Arthur Pendragon", "Isabella King"
  ];
  
  const addresses = [
    "12 Place Vendôme, 75001 Paris", "45 Avenue Montaigne, 75008 Paris", "8 Rue Royale, 75008 Paris",
    "19 Quai d'Anjou, 75004 Paris", "102 Boulevard Saint-Germain, 75005 Paris", "4 Avenue de l'Opéra, 75001 Paris"
  ];

  const phones = ["+33 6 12 34 56 78", "+33 7 88 23 11 90", "+33 6 45 12 09 87", "+33 6 90 22 41 53"];

  const methods: ("cod" | "card" | "applepay" | "googlepay")[] = ["card", "applepay", "googlepay", "cod"];
  const statuses: ("pending" | "preparing" | "cooking" | "dispatched" | "arriving" | "delivered")[] = 
    ["delivered", "delivered", "delivered", "delivered", "delivered", "dispatched", "cooking", "pending"];

  const itemsPool = MENU_ITEMS.slice(0, 10);

  // Generate 25 orders over the last 7 days
  for (let i = 0; i < 25; i++) {
    const orderItems: CartItem[] = [];
    const numItems = Math.floor(Math.random() * 3) + 1;
    let subtotal = 0;
    
    // Grab unique items for this order
    const selectedIndexes = new Set<number>();
    while (selectedIndexes.size < numItems) {
      selectedIndexes.add(Math.floor(Math.random() * itemsPool.length));
    }
    
    Array.from(selectedIndexes).forEach((idx, itemIdx) => {
      const item = itemsPool[idx];
      const quantity = Math.floor(Math.random() * 2) + 1;
      subtotal += item.price * quantity;
      
      orderItems.push({
        id: `orditem-${i}-${itemIdx}`,
        menuItem: item,
        quantity,
        notes: Math.random() > 0.7 ? "Extra ginger please" : undefined
      });
    });

    const isRecent = i >= 20; // 5 most recent orders can have active statuses
    const status = isRecent ? statuses[Math.floor(Math.random() * statuses.length)] : "delivered";
    const paymentMethod = methods[Math.floor(Math.random() * methods.length)];
    
    const deliveryFee = subtotal > 45 ? 0 : 4.90;
    const tax = subtotal * 0.10;
    const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));
    
    // Distribute across the last 7 days
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 7));
    orderDate.setHours(18 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 60));

    orders.push({
      id: `SMR-${892200 + i}`,
      items: orderItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee,
      tax: parseFloat(tax.toFixed(2)),
      total,
      customerName: names[Math.floor(Math.random() * names.length)],
      address: addresses[Math.floor(Math.random() * addresses.length)],
      phone: phones[Math.floor(Math.random() * phones.length)],
      notes: Math.random() > 0.8 ? "Ring penthouse bell directly." : undefined,
      paymentMethod,
      status,
      createdAt: orderDate.toISOString()
    });
  }

  // Sort by date descending
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Global active store values
let globalState: AppState = {
  menuItems: [],
  categories: [],
  orders: [],
  reviews: [],
  coupons: [],
  deliveryZones: [],
  adminUsers: [],
  notifications: [],
  ingredients: [],
  settings: DEFAULT_SETTINGS,
  seo: DEFAULT_SEO,
  hero: DEFAULT_HERO,
  story: DEFAULT_STORY,
  currentUser: null
};

// Listeners list for component React updates (Observer pattern)
const listeners = new Set<() => void>();

const updateAndEmit = (newState: Partial<AppState>) => {
  globalState = { ...globalState, ...newState };
  try {
    localStorage.setItem("samurai_cms_db_v1", JSON.stringify(globalState));
  } catch (e) {
    console.error("Local storage sync error:", e);
  }
  listeners.forEach(l => l());
};

// Initialize the database state on module load
export const initializeStore = () => {
  try {
    const saved = localStorage.getItem("samurai_cms_db_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure generally
      if (parsed.menuItems && parsed.menuItems.length > 0) {
        globalState = parsed;
        return;
      }
    }
  } catch (e) {
    console.warn("Could not load from localStorage, falling back to defaults", e);
  }

  // Set default dataset if not previously set or corrupt
  globalState = {
    menuItems: MENU_ITEMS,
    categories: DEFAULT_CATEGORIES,
    orders: generateHistoricOrders(),
    reviews: REVIEWS,
    coupons: DEFAULT_COUPONS,
    deliveryZones: DEFAULT_DELIVERY_ZONES,
    adminUsers: DEFAULT_ADMIN_USERS,
    notifications: DEFAULT_NOTIFICATIONS,
    ingredients: DEFAULT_INGREDIENTS,
    settings: DEFAULT_SETTINGS,
    seo: DEFAULT_SEO,
    hero: DEFAULT_HERO,
    story: DEFAULT_STORY,
    currentUser: null
  };
  
  try {
    localStorage.setItem("samurai_cms_db_v1", JSON.stringify(globalState));
  } catch (e) {}
};

// Auto run on load
initializeStore();

// --- REACT CUSTOM HOOK FOR STATE ---
export function useAppState() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const handleUpdate = () => {
      setState(globalState);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return state;
}

// --- CMS ACTIONS TO MODIFY DATABASE (WITHOUT EVER TOUCHING CODE) ---
export const storeActions = {
  // Authentication Actions
  login: (email: string, pass: string, remember: boolean): { success: boolean; user?: AdminUser; error?: string } => {
    // Check match
    const found = globalState.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.active);
    if (!found) {
      return { success: false, error: "Invalid administrator credentials or inactive account." };
    }
    
    // Simulate remember token or login success
    updateAndEmit({ currentUser: found });
    if (remember) {
      localStorage.setItem("samurai_admin_session", JSON.stringify(found));
    }
    return { success: true, user: found };
  },

  logout: () => {
    localStorage.removeItem("samurai_admin_session");
    updateAndEmit({ currentUser: null });
  },

  checkPersistedSession: () => {
    try {
      const savedUser = localStorage.getItem("samurai_admin_session");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        updateAndEmit({ currentUser: user });
      }
    } catch (e) {}
  },

  // Menu Management
  addMenuItem: (item: Omit<MenuItem, "id" | "rating">) => {
    const newItem: MenuItem = {
      ...item,
      id: `aro-custom-${Math.floor(Math.random() * 100000)}`,
      rating: 5.0 // start with perfect rating
    };
    updateAndEmit({
      menuItems: [...globalState.menuItems, newItem],
      notifications: [
        {
          id: `not-${Date.now()}`,
          title: "CMS Menu Update",
          message: `Dish "${item.name}" was added successfully.`,
          type: "inventory",
          createdAt: new Date().toISOString(),
          read: false
        },
        ...globalState.notifications
      ]
    });
    return newItem;
  },

  editMenuItem: (id: string, updatedFields: Partial<MenuItem>) => {
    const updated = globalState.menuItems.map(item => 
      item.id === id ? { ...item, ...updatedFields } : item
    );
    updateAndEmit({ menuItems: updated });
  },

  deleteMenuItem: (id: string, softDelete = true) => {
    // Soft delete can set a field like isAvailable = false, or we list standard filter
    // For premium Shopify compatibility, we can remove it or set negative indicators. Let's do absolute remove if requested.
    const updated = globalState.menuItems.filter(item => item.id !== id);
    updateAndEmit({ menuItems: updated });
  },

  // Categories CMS
  createCategory: (categoryName: string) => {
    if (!globalState.categories.includes(categoryName)) {
      updateAndEmit({ categories: [...globalState.categories, categoryName] });
    }
  },

  editCategory: (oldName: string, newName: string) => {
    const updatedCategories = globalState.categories.map(c => c === oldName ? newName : c);
    const updatedMenuItems = globalState.menuItems.map(item => 
      item.category === oldName ? { ...item, category: newName as MenuItemCategory } : item
    );
    updateAndEmit({ categories: updatedCategories, menuItems: updatedMenuItems });
  },

  deleteCategory: (categoryName: string) => {
    const updatedCategories = globalState.categories.filter(c => c !== categoryName);
    // Remove or re-assign items
    const updatedMenuItems = globalState.menuItems.filter(item => item.category !== categoryName);
    updateAndEmit({ categories: updatedCategories, menuItems: updatedMenuItems });
  },

  reorderCategories: (newOrder: string[]) => {
    updateAndEmit({ categories: newOrder });
  },

  // Orders CMS
  createNewOrder: (orderData: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `SMR-${Math.floor(Math.random() * 900000) + 100000}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    // Add real-time notification alert
    const newNotification: Notification = {
      id: `not-${Date.now()}`,
      title: "New Crate Order Received",
      message: `Suite Order ${newOrder.id} placed by ${newOrder.customerName} - €${newOrder.total.toFixed(2)}`,
      type: "order",
      createdAt: new Date().toISOString(),
      read: false
    };

    updateAndEmit({
      orders: [newOrder, ...globalState.orders],
      notifications: [newNotification, ...globalState.notifications]
    });

    return newOrder;
  },

  updateOrderStatus: (orderId: string, status: Order["status"] | "cancelled") => {
    const updated = globalState.orders.map(o => 
      o.id === orderId ? { ...o, status: status as any } : o
    );
    updateAndEmit({ orders: updated });
  },

  // Delivery Setting CMS
  updateDeliveryZone: (id: string, updatedFields: Partial<DeliveryZone>) => {
    const updated = globalState.deliveryZones.map(z => 
      z.id === id ? { ...z, ...updatedFields } : z
    );
    updateAndEmit({ deliveryZones: updated });
  },

  // Website Homepage Theme Customizer CMS
  updateHero: (fields: Partial<HeroContent>) => {
    updateAndEmit({ hero: { ...globalState.hero, ...fields } });
  },

  updateStory: (fields: Partial<StoryContent>) => {
    updateAndEmit({ story: { ...globalState.story, ...fields } });
  },

  // Testimonials & Reviews
  addReview: (review: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...review,
      id: `rev-custom-${Math.floor(Math.random() * 100000)}`,
      date: "Just now"
    };
    updateAndEmit({
      reviews: [newReview, ...globalState.reviews],
      notifications: [
        {
          id: `not-${Date.now()}`,
          title: "New Customer Review",
          message: `${review.name} left a ${review.rating}-star review`,
          type: "review",
          createdAt: new Date().toISOString(),
          read: false
        },
        ...globalState.notifications
      ]
    });
  },

  editReview: (id: string, fields: Partial<Review>) => {
    const updated = globalState.reviews.map(r => r.id === id ? { ...r, ...fields } : r);
    updateAndEmit({ reviews: updated });
  },

  deleteReview: (id: string) => {
    const updated = globalState.reviews.filter(r => r.id !== id);
    updateAndEmit({ reviews: updated });
  },

  // Promo Coupon Codes CMS
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount">) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cop-${Math.floor(Math.random() * 100000)}`,
      usedCount: 0
    };
    updateAndEmit({ coupons: [...globalState.coupons, newCoupon] });
  },

  editCoupon: (id: string, fields: Partial<Coupon>) => {
    const updated = globalState.coupons.map(c => c.id === id ? { ...c, ...fields } : c);
    updateAndEmit({ coupons: updated });
  },

  deleteCoupon: (id: string) => {
    const updated = globalState.coupons.filter(c => c.id !== id);
    updateAndEmit({ coupons: updated });
  },

  // Restaurant Settings
  updateSettings: (fields: Partial<AppSettings>) => {
    updateAndEmit({ settings: { ...globalState.settings, ...fields } });
  },

  // SEO Configurations
  updateSEO: (fields: Partial<WebsiteSEO>) => {
    updateAndEmit({ seo: { ...globalState.seo, ...fields } });
  },

  updatePageSEO: (pageKey: string, fields: { title: string; description: string; keywords: string }) => {
    const updatedPerPage = { ...globalState.seo.perPage, [pageKey]: fields };
    updateAndEmit({ seo: { ...globalState.seo, perPage: updatedPerPage } });
  },

  // Inventory Stocks Tracker
  updateIngredientLevel: (id: string, fields: Partial<IngredientLevel>) => {
    const updated = globalState.ingredients.map(ing => {
      if (ing.id === id) {
        const item = { ...ing, ...fields };
        // Check if low inventory triggers notification alert
        if (item.stock < item.minAlert) {
          // Check if alert already logged recently to prevent duplicate flooding
          const alreadyExists = globalState.notifications.some(
            n => n.type === "inventory" && n.message.includes(item.name) && !n.read
          );
          if (!alreadyExists) {
            const lowAlert: Notification = {
              id: `not-stock-${Date.now()}`,
              title: "Critical Low Stock Alert",
              message: `${item.name} stock has fallen below safety margin (${item.stock}${item.unit} remaining)`,
              type: "inventory",
              createdAt: new Date().toISOString(),
              read: false
            };
            setTimeout(() => {
              updateAndEmit({ notifications: [lowAlert, ...globalState.notifications] });
            }, 100);
          }
        }
        return item;
      }
      return ing;
    });
    updateAndEmit({ ingredients: updated });
  },

  // Staff Account RBAC managers
  addAdminUser: (user: Omit<AdminUser, "id">) => {
    const newUser: AdminUser = {
      ...user,
      id: `usr-${Math.floor(Math.random() * 100000)}`
    };
    updateAndEmit({ adminUsers: [...globalState.adminUsers, newUser] });
  },

  editAdminUser: (id: string, fields: Partial<AdminUser>) => {
    const updated = globalState.adminUsers.map(u => u.id === id ? { ...u, ...fields } : u);
    updateAndEmit({ adminUsers: updated });
  },

  deleteAdminUser: (id: string) => {
    const updated = globalState.adminUsers.filter(u => u.id !== id);
    updateAndEmit({ adminUsers: updated });
  },

  // Notification status
  readAllNotifications: () => {
    const updated = globalState.notifications.map(n => ({ ...n, read: true }));
    updateAndEmit({ notifications: updated });
  },

  // Backup System: Export entire store JSON
  exportDatabaseJSON: () => {
    const dataStr = JSON.stringify(globalState, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `samurai_db_backup_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Backup System: Restore store JSON
  importDatabaseJSON: (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.menuItems && parsed.categories && parsed.orders && parsed.settings) {
        updateAndEmit(parsed);
        return { success: true };
      }
      return { success: false, error: "Invalid backup file structure. Missing mandatory DB sheets." };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to parse JSON backup files." };
    }
  },

  // Backup System: CSV exports
  exportMenuCSV: () => {
    let csv = "ID,Name,Category,Price,Calories,PrepTime,Rating,Ingredients\n";
    globalState.menuItems.forEach(item => {
      csv += `"${item.id}","${item.name.replace(/"/g, '""')}","${item.category}",${item.price},${item.calories},${item.prepTime},${item.rating},"${item.ingredients.join(", ").replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "samurai_menu_export.csv";
    link.click();
  },

  exportOrdersCSV: () => {
    let csv = "OrderID,CustomerName,Address,Phone,Total,PaymentMethod,Status,CreatedAt,ItemsSummary\n";
    globalState.orders.forEach(o => {
      const itemSummary = o.items.map(item => `${item.menuItem.name}x${item.quantity}`).join(" | ");
      csv += `"${o.id}","${o.customerName.replace(/"/g, '""')}","${o.address.replace(/"/g, '""')}","${o.phone}",${o.total},"${o.paymentMethod}","${o.status}","${o.createdAt}","${itemSummary.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "samurai_orders_export.csv";
    link.click();
  }
};
