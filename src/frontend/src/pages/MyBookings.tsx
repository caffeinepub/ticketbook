import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Calendar, Loader2, MapPin, Ticket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Event } from "../backend.d";
import { sampleEvents } from "../data/sampleEvents";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCancelBooking,
  useListEvents,
  useMyBookings,
} from "../hooks/useQueries";

function formatDate(ts: bigint) {
  const d = new Date(Number(ts));
  return `${d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function formatBookedAt(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MyBookings() {
  const { identity, login } = useInternetIdentity();
  const { data: bookings, isLoading } = useMyBookings();
  const { data: backendEvents } = useListEvents();
  const cancelBooking = useCancelBooking();
  const [cancelId, setCancelId] = useState<bigint | null>(null);

  const allEvents: Event[] =
    backendEvents && backendEvents.length > 0 ? backendEvents : sampleEvents;
  const getEvent = (eventId: bigint) => allEvents.find((e) => e.id === eventId);

  if (!identity) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-6 py-24 text-center"
        data-ocid="bookings.panel"
      >
        <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-50" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Sign In to View Bookings
        </h2>
        <p className="text-muted-foreground mb-8">
          Please sign in to access your ticket bookings.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={login}
          data-ocid="bookings.primary_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelBooking.mutateAsync(cancelId);
      toast.success("Booking cancelled successfully.");
    } catch {
      toast.error("Failed to cancel booking.");
    } finally {
      setCancelId(null);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-foreground mb-2">
        My Bookings
      </h1>
      <p className="text-muted-foreground mb-8">
        Manage all your ticket bookings in one place.
      </p>

      {isLoading ? (
        <div className="space-y-4" data-ocid="bookings.loading_state">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border border-border bg-card"
          data-ocid="bookings.empty_state"
        >
          <Ticket className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No bookings yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            You haven't booked any tickets yet. Explore events to get started!
          </p>
          <Link to="/events" search={{ q: undefined, category: undefined }}>
            <Button
              className="bg-primary hover:bg-primary/90"
              data-ocid="bookings.primary_button"
            >
              Browse Events
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {bookings.map((booking, i) => {
              const event = getEvent(booking.eventId);
              return (
                <motion.div
                  key={booking.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                  data-ocid={`bookings.item.${i + 1}`}
                >
                  <div className="flex flex-col sm:flex-row">
                    {event?.imageUrl && (
                      <div className="sm:w-48 h-40 sm:h-auto shrink-0">
                        <img
                          src={event.imageUrl}
                          alt={event?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-5 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {event?.name ||
                              `Event #${booking.eventId.toString()}`}
                          </h3>
                          <Badge
                            variant={
                              booking.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={`mt-1 text-xs ${booking.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground"}`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-extrabold text-foreground">
                            {Number(booking.quantity)} ticket
                            {Number(booking.quantity) > 1 ? "s" : ""}
                          </div>
                          {event && (
                            <div className="text-sm text-primary font-semibold">
                              $
                              {(event.price * Number(booking.quantity)).toFixed(
                                2,
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {event && (
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(event.dateTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.venue}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Booked on {formatBookedAt(booking.bookedAt)}
                      </div>

                      {booking.status === "active" && (
                        <div className="flex gap-2 mt-2">
                          {event && (
                            <Link
                              to="/events/$id"
                              params={{ id: booking.eventId.toString() }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                data-ocid={`bookings.secondary_button.${i + 1}`}
                              >
                                View Event
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => setCancelId(booking.id)}
                            data-ocid={`bookings.delete_button.${i + 1}`}
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AlertDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
      >
        <AlertDialogContent data-ocid="bookings.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Cancel Booking
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="bookings.cancel_button">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleCancel}
              disabled={cancelBooking.isPending}
              data-ocid="bookings.confirm_button"
            >
              {cancelBooking.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
