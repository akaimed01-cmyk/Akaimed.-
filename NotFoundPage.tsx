import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="text-8xl font-black text-red-700/10 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-800 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
