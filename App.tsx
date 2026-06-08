import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import HomePage from "./HomePage";
import ProductsPage from "./ProductsPage";
import ProductDetailPage from "./ProductDetailPage";
import AdminPage from "./AdminPage";
import NotFoundPage from "./NotFoundPage";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>} />
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
