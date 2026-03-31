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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Event } from "../backend.d";
import { EventCard } from "../components/EventCard";
import { sampleEvents } from "../data/sampleEvents";
import { useListEvents } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Romance",
  "Sci-Fi",
];

export function Events() {
  const searchParams = useSearch({ from: "/events" }) as {
    q?: string;
    category?: string;
  };
  const [query, setQuery] = useState(searchParams.q || "");
  const [category, setCategory] = useState(searchParams.category || "All");
  const [sortBy, setSortBy] = useState("date");

  const { data: backendEvents, isLoading } = useListEvents();
  const allEvents: Event[] =
    backendEvents && backendEvents.length > 0 ? backendEvents : sampleEvents;

  const filtered = useMemo(() => {
    let result = [...allEvents];
    if (category !== "All")
      result = result.filter((e) => e.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q),
      );
    }
    if (sortBy === "date")
      result.sort((a, b) => Number(a.dateTime) - Number(b.dateTime));
    else if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular")
      result.sort((a, b) => Number(b.bookedSeats) - Number(a.bookedSeats));
    return result;
  }, [allEvents, category, query, sortBy]);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-foreground mb-2">
        Now Showing &amp; Coming Soon
      </h1>
      <p className="text-muted-foreground mb-8">
        Book tickets for the latest Bollywood &amp; regional blockbusters
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search movies, theatres, cities..."
            className="pl-10 bg-card border-border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-ocid="events.search_input"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger
            className="w-full sm:w-44 bg-card border-border"
            data-ocid="events.select"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Upcoming First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={category} onValueChange={setCategory} className="mb-8">
        <TabsList className="bg-card border border-border h-auto p-1 flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="events.tab"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <Skeleton
              key={k}
              className="h-72 rounded-xl"
              data-ocid="events.loading_state"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" data-ocid="events.empty_state">
          <p className="text-muted-foreground text-lg">No movies found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            data-ocid="events.secondary_button"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-ocid="events.list"
        >
          {filtered.map((event, i) => (
            <motion.div
              key={event.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              data-ocid={`events.item.${i + 1}`}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
