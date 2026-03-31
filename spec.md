# TicketBook - Indian Movie Ticket Booking

## Current State
A generic event ticket booking app with US-centric sample data (concerts, marathons, sports), USD pricing, US venues, and categories like Music/Sports/Arts/Family/Festivals.

## Requested Changes (Diff)

### Add
- Indian movie categories: Bollywood, South Indian, Hindi, Tamil, Telugu, Action, Drama, Comedy, Romance, Thriller
- INR (₹) currency formatting throughout
- Indian multiplex venues: PVR, INOX, Cinepolis, Miraj, Carnival Cinemas across major Indian cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune)
- Sample Indian movies (current + upcoming Bollywood/regional hits) with Indian context
- Language filter for movies (Hindi, Tamil, Telugu, Malayalam, Kannada)
- Seat class options: Gold, Diamond, Platinum (common Indian multiplex categories)

### Modify
- sampleEvents.ts: Replace all US events with Indian movie listings
- Home.tsx: Update hero text for Indian movie context, categories to movie genres, location dropdown with Indian cities
- EventCard.tsx: Show movie language badge, format price in ₹
- EventDetail.tsx: Movie-specific details (language, genre, duration, cast), seat class selection
- Events.tsx: Update filter categories to movie genres and languages
- Navbar.tsx: Update branding to CineBook India or keep TicketBook
- Footer.tsx: Update to Indian context
- All currency displays: USD → INR (₹)

### Remove
- US city location options from search
- Non-movie categories (Music, Sports, Arts, Family, Festivals)

## Implementation Plan
1. Update sampleEvents.ts with 8+ Indian movies across genres and cities
2. Update currency formatting helpers to use INR (₹)
3. Update Home.tsx hero section with Indian cities, movie genre categories
4. Update EventCard.tsx for movie context (language, ₹ pricing)
5. Update EventDetail.tsx for movie booking (language, seat class, duration)
6. Update Events.tsx with movie genre/language filters
7. Update Navbar/Footer for Indian movie booking context
8. Generate new hero image for Indian cinema theme
