const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Dummy database to store rooms and bookings
let rooms = [];
let bookings = [];

// Endpoint to create a room
app.post('/rooms/create', (req, res) => {
    const { room_name, seats_available, amenities, price_per_hour } = req.body;
    const room = {
        id: rooms.length + 1,
        room_name,
        seats_available,
        amenities,
        price_per_hour
    };
    rooms.push(room);
    res.status(201).json({ message: 'Room created successfully', room });
});

// Endpoint to book a room
app.post('/bookings/create', (req, res) => {
    const { customer_name, date, start_time, end_time, room_id } = req.body;
    const booking = {
        id: bookings.length + 1,
        customer_name,
        date,
        start_time,
        end_time,
        room_id
    };
    bookings.push(booking);
    res.status(201).json({ message: 'Booking created successfully', booking });
});

// Endpoint to list all rooms with booked data
app.get('/rooms/list', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const bookingsForRoom = bookings.filter(booking => booking.room_id === room.id);
        return {
            ...room,
            bookings: bookingsForRoom
        };
    });
    res.json(roomsWithBookings);
});

// Endpoint to list all customers with booked data
app.get('/customers/list', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const room = rooms.find(room => room.id === booking.room_id);
        return {
            customer_name: booking.customer_name,
            room_name: room.room_name,
            date: booking.date,
            start_time: booking.start_time,
            end_time: booking.end_time
        };
    });
    res.json(customersWithBookings);
});

// Endpoint to list booking history of a customer
app.get('/customers/:customer_name/bookings', (req, res) => {
    const customerName = req.params.customer_name;
    const customerBookings = bookings.filter(booking => booking.customer_name === customerName);
    res.json(customerBookings);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
