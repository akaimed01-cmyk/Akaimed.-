import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { getProducts, getCategories } from "./adminStore";
import type { Product, Category } from "./products";
import ProductCard from "./ProductCard";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (activeCategory !== "all") params.category = activeCategory;
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory]);

  // Filter logic
  const filtered = products
    .filter((p) => {
      const matchCat =
        activeCategory === "all" || p.categoryId === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.brand.toLowerCase().includes(q);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSortBy("default");
  };

  const hasFilters =
    searchQuery !== "" || activeCategory !== "all" || sortBy !== "default";

  return (
    <div className="page-enter min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">
              Medical Equipment
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1 mb-2">
              Product Catalog
            </h1>
            <p className="text-gray-500 text-base">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}{" "}
              {hasFilters ? "found" : "available"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, brand..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-medium"
          >
            <Filter size={16} />
            Filters
            {activeCategory !== "all" && (
              <span className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap"
            >
              <X size={16} />
              Clear All
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } sm:block w-full sm:w-56 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <Filter size={15} /> Categories
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === "all"
                        ? "bg-red-50 text-red-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                    <span className="ml-auto float-right text-xs text-gray-400">
                      {products.length}
                    </span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = products.filter(
                    (p) => p.categoryId === cat.id
                  ).length;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCategory === cat.id
                            ? "bg-red-50 text-red-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                        <span className="ml-auto float-right text-xs text-gray-400">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or clearing the filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-800 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
