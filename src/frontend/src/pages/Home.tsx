import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Music,
  Palette,
  Search,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Event } from "../backend.d";
import { EventCard } from "../components/EventCard";
import { sampleEvents } from "../data/sampleEvents";
import { useListEvents } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  const d = new Date(Number(ts));
  return {
    full: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

const CATEGORIES = [
  {
    label: "Action",
    icon: Trophy,
    color: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  },
  {
    label: "Drama",
    icon: Palette,
    color:
      "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  },
  {
    label: "Comedy",
    icon: Sparkles,
    color:
      "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
  },
  {
    label: "Thriller",
    icon: Music,
    color:
      "from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400",
  },
  {
    label: "Romance",
    icon: Users,
    color: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400",
  },
];

const MANAGE_ITEMS = [
  { label: "View All Bookings", to: "/bookings" },
  { label: "Download Tickets", to: "/bookings" },
  { label: "Cancel Reservation", to: "/bookings" },
  { label: "Transfer Ticket", to: "/bookings" },
];

export function Home() {
  const navigate = useNavigate();
  const { data: backendEvents, isLoading } = useListEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingIdx, setTrendingIdx] = useState(0);

  const allEvents: Event[] =
    backendEvents && backendEvents.length > 0 ? backendEvents : sampleEvents;
  const featuredEvents = allEvents.filter((e) => e.isFeatured).slice(0, 6);
  const upcomingEvents = [...allEvents]
    .sort((a, b) => Number(a.dateTime) - Number(b.dateTime))
    .slice(0, 4);
  const trendingEvents = [...allEvents].sort(
    (a, b) => Number(b.bookedSeats) - Number(a.bookedSeats),
  );

  const TRENDING_PAGE_SIZE = 4;
  const trendingPage = trendingEvents.slice(
    trendingIdx,
    trendingIdx + TRENDING_PAGE_SIZE,
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/events",
      search: { q: searchQuery.trim() || undefined, category: undefined },
    });
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl mx-6 mt-6 min-h-[420px] flex items-center">
        <img
          src="/assets/generated/hero-cinema-india.dim_1400x600.jpg"
          alt="Indian cinema"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-8 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold text-white leading-tight max-w-lg">
              Book Movie Tickets
              <br />
              Anywhere in India
            </h1>
            <p className="mt-3 text-base text-white/70 max-w-md">
              From Bollywood blockbusters to regional hits — find showtimes at
              multiplexes near you.
            </p>

            <form
              onSubmit={handleHeroSearch}
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies, theatres, cities..."
                  className="pl-10 h-11 bg-card/90 backdrop-blur-sm border-border text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-ocid="home.search_input"
                />
              </div>
              <Select>
                <SelectTrigger
                  className="h-11 w-full sm:w-40 bg-card/90 backdrop-blur-sm border-border"
                  data-ocid="home.select"
                >
                  <SelectValue placeholder="Any Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger
                  className="h-11 w-full sm:w-40 bg-card/90 backdrop-blur-sm border-border"
                  data-ocid="home.select"
                >
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="kolkata">Kolkata</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="h-11 px-6 bg-primary hover:bg-primary/90 font-semibold"
                data-ocid="home.primary_button"
              >
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 mt-10">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">
                  Now Showing
                </h2>
                <Link
                  to="/events"
                  search={{ q: undefined, category: undefined }}
                  className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
                  data-ocid="home.link"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
                    <Skeleton key={i} className="h-72 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  data-ocid="home.list"
                >
                  {featuredEvents.map((event, i) => (
                    <motion.div
                      key={event.id.toString()}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      data-ocid={`home.item.${i + 1}`}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Category Strip */}
            <section className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Browse by Genre
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.label}
                    to="/events"
                    search={{ category: cat.label, q: undefined }}
                    data-ocid="home.link"
                  >
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border bg-gradient-to-br ${cat.color} cursor-pointer transition-all`}
                    >
                      <cat.icon className="w-6 h-6" />
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Trending Movies */}
            <section className="mt-12 mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-foreground">
                  Trending Movies
                </h2>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full"
                    disabled={trendingIdx === 0}
                    onClick={() =>
                      setTrendingIdx(
                        Math.max(0, trendingIdx - TRENDING_PAGE_SIZE),
                      )
                    }
                    data-ocid="home.pagination_prev"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full"
                    disabled={
                      trendingIdx + TRENDING_PAGE_SIZE >= trendingEvents.length
                    }
                    onClick={() =>
                      setTrendingIdx(trendingIdx + TRENDING_PAGE_SIZE)
                    }
                    data-ocid="home.pagination_next"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                {trendingPage.map((event, i) => {
                  const date = formatDate(event.dateTime);
                  return (
                    <Link
                      key={event.id.toString()}
                      to="/events/$id"
                      params={{ id: event.id.toString() }}
                      data-ocid={`home.row.${i + 1}`}
                    >
                      <div
                        className={`flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors ${i < trendingPage.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <img
                          src={
                            event.imageUrl ||
                            `https://picsum.photos/seed/${event.id}/80/80`
                          }
                          alt={event.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {event.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {event.venue}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {date.full}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-extrabold text-foreground">
                            ₹{event.price.toFixed(0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.category}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:flex flex-col gap-5 w-72 shrink-0">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-bold text-foreground mb-4">
                Coming Soon Near You
              </h3>
              <div className="flex flex-col gap-3">
                {upcomingEvents.map((event) => {
                  const date = formatDate(event.dateTime);
                  return (
                    <Link
                      key={event.id.toString()}
                      to="/events/$id"
                      params={{ id: event.id.toString() }}
                    >
                      <div className="flex gap-3 group">
                        <img
                          src={
                            event.imageUrl ||
                            `https://picsum.photos/seed/${event.id}/80/80`
                          }
                          alt={event.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {event.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {date.full}
                          </p>
                          <p className="text-xs font-bold text-primary mt-0.5">
                            ₹{event.price.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link to="/events" search={{ q: undefined, category: undefined }}>
                <Button
                  className="w-full mt-4 h-9 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border-0"
                  variant="outline"
                  data-ocid="sidebar.button"
                >
                  View All Movies
                </Button>
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-bold text-foreground mb-4">
                Manage Your Bookings
              </h3>
              <div className="flex flex-col">
                {MANAGE_ITEMS.map((item, i) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    data-ocid={`sidebar.item.${i + 1}`}
                  >
                    <div
                      className={`flex items-center justify-between py-3 hover:text-primary transition-colors ${i < MANAGE_ITEMS.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <span className="text-sm text-muted-foreground hover:text-primary">
                        {item.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
