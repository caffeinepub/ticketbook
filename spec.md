# CineBook - Indian Movie Ticket Booking

## Current State
Fully wired app: Motoko backend with events/bookings/admin APIs, React frontend using backend hooks with sampleEvents as fallback. Backend has authorization, createEvent, bookTickets, cancelBooking, getAllEvents, getMyBookings, getAllBookings, markEventAsFeatured.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Admin form: replace generic categories [Music, Sports, Arts, Family, Festivals] with movie genres [Action, Drama, Comedy, Sci-Fi, Thriller, Romance, Bollywood, Regional]
- Admin form: change price label from "$" to "₹"
- Admin form: seed data button to populate backend with sample Indian movies on first login

### Remove
- Nothing

## Implementation Plan
1. Fix Admin.tsx CATEGORIES array to use movie genres
2. Fix price label to show ₹
3. Add a "Seed Sample Data" button in admin that calls createEvent for sampleEvents when backend is empty
4. Validate and deploy
