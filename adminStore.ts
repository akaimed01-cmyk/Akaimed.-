import { initialProducts, categories } from "./products";
import type { Product, Category } from "./products";

// Admin credentials
const ADMIN_EMAIL = "akaimed01@gmail.com";
const ADMIN_PASSWORD = "L#GaCpPGVZ2kjLPghry";
const AUTH_KEY = "akaimed_admin_auth";
const PRODUCTS_KEY = "akaimed_products";
const CATEGORIES_KEY = "akaimed_categories";

// Auth functions
export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

// Product store
export function getProducts(): Product[] {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return initialProducts;
    }
  }
  // Initialize with default products
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((p) => p.id === id) || null;
}

// Category store
export function getCategories(): Category[] {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Category[];
    } catch {
      return categories;
    }
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
}

export function saveCategories(cats: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

export function addCategory(category: Omit<Category, "id">): Category {
  const cats = getCategories();
  const newCat: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  cats.push(newCat);
  saveCategories(cats);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const cats = getCategories();
  const index = cats.findIndex((c) => c.id === id);
  if (index === -1) return null;
  cats[index] = { ...cats[index], ...updates };
  saveCategories(cats);
  return cats[index];
}

export function deleteCategory(id: string): boolean {
  const cats = getCategories();
  const filtered = cats.filter((c) => c.id !== id);
  if (filtered.length === cats.length) return false;
  saveCategories(filtered);
  return true;
}
