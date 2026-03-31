import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: string;
    eventId: bigint;
    bookedAt: bigint;
    userId: Principal;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Event {
    id: bigint;
    venue: string;
    name: string;
    description: string;
    totalSeats: bigint;
    imageUrl: string;
    bookedSeats: bigint;
    isFeatured: boolean;
    category: string;
    price: number;
    dateTime: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookTickets(eventId: bigint, quantity: bigint): Promise<bigint>;
    cancelBooking(bookingId: bigint): Promise<void>;
    createEvent(event: Event): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllEvents(): Promise<Array<Event>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventById(eventId: bigint): Promise<Event>;
    getMyBookings(): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markEventAsFeatured(eventId: bigint, isFeatured: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
