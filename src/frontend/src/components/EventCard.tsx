import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Event } from "../backend.d";

function formatDate(ts: bigint) {
  const d = new Date(Number(ts));
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Action: "bg-red-500/20 text-red-400 border-red-500/30",
  Drama: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Comedy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Thriller: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Romance: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Sci-Fi": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Bollywood: "bg-primary/20 text-primary border-primary/30",
  "South Indian": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function EventCard({ event }: { event: Event }) {
  const date = formatDate(event.dateTime);
  const availableSeats = Number(event.totalSeats) - Number(event.bookedSeats);
  const soldOut = availableSeats <= 0;
  const catColor =
    CATEGORY_COLORS[event.category] ||
    "bg-muted text-muted-foreground border-border";

  return (
    <div className="group rounded-xl overflow-hidden bg-card border border-border card-hover flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={
            event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`
          }
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center min-w-[44px] border border-border/50">
          <div className="text-xl font-extrabold leading-none text-foreground">
            {date.day}
          </div>
          <div className="text-[10px] font-bold text-primary mt-0.5">
            {date.month}
          </div>
        </div>
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold ${catColor}`}
          >
            {event.category}
          </Badge>
        </div>
        {soldOut && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge
              variant="destructive"
              className="text-sm font-bold px-4 py-1"
            >
              SOLD OUT
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
          {event.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 shrink-0" />
          <span>
            {date.full} · {date.time}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3 h-3 shrink-0" />
          <span
            className={
              soldOut
                ? "text-destructive font-medium"
                : availableSeats < 100
                  ? "text-yellow-400 font-medium"
                  : ""
            }
          >
            {soldOut
              ? "Sold out"
              : `${availableSeats.toLocaleString()} seats left`}
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="text-base font-extrabold text-foreground">
              ₹{event.price.toFixed(0)}
            </div>
          </div>
          <Link to="/events/$id" params={{ id: event.id.toString() }}>
            <Button
              size="sm"
              disabled={soldOut}
              className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              data-ocid="events.primary_button"
            >
              View Tickets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
