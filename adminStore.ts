import { initialProducts, categories as defaultCategories } from "./products";
import type { Product, Category } from "./products";

// ─── Supabase Config ────────────────────────────────────────────────────────
const SUPABASE_URL = "https://cpnzxxgmsresflpgsfnv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbnp4eGdtc3Jlc2ZscGdzZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDY2MzIsImV4cCI6MjA5NjUyMjYzMn0.MdoCbrJ5dutYfC4xlioOgpHkp7PcAJWXWH1ggoH88Xg";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

async function sbFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  // No content responses
  if (res.status === 204) return null;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "akaimed01@gmail.com";
const ADMIN_PASSWORD = "L#GaCpPGVZ2kjLPghry";
const AUTH_KEY = "akaimed_admin_auth";

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

// ─── DB Row ↔ Product Mappers ────────────────────────────────────────────────
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    categoryId: row.category_id as string,
    brand: row.brand as string,
    shortDescription: row.short_description as string,
    description: row.description as string,
    image: row.image as string,
    gallery: (row.gallery as string[]) || [],
    specifications: (row.specifications as { label: string; value: string }[]) || [],
    features: (row.features as string[]) || [],
    pdfBrochure: (row.pdf_brochure as string) || undefined,
    tags: (row.tags as string[]) || [],
    featured: row.featured as boolean,
    createdAt: row.created_at as string,
  };
}

function productToRow(p: Omit<Product, "id" | "createdAt"> & { id?: string; createdAt?: string }) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    category_id: p.categoryId,
    brand: p.brand,
    short_description: p.shortDescription,
    description: p.description,
    image: p.image,
    gallery: p.gallery,
    specifications: p.specifications,
    features: p.features,
    pdf_brochure: p.pdfBrochure || null,
    tags: p.tags,
    featured: p.featured,
    created_at: p.createdAt,
  };
}

// ─── Seed helper: insert defaults if tables are empty ───────────────────────
async function seedIfEmpty() {
  try {
    const cats = await sbFetch("categories?select=id&limit=1");
    if (!cats || cats.length === 0) {
      // Insert default categories
      await sbFetch("categories", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(defaultCategories),
      });
      // Insert default products
      const rows = initialProducts.map(productToRow);
      await sbFetch("products", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(rows),
      });
    }
  } catch {
    // If seeding fails, ignore — tables may already have data
  }
}

// Run seed on module load (fire and forget)
seedIfEmpty();

// ─── Categories ──────────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  try {
    const rows = await sbFetch("categories?select=*&order=created_at.asc");
    return rows.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      name: r.name as string,
      description: r.description as string,
      icon: r.icon as string,
    }));
  } catch {
    return defaultCategories;
  }
}

export async function addCategory(
  category: Omit<Category, "id">
): Promise<Category> {
  const newCat: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  await sbFetch("categories", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(newCat),
  });
  return newCat;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category | null> {
  await sbFetch(`categories?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(updates),
  });
  const rows = await sbFetch(`categories?id=eq.${id}&select=*`);
  if (!rows || rows.length === 0) return null;
  return rows[0] as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await sbFetch(`categories?id=eq.${id}`, { method: "DELETE" });
  return true;
}

// ─── Products ────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await sbFetch("products?select=*&order=created_at.asc");
    return rows.map(rowToProduct);
  } catch {
    return initialProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const rows = await sbFetch(`products?id=eq.${id}&select=*`);
    if (!rows || rows.length === 0) return null;
    return rowToProduct(rows[0]);
  } catch {
    return null;
  }
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  await sbFetch("products", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(productToRow(newProduct)),
  });
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  // Build partial row (only changed fields)
  const rowUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) rowUpdates.name = updates.name;
  if (updates.category !== undefined) rowUpdates.category = updates.category;
  if (updates.categoryId !== undefined) rowUpdates.category_id = updates.categoryId;
  if (updates.brand !== undefined) rowUpdates.brand = updates.brand;
  if (updates.shortDescription !== undefined) rowUpdates.short_description = updates.shortDescription;
  if (updates.description !== undefined) rowUpdates.description = updates.description;
  if (updates.image !== undefined) rowUpdates.image = updates.image;
  if (updates.gallery !== undefined) rowUpdates.gallery = updates.gallery;
  if (updates.specifications !== undefined) rowUpdates.specifications = updates.specifications;
  if (updates.features !== undefined) rowUpdates.features = updates.features;
  if (updates.pdfBrochure !== undefined) rowUpdates.pdf_brochure = updates.pdfBrochure ?? null;
  if (updates.tags !== undefined) rowUpdates.tags = updates.tags;
  if (updates.featured !== undefined) rowUpdates.featured = updates.featured;

  await sbFetch(`products?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(rowUpdates),
  });
  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await sbFetch(`products?id=eq.${id}`, { method: "DELETE" });
  return true;
}

export async function saveProducts(_products: Product[]): Promise<void> {
  // Not needed with Supabase — kept for compatibility
}

export async function saveCategories(_cats: Category[]): Promise<void> {
  // Not needed with Supabase — kept for compatibility
}
