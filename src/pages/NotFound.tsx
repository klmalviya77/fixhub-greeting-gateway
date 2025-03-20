
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/container";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-24">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-9xl font-bold text-fixhub-blue mb-6 animate-float">404</h1>
            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
            <p className="text-fixhub-dark-gray mb-8">
              The page you are looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            
            <Link
              to="/"
              className="fixhub-button fixhub-button-primary px-6 py-3 inline-flex items-center spring-effect"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
