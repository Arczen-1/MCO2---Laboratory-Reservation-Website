
async function fetchReservedSeats() {
    const selectedDate = document.getElementById('date').value; 
    const room = document.getElementById('class').value;

        if (!selectedDate) {
                console.error('Selected date cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`/reserved-seats?date=${selectedDate}&room=${room}`);
            const data = await response.json();

            // Reset styles for all seats
                document.querySelectorAll('.seat').forEach(seatElement => {
                seatElement.classList.remove('taken');
            });
            
            // Mark seats as reserved based on data from the server
            data.reservedSeats.forEach(seat => {
            const seatElement = document.querySelector(`[data-seat="${seat}"]`);

                if (seatElement) {
                    seatElement.classList.add('taken');
                }

            });

        } catch (error) {
            console.error('Error fetching reserved seats:', error);
        }
        }
                    
async function addReservation() {
    const selectedDate = document.getElementById('date').value;
    const seat = document.getElementById('seat').value;
    const name = document.getElementById('nameinp').value;
    const room = document.getElementById('class').value;
    
    if (!selectedDate || !seat || !name) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('/reserve-seat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seat, selectedDate, name, room}),
        });

        if (response.ok) {
            alert('Reservation added successfully.');
            fetchReservedSeats();
        } else {
            const errorMessage = await response.json();
            alert(`Error adding reservation: ${errorMessage.message}`);
        }
    } catch (error) {
        console.error('Error adding reservation:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

async function removeReservation() {
    const selectedDate = document.getElementById('date').value;
    const seat = document.getElementById('seat').value;

    // Check for valid input
    if (!selectedDate || !seat) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('/remove-seat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seat, selectedDate }),
        });

        if (response.ok) {
            alert('Reservation removed successfully.');
            fetchReservedSeats();
        } else {
            const errorMessage = await response.json();
            alert(`Error removing reservation: ${errorMessage.message}`);
        }
    } catch (error) {
        console.error('Error removing reservation:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
    document.addEventListener('DOMContentLoaded', fetchReservedSeats);