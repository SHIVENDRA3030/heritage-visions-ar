import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, Clock, Search, Menu, X, Moon, Sun, 
  ChevronRight, MapPin, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";
import heritageIcon from "@/assets/heritage-logo.png";

interface HeaderProps {
  monumentCount?: number;
}

export function Header({ monumentCount = 0 }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Timeline", href: "/timeline", icon: Clock },
  ];

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/") return [{ name: "Home", href: "/" }];
    if (path === "/timeline") return [
      { name: "Home", href: "/" },
      { name: "Timeline", href: "/timeline" }
    ];
    if (path.startsWith("/monument/")) {
      const slug = path.split("/monument/")[1];
      return [
        { name: "Home", href: "/" },
        { name: "Monument", href: "#", current: true }
      ];
    }
    return [{ name: "Home", href: "/" }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <img 
                  src={heritageIcon} 
                  alt="Heritage Logo" 
                  className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              <div>
                <h1 className="font-heritage font-bold text-foreground text-lg">
                  Virtual Heritage
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {monumentCount}+ Sites
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </motion.button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCommandOpen(true)}
                className="relative hover:bg-muted"
              >
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    {mobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-6">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      
                      return (
                        <Button
                          key={item.name}
                          variant={isActive ? "default" : "ghost"}
                          className="justify-start gap-3 h-12"
                          onClick={() => {
                            navigate(item.href);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Icon className="w-5 h-5" />
                          {item.name}
                        </Button>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="pb-4"
            >
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.name} className="flex items-center">
                      <BreadcrumbItem>
                        {crumb.current ? (
                          <BreadcrumbPage className="font-medium">
                            {crumb.name}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            onClick={() => navigate(crumb.href)}
                            className="cursor-pointer hover:text-foreground"
                          >
                            {crumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator>
                          <ChevronRight className="w-4 h-4" />
                        </BreadcrumbSeparator>
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>
          )}
        </div>
      </motion.header>

      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </>
  );
}