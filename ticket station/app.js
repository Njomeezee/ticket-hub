import { User, Event, Ticket, TicketSystem } from './models.js';

class TicketStationApp {
    constructor() {
        this.ticketSystem = new TicketSystem();
        this.initializeEvents();
    }

    initializeEvents() {
        // Sample events
        const event1 = new Event(1, "Summer Music Festival", "2024-07-15", "Central Park", "Annual music festival", [
            new Ticket(1, 1, "General Admission", 50),
            new Ticket(2, 1, "VIP", 100)
        ]);
        const event2 = new Event(2, "Tech Conference", "2024-09-05", "Convention Center", "Annual tech conference", [
            new Ticket(3, 2, "Standard", 200),
            new Ticket(4, 2, "Premium", 350)
        ]);
        this.ticketSystem.addEvent(event1);
        this.ticketSystem.addEvent(event2);
    }

    renderLoginForm() {
        return `
      <h2>Login</h2>
      <form id="loginForm">
        <input type="email" id="loginEmail" placeholder="Email" required>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="#" id="showRegister">Register</a></p>
    `;
    }

    renderRegisterForm() {
        return `
      <h2>Register</h2>
      <form id="registerForm">
        <input type="text" id="registerUsername" placeholder="Username" required>
        <input type="email" id="registerEmail" placeholder="Email" required>
        <input type="password" id="registerPassword" placeholder="Password" required>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
    `;
    }

    renderEventList() {
        const upcomingEvents = this.ticketSystem.getUpcomingEvents();
        const pastEvents = this.ticketSystem.getPastEvents();

        return `
      <h2>Upcoming Events</h2>
      <ul>
        ${upcomingEvents.map(event => `
          <li>
            <h3>${event.name}</h3>
            <p>Date: ${event.date.toLocaleDateString()}</p>
            <p>Venue: ${event.venue}</p>
            <button class="bookTicket" data-event-id="${event.id}">Book Tickets</button>
          </li>
        `).join('')}
      </ul>
      <h2>Past Events</h2>
      <ul>
        ${pastEvents.map(event => `
          <li>
            <h3>${event.name}</h3>
            <p>Date: ${event.date.toLocaleDateString()}</p>
            <p>Venue: ${event.venue}</p>
          </li>
        `).join('')}
      </ul>
    `;
    }

    renderTicketSelection(eventId) {
        const event = this.ticketSystem.events.find(e => e.id === eventId);
        if (!event) return '<p>Event not found</p>';

        const availableTickets = event.getAvailableTickets();

        return `
      <h2>Select Tickets for ${event.name}</h2>
      <p>Date: ${event.date.toLocaleDateString()}</p>
      <p>Venue: ${event.venue}</p>
      <form id="ticketSelectionForm">
        <input type="hidden" id="eventId" value="${event.id}">
        ${availableTickets.map(ticket => `
          <div>
            <input type="radio" name="ticketId" id="ticket${ticket.id}" value="${ticket.id}">
            <label for="ticket${ticket.id}">${ticket.type} - $${ticket.price}</label>
          </div>
        `).join('')}
        <button type="submit">Book Selected Ticket</button>
      </form>
    `;
    }

    renderConfirmation(ticket, event) {
        return `
      <h2>Booking Confirmation</h2>
      <p>Thank you for your booking!</p>
      <p>Event: ${event.name}</p>
      <p>Date: ${event.date.toLocaleDateString()}</p>
      <p>Venue: ${event.venue}</p>
      <p>Ticket Type: ${ticket.type}</p>
      <p>Price: $${ticket.price}</p>
      <button id="backToEvents">Back to Events</button>
    `;
    }

    renderSearchForm() {
        return `
      <form id="searchForm">
        <input type="text" id="searchQuery" placeholder="Search events...">
        <button type="submit">Search</button>
      </form>
    `;
    }

    renderUserInfo() {
        const user = this.ticketSystem.currentUser;
        return `
      <div id="userInfo">
        <p>Welcome, ${user.username}!</p>
        <button id="logoutButton">Logout</button>
      </div>
    `;
    }

    attachEventListeners() {
        const app = document.getElementById('app');

        app.addEventListener('submit', (e) => {
            e.preventDefault();
            if (e.target.id === 'loginForm') {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                if (this.ticketSystem.login(email, password)) {
                    this.render();
                } else {
                    alert('Invalid credentials');
                }
            } else if (e.target.id === 'registerForm') {
                const username = document.getElementById('registerUsername').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                this.ticketSystem.registerUser(username, email, password);
                this.render('login');
            } else if (e.target.id === 'ticketSelectionForm') {
                const eventId = parseInt(document.getElementById('eventId').value);
                const ticketId = parseInt(document.querySelector('input[name="ticketId"]:checked').value);
                try {
                    const ticket = this.ticketSystem.bookTicket(eventId, ticketId);
                    const event = this.ticketSystem.events.find(e => e.id === eventId);
                    app.innerHTML = this.renderConfirmation(ticket, event);
                } catch (error) {
                    alert(error.message);
                }
            } else if (e.target.id === 'searchForm') {
                const query = document.getElementById('searchQuery').value;
                const searchResults = this.ticketSystem.searchEvents(query);
                app.innerHTML = this.renderSearchResults(searchResults);
            }
        });

        app.addEventListener('click', (e) => {
            if (e.target.id === 'showRegister') {
                this.render('register');
            } else if (e.target.id === 'showLogin') {
                this.render('login');
            } else if (e.target.id === 'logoutButton') {
                this.ticketSystem.logout();
                this.render('login');
            } else if (e.target.id === 'backToEvents') {
                this.render();
            } else if (e.target.classList.contains('bookTicket')) {
                const eventId = parseInt(e.target.getAttribute('data-event-id'));
                app.innerHTML = this.renderTicketSelection(eventId);
            }
        });
    }

    renderSearchResults(events) {
        return `
      <h2>Search Results</h2>
      <ul>
        ${events.map(event => `
          <li>
            <h3>${event.name}</h3>
            <p>Date: ${event.date.toLocaleDateString()}</p>
            <p>Venue: ${event.venue}</p>
            <button class="bookTicket" data-event-id="${event.id}">Book Tickets</button>
          </li>
        `).join('')}
      </ul>
      <button id="backToEvents">Back to Events</button>
    `;
    }

    render(view = 'events') {
        const app = document.getElementById('app');
        let content = '';

        if (this.ticketSystem.currentUser) {
            content += this.renderUserInfo();
            content += this.renderSearchForm();
            if (view === 'events') {
                content += this.renderEventList();
            }
        } else {
            content = view === 'register' ? this.renderRegisterForm() : this.renderLoginForm();
        }

        app.innerHTML = content;
        this.attachEventListeners();
    }
}

// Initialize the application
const app = new TicketStationApp();
app.render();