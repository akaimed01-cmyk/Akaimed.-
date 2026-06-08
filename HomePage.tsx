import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Grid3X3, Search } from "lucide-react";
import { getProducts, getCategories } from "./adminStore";
import type { Product, Category } from "./products";
import ProductCard from "./ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    }
    load();
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const categoryIcons: Record<string, string> = {
    nicu: "🍼",
    icu: "🏥",
    "operating-room": "⚕️",
    monitoring: "📊",
  };

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Medical Equipment"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/75 to-gray-900/40" />
        </div>

        {/* Geometric accent */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-10"
          style={{
            background:
              "linear-gradient(135deg, #c41e3a 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-2xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-red-700/20 border border-red-500/30 text-red-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Medical Equipment Catalog
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              Advanced Healthcare{" "}
              <span className="text-red-400">Equipment</span> Solutions
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-gray-300 leading-relaxed mb-8"
            >
              Delivering innovative medical technologies for NICU, ICU and
              Operating Rooms.
            </motion.p>

            {/* Search */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearch}
              className="flex gap-2 mb-8"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                Search
              </button>
            </motion.form>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30"
              >
                Browse All Products <ArrowRight size={18} />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
              >
                View Categories <Grid3X3 size={18} />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#categories"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: products.length.toString(), label: "Products Available" },
              { number: categories.length.toString(), label: "Categories" },
              { number: "NICU", label: "Neonatal Solutions" },
              { number: "ICU", label: "Intensive Care" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="py-4"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-red-700 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">
              Browse by Category
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Product Categories
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="block group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-red-100 transition-colors">
                    {categoryIcons[cat.id] || cat.icon || "⚕️"}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-red-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-red-600 text-sm font-medium">
                    View Products <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
            >
              <div>
                <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">
                  Top Picks
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  Featured Products
                </h2>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
              >
                View All Products <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL PRODUCTS STRIP ── */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Explore the Full Product Catalog
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Browse all available medical equipment with advanced search, category
              filters and detailed specifications.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
