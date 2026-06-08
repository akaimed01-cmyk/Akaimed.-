import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Tag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { getProductById, getProducts } from "./adminStore";
import type { Product } from "./products";
import ProductCard from "./ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "features">("specs");

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((found) => {
      if (!found) {
        navigate("/products");
        return;
      }
      setProduct(found);
      setActiveImage(0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Related products: same category, different id
    const all = getProducts();
    const rel = all
      .filter((p) => p.categoryId === found.categoryId && p.id !== found.id)
      .slice(0, 3);
    setRelated(rel);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full" />
      </div>
    );
  }

  const allImages = product.gallery?.length > 0 ? product.gallery : [product.image];

  const prevImage = () =>
    setActiveImage((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImage = () =>
    setActiveImage((i) => (i + 1) % allImages.length);

  return (
    <div className="page-enter min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-red-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-red-700 transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.categoryId}`}
              className="hover:text-red-700 transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-700 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            {/* Main Image */}
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square mb-4"
            >
              <img
                src={allImages[activeImage]}
                alt={`${product.name} - Image ${activeImage + 1}`}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EMedical Equipment%3C/text%3E%3C/svg%3E";
                }}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {product.featured && (
                <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-red-600 shadow-md"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-contain bg-gray-50 p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category Badge */}
            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={13} className="text-red-500" />
              <Link
                to={`/products?category=${product.categoryId}`}
                className="text-xs font-semibold text-red-600 uppercase tracking-wider hover:text-red-800 transition-colors"
              >
                {product.category}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-gray-400 mb-4">Brand: {product.brand}</p>

            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {product.pdfBrochure ? (
                <a
                  href={product.pdfBrochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors"
                >
                  <Download size={18} />
                  Download Brochure
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl text-sm cursor-not-allowed">
                  <Download size={18} />
                  No Brochure Available
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100 mb-6">
              <div className="flex gap-6">
                {(["specs", "features"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                      activeTab === tab
                        ? "border-red-600 text-red-700"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "specs" ? "Specifications" : "Features"}
                  </button>
                ))}
              </div>
            </div>

            {/* Specs */}
            {activeTab === "specs" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-0 rounded-xl overflow-hidden border border-gray-100"
              >
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex py-3 px-4 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-700 w-1/2">
                      {spec.label}
                    </span>
                    <span className="text-sm text-gray-600 w-1/2">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Features */}
            {activeTab === "features" && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">{feat}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <div className="border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rel, i) => (
                  <ProductCard key={rel.id} product={rel} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
