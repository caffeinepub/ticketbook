import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Event = {
    id : Nat;
    name : Text;
    description : Text;
    dateTime : Int;
    venue : Text;
    totalSeats : Nat;
    bookedSeats : Nat;
    price : Float;
    category : Text;
    isFeatured : Bool;
    imageUrl : Text;
  };

  module Event {
    public func compareByName(event1 : Event, event2 : Event) : Order.Order {
      switch (Text.compare(event1.name, event2.name)) {
        case (#equal) { Int.compare(event1.dateTime, event2.dateTime) };
        case (order) { order };
      };
    };
  };

  type Booking = {
    id : Nat;
    eventId : Nat;
    userId : Principal;
    quantity : Nat;
    bookedAt : Int;
    status : Text;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Int.compare(booking1.bookedAt, booking2.bookedAt);
    };
  };

  let events = Map.empty<Nat, Event>();
  let bookings = Map.empty<Nat, Booking>();

  var nextEventId = 1;
  var nextBookingId = 1;

  public shared ({ caller }) func createEvent(event : Event) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    let eventId = nextEventId;
    nextEventId += 1;
    let newEvent : Event = {
      id = eventId;
      name = event.name;
      description = event.description;
      dateTime = event.dateTime;
      venue = event.venue;
      totalSeats = event.totalSeats;
      bookedSeats = 0;
      price = event.price;
      category = event.category;
      isFeatured = false;
      imageUrl = event.imageUrl;
    };
    events.add(eventId, newEvent);
    eventId;
  };

  public shared ({ caller }) func bookTickets(eventId : Nat, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book tickets");
    };
    if (quantity == 0) { Runtime.trap("Quantity must be at least 1") };
    let event = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
    if ((event.bookedSeats + quantity) > event.totalSeats) {
      Runtime.trap("Not enough seats available");
    };
    let bookingId = nextBookingId;
    nextBookingId += 1;
    let newBooking : Booking = {
      id = bookingId;
      eventId;
      userId = caller;
      quantity;
      bookedAt = Time.now();
      status = "active";
    };
    bookings.add(bookingId, newBooking);
    let updatedEvent : Event = {
      id = event.id;
      name = event.name;
      description = event.description;
      dateTime = event.dateTime;
      venue = event.venue;
      totalSeats = event.totalSeats;
      bookedSeats = event.bookedSeats + quantity;
      price = event.price;
      category = event.category;
      isFeatured = event.isFeatured;
      imageUrl = event.imageUrl;
    };
    events.add(eventId, updatedEvent);
    bookingId;
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their bookings");
    };
    bookings.values().toArray().filter(func(b) { b.userId == caller });
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    events.values().toArray().sort(Event.compareByName);
  };

  public query ({ caller }) func getEventById(eventId : Nat) : async Event {
    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  public shared ({ caller }) func cancelBooking(bookingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel bookings");
    };
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };
    if (booking.userId != caller) {
      Runtime.trap("Unauthorized: You can only cancel your own bookings");
    };
    if (booking.status == "cancelled") { Runtime.trap("Booking already cancelled") };
    let event = switch (events.get(booking.eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
    bookings.add(
      bookingId,
      {
        id = booking.id;
        eventId = booking.eventId;
        userId = booking.userId;
        quantity = booking.quantity;
        bookedAt = booking.bookedAt;
        status = "cancelled";
      },
    );
    events.add(
      booking.eventId,
      {
        id = event.id;
        name = event.name;
        description = event.description;
        dateTime = event.dateTime;
        venue = event.venue;
        totalSeats = event.totalSeats;
        bookedSeats = event.bookedSeats - booking.quantity;
        price = event.price;
        category = event.category;
        isFeatured = event.isFeatured;
        imageUrl = event.imageUrl;
      },
    );
  };

  public shared ({ caller }) func markEventAsFeatured(eventId : Nat, isFeatured : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark events as featured");
    };
    let event = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
    events.add(
      eventId,
      {
        id = event.id;
        name = event.name;
        description = event.description;
        dateTime = event.dateTime;
        venue = event.venue;
        totalSeats = event.totalSeats;
        bookedSeats = event.bookedSeats;
        price = event.price;
        category = event.category;
        isFeatured;
        imageUrl = event.imageUrl;
      },
    );
  };
};
