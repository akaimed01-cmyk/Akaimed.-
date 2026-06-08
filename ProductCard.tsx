import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Tag } from "lucide-react";
import type { Product } from "./products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/products/${product.id}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 product-card shadow-sm hover:border-red-100">
          {/* Image */}
          <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EMedical Equipment%3C/text%3E%3C/svg%3E";
              }}
            />
            {product.featured && (
              <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Category Badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={12} className="text-red-500" />
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            {/* Name */}
            <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-2 group-hover:text-red-700 transition-colors">
              {product.name}
            </h3>

            {/* Brand */}
            <p className="text-xs text-gray-400 mb-2">{product.brand}</p>

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
              {product.shortDescription}
            </p>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-red-700 group-hover:text-red-800 flex items-center gap-1 transition-all">
                View Details
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
              {product.pdfBrochure && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  PDF Available
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
