import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Event } from "../backend.d";
import { sampleEvents } from "../data/sampleEvents";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useBookTickets, useGetEvent } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  const d = new Date(Number(ts));
  return {
    full: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export function EventDetail() {
  const { id } = useParams({ from: "/events/$id" });
  const { data: backendEvent, isLoading } = useGetEvent(BigInt(id));
  const { identity, login } = useInternetIdentity();
  const bookTickets = useBookTickets();
  const [quantity, setQuantity] = useState(1);
  const [booked, setBooked] = useState(false);

  const event: Event | undefined =
    backendEvent || sampleEvents.find((e) => e.id.toString() === id);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Skeleton
          className="h-96 rounded-2xl"
          data-ocid="event_detail.loading_state"
        />
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-6 py-20 text-center"
        data-ocid="event_detail.error_state"
      >
        <p className="text-muted-foreground text-xl">Event not found.</p>
        <Link to="/events" search={{ q: undefined, category: undefined }}>
          <Button className="mt-4" data-ocid="event_detail.secondary_button">
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const date = formatDate(event.dateTime);
  const availableSeats = Number(event.totalSeats) - Number(event.bookedSeats);
  const soldOut = availableSeats <= 0;
  const maxQty = Math.min(availableSeats, 10);

  const handleBook = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      await bookTickets.mutateAsync({
        eventId: event.id,
        quantity: BigInt(quantity),
      });
      setBooked(true);
      toast.success(
        `Successfully booked ${quantity} ticket${quantity > 1 ? "s" : ""}!`,
      );
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  const subtotal = event.price * quantity;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <Link
        to="/events"
        search={{ q: undefined, category: undefined }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="event_detail.link"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative rounded-2xl overflow-hidden h-72 lg:h-96">
              <img
                src={
                  event.imageUrl ||
                  `https://picsum.photos/seed/${event.id}/1200/600`
                }
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-card/90 backdrop-blur-sm text-foreground border-border text-xs">
                  {event.category}
                </Badge>
              </div>
              {event.isFeatured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary/90 text-primary-foreground text-xs">
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground leading-snug">
                {event.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {date.full} · {date.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span
                    className={
                      soldOut
                        ? "text-destructive font-medium"
                        : availableSeats < 100
                          ? "text-yellow-400 font-medium"
                          : "text-muted-foreground"
                    }
                  >
                    {soldOut
                      ? "Sold out"
                      : `${availableSeats.toLocaleString()} seats available`}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-base font-semibold text-foreground mb-3">
                About This Movie
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
            <AnimatePresence mode="wait">
              {booked ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                  data-ocid="booking.success_state"
                >
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {quantity} ticket{quantity > 1 ? "s" : ""} for
                  </p>
                  <p className="text-sm font-semibold text-foreground mb-4">
                    {event.name}
                  </p>
                  <Link to="/bookings">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      data-ocid="booking.primary_button"
                    >
                      View My Bookings
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-foreground">
                      ₹{event.price.toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      / ticket
                    </span>
                  </div>

                  <Separator className="mb-4" />

                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-medium text-foreground">
                      Number of Tickets
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-lg"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        data-ocid="booking.secondary_button"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span
                        className="w-8 text-center font-bold text-foreground text-sm"
                        data-ocid="booking.panel"
                      >
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-lg"
                        disabled={quantity >= maxQty}
                        onClick={() =>
                          setQuantity((q) => Math.min(maxQty, q + 1))
                        }
                        data-ocid="booking.secondary_button"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 mb-5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ₹{event.price.toFixed(0)} × {quantity}
                      </span>
                      <span className="text-foreground">
                        ₹{subtotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Convenience fee
                      </span>
                      <span className="text-foreground">
                        ₹{serviceFee.toFixed(0)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">
                        ₹{total.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={soldOut || bookTickets.isPending}
                    onClick={handleBook}
                    data-ocid="booking.primary_button"
                  >
                    {bookTickets.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : soldOut ? (
                      "Sold Out"
                    ) : !identity ? (
                      "Sign In to Book"
                    ) : (
                      "Book Now"
                    )}
                  </Button>

                  {!identity && (
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      You need to sign in to complete your booking.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
