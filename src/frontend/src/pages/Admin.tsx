import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Plus,
  RefreshCw,
  ShieldAlert,
  Star,
  StarOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Event } from "../backend.d";
import { sampleEvents } from "../data/sampleEvents";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllBookings,
  useCreateEvent,
  useIsAdmin,
  useListEvents,
  useSetFeatured,
} from "../hooks/useQueries";

const CATEGORIES = ["Music", "Sports", "Arts", "Family", "Festivals"];

const defaultForm = {
  name: "",
  description: "",
  venue: "",
  category: "Music",
  price: "",
  dateTime: "",
  totalSeats: "",
  imageUrl: "",
};

export function Admin() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const {
    data: allBookings,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useAllBookings();
  const { data: backendEvents, isLoading: eventsLoading } = useListEvents();
  const createEvent = useCreateEvent();
  const setFeatured = useSetFeatured();
  const [form, setForm] = useState(defaultForm);
  const [tab, setTab] = useState("create");

  const allEvents: Event[] =
    backendEvents && backendEvents.length > 0 ? backendEvents : sampleEvents;

  if (!identity) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-6 py-24 text-center"
        data-ocid="admin.panel"
      >
        <ShieldAlert className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-50" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Authentication Required
        </h2>
        <p className="text-muted-foreground mb-8">
          Please sign in to access the admin panel.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={login}
          data-ocid="admin.primary_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-64 rounded-xl" data-ocid="admin.loading_state" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="max-w-[1200px] mx-auto px-6 py-24 text-center"
        data-ocid="admin.error_state"
      >
        <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-5 opacity-70" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Access Denied
        </h2>
        <p className="text-muted-foreground mb-8">
          You don't have admin privileges to access this page.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          data-ocid="admin.secondary_button"
        >
          Go Home
        </Button>
      </div>
    );
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.venue ||
      !form.price ||
      !form.dateTime ||
      !form.totalSeats
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const event: Event = {
      id: BigInt(0),
      name: form.name,
      description: form.description,
      venue: form.venue,
      category: form.category,
      price: Number.parseFloat(form.price),
      dateTime: BigInt(new Date(form.dateTime).getTime()),
      totalSeats: BigInt(Number.parseInt(form.totalSeats)),
      bookedSeats: BigInt(0),
      imageUrl: form.imageUrl,
      isFeatured: false,
    };
    try {
      await createEvent.mutateAsync(event);
      toast.success("Event created successfully!");
      setForm(defaultForm);
      setTab("events");
    } catch {
      toast.error("Failed to create event.");
    }
  };

  const handleToggleFeatured = async (event: Event) => {
    try {
      await setFeatured.mutateAsync({
        eventId: event.id,
        featured: !event.isFeatured,
      });
      toast.success(
        `Event ${event.isFeatured ? "unfeatured" : "featured"} successfully.`,
      );
    } catch {
      toast.error("Failed to update event.");
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage events and view all bookings.
          </p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
          Admin Access
        </Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card border border-border mb-8 h-auto p-1">
          <TabsTrigger
            value="create"
            className="text-xs font-semibold px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.tab"
          >
            Create Event
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-xs font-semibold px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.tab"
          >
            Manage Events
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="text-xs font-semibold px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.tab"
          >
            All Bookings
          </TabsTrigger>
        </TabsList>

        {/* Create Event */}
        <TabsContent value="create">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-2xl border border-border bg-card p-8 max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> New Event
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Event Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Rock Night Live"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="bg-accent border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the event..."
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      className="bg-accent border-border resize-none"
                      data-ocid="admin.textarea"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="venue"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Venue *
                    </Label>
                    <Input
                      id="venue"
                      placeholder="Venue name and city"
                      value={form.venue}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, venue: e.target.value }))
                      }
                      className="bg-accent border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Category *
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, category: v }))
                      }
                    >
                      <SelectTrigger
                        className="bg-accent border-border"
                        data-ocid="admin.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="price"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Ticket Price ($) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 99.99"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className="bg-accent border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="totalSeats"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Total Seats *
                    </Label>
                    <Input
                      id="totalSeats"
                      type="number"
                      min="1"
                      placeholder="e.g. 1000"
                      value={form.totalSeats}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, totalSeats: e.target.value }))
                      }
                      className="bg-accent border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="dateTime"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Date & Time *
                    </Label>
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      value={form.dateTime}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, dateTime: e.target.value }))
                      }
                      className="bg-accent border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="imageUrl"
                      className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                    >
                      Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://..."
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, imageUrl: e.target.value }))
                      }
                      className="bg-accent border-border"
                      data-ocid="admin.input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold"
                  disabled={createEvent.isPending}
                  data-ocid="admin.submit_button"
                >
                  {createEvent.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </TabsContent>

        {/* Manage Events */}
        <TabsContent value="events">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {eventsLoading ? (
              <Skeleton
                className="h-64 rounded-xl"
                data-ocid="admin.loading_state"
              />
            ) : (
              <div className="rounded-2xl border border-border overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Event
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Category
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Seats
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Price
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Featured
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEvents.map((event, i) => (
                      <TableRow
                        key={event.id.toString()}
                        className="border-border"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell>
                          <p className="font-semibold text-sm text-foreground">
                            {event.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.venue}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {Number(event.bookedSeats)}/{Number(event.totalSeats)}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">
                          ${event.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 w-7 p-0 ${event.isFeatured ? "text-yellow-400" : "text-muted-foreground"}`}
                            onClick={() => handleToggleFeatured(event)}
                            data-ocid={`admin.toggle.${i + 1}`}
                          >
                            {event.isFeatured ? (
                              <Star className="w-4 h-4 fill-current" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* All Bookings */}
        <TabsContent value="bookings">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchBookings()}
                className="text-xs"
                data-ocid="admin.secondary_button"
              >
                <RefreshCw className="w-3 h-3 mr-1.5" /> Refresh
              </Button>
            </div>
            {bookingsLoading ? (
              <Skeleton
                className="h-64 rounded-xl"
                data-ocid="admin.loading_state"
              />
            ) : !allBookings || allBookings.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl border border-border"
                data-ocid="admin.empty_state"
              >
                <p className="text-muted-foreground">No bookings yet.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Booking ID
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Event
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        User
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Qty
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground font-semibold">
                        Booked At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allBookings.map((booking, i) => {
                      const event = allEvents.find(
                        (e) => e.id === booking.eventId,
                      );
                      return (
                        <TableRow
                          key={booking.id.toString()}
                          className="border-border"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell className="text-xs text-muted-foreground">
                            #{booking.id.toString()}
                          </TableCell>
                          <TableCell className="text-sm text-foreground font-medium">
                            {event?.name ||
                              `Event #${booking.eventId.toString()}`}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            {booking.userId.toString().slice(0, 12)}...
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {Number(booking.quantity)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`text-xs ${booking.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : ""}`}
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(
                              Number(booking.bookedAt),
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
