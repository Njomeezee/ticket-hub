// User class
class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bookedTickets = [];
    }

    bookTicket(ticket) {
        this.bookedTickets.push(ticket);
    }
}

// Event class
class Event {
    constructor(id, name, date, venue, description, tickets) {
        this.id = id;
        this.name = name;
        this.date = new Date(date);
        this.venue = venue;
        this.description = description;
        this.tickets = tickets;
    }

    getAvailableTickets() {
        return this.tickets.filter(ticket => !ticket.isBooked);
    }
}

// Ticket class
class Ticket {
    constructor(id, eventId, type, price) {
        this.id = id;
        this.eventId = eventId;
        this.type = type;
        this.price = price;
        this.isBooked = false;
    }

    book() {
        this.isBooked = true;
    }
}

// TicketSystem class to manage events and users
class TicketSystem {
    constructor() {
        this.events = [];
        this.users = [];
        this.currentUser = null;
    }

    addEvent(event) {
        this.events.push(event);
    }

    registerUser(username, email, password) {
        const id = this.users.length + 1;
        const user = new User(id, username, email, password);
        this.users.push(user);
        return user;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
    }

    getUpcomingEvents() {
        const now = new Date();
        return this.events
            .filter(event => event.date > now)
            .sort((a, b) => a.date - b.date);
    }

    getPastEvents() {
        const now = new Date();
        return this.events
            .filter(event => event.date <= now)
            .sort((a, b) => b.date - a.date);
    }

    searchEvents(query) {
        return this.events.filter(event =>
            event.name.toLowerCase().includes(query.toLowerCase()) ||
            event.venue.toLowerCase().includes(query.toLowerCase())
        );
    }

    bookTicket(eventId, ticketId) {
        if (!this.currentUser) {
            throw new Error("User must be logged in to book a ticket");
        }
        const event = this.events.find(e => e.id === eventId);
        if (!event) {
            throw new Error("Event not found");
        }
        const ticket = event.tickets.find(t => t.id === ticketId);
        if (!ticket || ticket.isBooked) {
            throw new Error("Ticket not available");
        }
        ticket.book();
        this.currentUser.bookTicket(ticket);
        return ticket;
    }
}

// Export the classes
export { User, Event, Ticket, TicketSystem };