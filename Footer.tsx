import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-0 mb-4">
              <span
                className="text-2xl font-black tracking-tight"
                style={{ color: "#c41e3a", fontFamily: "'Georgia', serif" }}
              >
                AKAI
              </span>
              <span className="text-base font-normal ml-1 text-gray-400">Med</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Professional medical equipment catalog. Delivering high-quality healthcare
              technologies for NICU, ICU and Operating Rooms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "NICU Equipment", path: "/products?category=nicu" },
                { label: "ICU Solutions", path: "/products?category=icu" },
                { label: "Operating Room", path: "/products?category=operating-room" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">
              Product Categories
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Infant Incubators", path: "/products?search=incubator" },
                { label: "Infant Warmers", path: "/products?search=warmer" },
                { label: "Ventilators", path: "/products?search=ventilator" },
                { label: "Patient Monitors", path: "/products?search=monitor" },
                { label: "Surgical Tables", path: "/products?search=surgical+table" },
                { label: "Surgical Lights", path: "/products?search=surgical+light" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Akai-Med. All rights reserved.
          </p>
          <a
            href="https://web-3-velix-ai.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-sm hover:text-red-400 transition-colors"
          >
            Produced by{" "}
            <span className="text-red-500 font-semibold">VELIX AI</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
