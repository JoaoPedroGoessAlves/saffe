import { Link } from "wouter";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full shadow-md hover-elevate">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
