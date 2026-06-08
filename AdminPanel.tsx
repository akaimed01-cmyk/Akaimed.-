import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FolderOpen,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import {
  adminLogout,
  getProducts,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./adminStore";
import type { Product, Category, ProductSpec } from "./products";

type Tab = "products" | "categories";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ProductFormData {
  name: string;
  categoryId: string;
  brand: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string;
  specifications: ProductSpec[];
  features: string[];
  pdfBrochure: string;
  tags: string;
  featured: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  categoryId: "nicu",
  brand: "Akai-Med",
  shortDescription: "",
  description: "",
  image: "",
  gallery: "",
  specifications: [{ label: "", value: "" }],
  features: [""],
  pdfBrochure: "",
  tags: "",
  featured: false,
};

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Product modal state
  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Category modal state
  const [catModal, setCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", description: "", icon: "" });
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);

  const [expandedSpec, setExpandedSpec] = useState(true);
  const [expandedFeatures, setExpandedFeatures] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }

  function showToast(type: "success" | "error", message: string) {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }

  // ─── IMAGE UPLOAD ───────────────────────────────────────────────────
  const SUPABASE_URL = "https://cpnzxxgmsresflpgsfnv.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbnp4eGdtc3Jlc2ZscGdzZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDY2MzIsImV4cCI6MjA5NjUyMjYzMn0.MdoCbrJ5dutYfC4xlioOgpHkp7PcAJWXWH1ggoH88Xg";

  async function uploadToSupabase(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const filename = `product-${Date.now()}.${ext}`;
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/images/${filename}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      }
    );
    if (!res.ok) throw new Error("Upload failed");
    return `${SUPABASE_URL}/storage/v1/object/public/images/${filename}`;
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadToSupabase(file);
      setProductForm((f) => ({ ...f, image: url }));
      showToast("success", "Image uploaded successfully!");
    } catch {
      showToast("error", "Image upload failed. Check Supabase Storage bucket.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadToSupabase));
      setProductForm((f) => ({
        ...f,
        gallery: f.gallery ? f.gallery + "\n" + urls.join("\n") : urls.join("\n"),
      }));
      showToast("success", `${urls.length} image(s) uploaded!`);
    } catch {
      showToast("error", "Gallery upload failed.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function handleLogout() {
    adminLogout();
    onLogout();
  }

  // ─── PRODUCT CRUD ───────────────────────────────────────────────────

  function openAddProduct() {
    setEditingProduct(null);
    setProductForm({ ...emptyForm, categoryId: categories[0]?.id || "nicu" });
    setProductModal(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      categoryId: product.categoryId,
      brand: product.brand,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image,
      gallery: (product.gallery || []).join("\n"),
      specifications:
        product.specifications.length > 0
          ? product.specifications
          : [{ label: "", value: "" }],
      features: product.features.length > 0 ? product.features : [""],
      pdfBrochure: product.pdfBrochure || "",
      tags: product.tags.join(", "),
      featured: product.featured,
    });
    setProductModal(true);
  }

  async function handleSaveProduct() {
    if (!productForm.name.trim()) {
      showToast("error", "Product name is required.");
      return;
    }
    setSaving(true);
    try {
      const cat = categories.find((c) => c.id === productForm.categoryId);
      const galleryArr = productForm.gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const data = {
        name: productForm.name.trim(),
        category: cat?.name || productForm.categoryId,
        categoryId: productForm.categoryId,
        brand: productForm.brand.trim(),
        shortDescription: productForm.shortDescription.trim(),
        description: productForm.description.trim(),
        image: productForm.image.trim() || galleryArr[0] || "",
        gallery: galleryArr.length > 0 ? galleryArr : [productForm.image.trim()],
        specifications: productForm.specifications.filter(
          (s) => s.label.trim() && s.value.trim()
        ),
        features: productForm.features.filter((f) => f.trim()),
        pdfBrochure: productForm.pdfBrochure.trim() || undefined,
        tags: productForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured: productForm.featured,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        showToast("success", "Product updated successfully.");
      } else {
        await addProduct(data);
        showToast("success", "Product added successfully.");
      }
      setProductModal(false);
      await refreshData();
    } catch {
      showToast("error", "Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      showToast("success", "Product deleted.");
      await refreshData();
    } catch {
      showToast("error", "Failed to delete product.");
    }
  }

  // ─── SPEC / FEATURE HELPERS ──────────────────────────────────────────

  function addSpec() {
    setProductForm((f) => ({
      ...f,
      specifications: [...f.specifications, { label: "", value: "" }],
    }));
  }

  function removeSpec(i: number) {
    setProductForm((f) => ({
      ...f,
      specifications: f.specifications.filter((_, idx) => idx !== i),
    }));
  }

  function updateSpec(i: number, field: "label" | "value", val: string) {
    setProductForm((f) => {
      const specs = [...f.specifications];
      specs[i] = { ...specs[i], [field]: val };
      return { ...f, specifications: specs };
    });
  }

  function addFeature() {
    setProductForm((f) => ({ ...f, features: [...f.features, ""] }));
  }

  function removeFeature(i: number) {
    setProductForm((f) => ({
      ...f,
      features: f.features.filter((_, idx) => idx !== i),
    }));
  }

  function updateFeature(i: number, val: string) {
    setProductForm((f) => {
      const feats = [...f.features];
      feats[i] = val;
      return { ...f, features: feats };
    });
  }

  // ─── CATEGORY CRUD ───────────────────────────────────────────────────

  function openAddCategory() {
    setEditingCat(null);
    setCatForm({ name: "", description: "", icon: "⚕️" });
    setCatModal(true);
  }

  function openEditCategory(cat: Category) {
    setEditingCat(cat);
    setCatForm({ name: cat.name, description: cat.description, icon: cat.icon });
    setCatModal(true);
  }

  async function handleSaveCategory() {
    if (!catForm.name.trim()) {
      showToast("error", "Category name is required.");
      return;
    }
    setSaving(true);
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, catForm);
        showToast("success", "Category updated.");
      } else {
        await addCategory(catForm);
        showToast("success", "Category added.");
      }
      setCatModal(false);
      await refreshData();
    } catch {
      showToast("error", "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    try {
      await deleteCategory(id);
      setDeleteCatConfirm(null);
      showToast("success", "Category deleted.");
      await refreshData();
    } catch {
      showToast("error", "Failed to delete category.");
    }
  }

  // ─── RENDER ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pt-0">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
                t.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {t.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Admin Header */}
      <header className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-0">
              <span
                className="text-xl font-black tracking-tight"
                style={{ color: "#c41e3a", fontFamily: "'Georgia', serif" }}
              >
                AKAI
              </span>
              <span className="text-sm font-normal ml-1 text-gray-400">Med</span>
            </div>
            <span className="text-gray-600 text-sm hidden sm:inline">|</span>
            <span className="text-gray-400 text-sm hidden sm:inline">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {(
              [
                { id: "products", label: "Products", icon: Package },
                { id: "categories", label: "Categories", icon: FolderOpen },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  tab === id
                    ? "border-red-600 text-red-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon size={17} />
                {label}
                {id === "products" && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                )}
                {id === "categories" && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {categories.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-red-600" />
          </div>
        ) : (
          <>
            {/* ─── PRODUCTS TAB ─── */}
            {tab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Products</h2>
                    <p className="text-sm text-gray-500">{products.length} total products</p>
                  </div>
                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    <Plus size={17} />
                    Add Product
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <Package size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products yet. Add your first product.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                              Product
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">
                              Category
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                              Brand
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                              Featured
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, i) => (
                            <tr
                              key={product.id}
                              className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                i === products.length - 1 ? "border-b-0" : ""
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%23f3f4f6' width='40' height='40'/%3E%3C/svg%3E";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                                      {product.shortDescription}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 hidden sm:table-cell">
                                <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-4 py-4 hidden md:table-cell">
                                <span className="text-sm text-gray-600">{product.brand}</span>
                              </td>
                              <td className="px-4 py-4 hidden lg:table-cell">
                                {product.featured ? (
                                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">No</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditProduct(product)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  {deleteConfirm === product.id ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() =>
                                          handleDeleteProduct(product.id)
                                        }
                                        className="text-xs px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm(product.id)
                                      }
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── CATEGORIES TAB ─── */}
            {tab === "categories" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                    <p className="text-sm text-gray-500">{categories.length} categories</p>
                  </div>
                  <button
                    onClick={openAddCategory}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    <Plus size={17} />
                    Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-red-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl">
                          {cat.icon || "⚕️"}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditCategory(cat)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          {deleteCatConfirm === cat.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg font-medium"
                              >
                                Del
                              </button>
                              <button
                                onClick={() => setDeleteCatConfirm(null)}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteCatConfirm(cat.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                      <div className="mt-3 text-xs text-gray-400">
                        {products.filter((p) => p.categoryId === cat.id).length} products
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── PRODUCT MODAL ─── */}
      <AnimatePresence>
        {productModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setProductModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setProductModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="e.g. Infant Incubator Pro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) =>
                        setProductForm((f) => ({
                          ...f,
                          categoryId: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, brand: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="Akai-Med"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={productForm.shortDescription}
                      onChange={(e) =>
                        setProductForm((f) => ({
                          ...f,
                          shortDescription: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="One-line product summary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <ImageIcon size={14} /> Main Image
                  </label>
                  {/* Upload button */}
                  <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors mb-2 ${uploadingImage ? "border-gray-200 bg-gray-50 text-gray-400" : "border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 text-red-600"}`}>
                    {uploadingImage ? (
                      <><Loader2 size={16} className="animate-spin" /><span className="text-sm font-medium">Uploading...</span></>
                    ) : (
                      <><ImageIcon size={16} /><span className="text-sm font-medium">Upload Image from Device</span></>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} disabled={uploadingImage} />
                  </label>
                  {/* Preview */}
                  {productForm.image && (
                    <div className="mb-2 relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={productForm.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  {/* Manual URL fallback */}
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm((f) => ({ ...f, image: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="أو الصق رابط الصورة هنا (https://...)"
                  />
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors mb-2 ${uploadingGallery ? "border-gray-200 bg-gray-50 text-gray-400" : "border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-600"}`}>
                    {uploadingGallery ? (
                      <><Loader2 size={16} className="animate-spin" /><span className="text-sm font-medium">Uploading...</span></>
                    ) : (
                      <><ImageIcon size={16} /><span className="text-sm font-medium">Upload Gallery Images (multiple)</span></>
                    )}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                  </label>
                  <textarea
                    value={productForm.gallery}
                    onChange={(e) => setProductForm((f) => ({ ...f, gallery: e.target.value }))}
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                    placeholder="الروابط بتتضاف أوتوماتيك بعد الرفع، أو حطهم يدوياً سطر سطر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF Brochure URL
                  </label>
                  <input
                    type="text"
                    value={productForm.pdfBrochure}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        pdfBrochure: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="https://... or /pdfs/brochure.pdf"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedSpec(!expandedSpec)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3"
                  >
                    Technical Specifications ({productForm.specifications.filter((s) => s.label).length})
                    {expandedSpec ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedSpec && (
                    <div className="space-y-2">
                      {productForm.specifications.map((spec, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={spec.label}
                            onChange={(e) => updateSpec(i, "label", e.target.value)}
                            placeholder="Label (e.g. Temperature Range)"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
                          />
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => updateSpec(i, "value", e.target.value)}
                            placeholder="Value (e.g. 25°C – 37°C)"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpec(i)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSpec}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Specification
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedFeatures(!expandedFeatures)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3"
                  >
                    Key Features ({productForm.features.filter((f) => f.trim()).length})
                    {expandedFeatures ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedFeatures && (
                    <div className="space-y-2">
                      {productForm.features.map((feat, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => updateFeature(i, e.target.value)}
                            placeholder="e.g. Servo-controlled temperature regulation"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(i)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Feature
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={productForm.tags}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, tags: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="nicu, incubator, newborn"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={productForm.featured}
                      onChange={(e) =>
                        setProductForm((f) => ({
                          ...f,
                          featured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    <label
                      htmlFor="featured"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Mark as Featured
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setProductModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CATEGORY MODAL ─── */}
      <AnimatePresence>
        {catModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setCatModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingCat ? "Edit Category" : "Add Category"}
                </h2>
                <button
                  onClick={() => setCatModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="e.g. NICU Equipment"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={catForm.description}
                    onChange={(e) =>
                      setCatForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                    placeholder="Short description of the category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={catForm.icon}
                    onChange={(e) =>
                      setCatForm((f) => ({ ...f, icon: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="e.g. 🍼 or ⚕️"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setCatModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingCat ? "Update" : "Add Category"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
