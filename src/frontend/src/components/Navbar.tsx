import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ChevronDown, Menu, Search, Ticket, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

const NAV_LINKS = [
  { label: "Movies", to: "/events" },
  { label: "My Bookings", to: "/bookings" },
  { label: "Support", to: "/support" },
];

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const location = useLocation();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchVal);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground">
            Cine<span className="text-brand-orange">Book</span>
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  isActive
                    ? "text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                location.pathname === "/admin"
                  ? "text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              Admin
            </Link>
          )}
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-xs ml-auto"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              className="pl-9 bg-accent border-border text-sm h-9 w-full"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              data-ocid="nav.search_input"
            />
          </div>
        </form>

        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex text-muted-foreground hover:text-foreground"
            data-ocid="nav.button"
          >
            <Bell className="w-5 h-5" />
          </Button>

          {identity ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-9 px-2"
                  data-ocid="nav.dropdown_menu"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {shortPrincipal?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm text-muted-foreground max-w-[80px] truncate">
                    {shortPrincipal}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/bookings" data-ocid="nav.link">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" data-ocid="nav.link">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive"
                  data-ocid="nav.button"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
              data-ocid="nav.primary_button"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
