async function reserveSeat(seat) {
    const selectedDate = document.getElementById('reservation').value;
    const name = document.getElementById('name').value;
    const isAnonymous = document.getElementById('anonymous').checked;
    const room = "GK302B";

        if (!selectedDate) {
            alert('Please select a date and time before reserving a seat.');
            return;
        }

        if (!isAnonymous && name === "Type your name here..." || !isAnonymous && !name.trim()) {
            alert('Please enter your name for the reservation.');
            return;
        }

    try {
        const response = await fetch('/reserve-seat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: isAnonymous ? null : name, seat, selectedDate, isAnonymous, room}),
        });

            if (!response.ok) {
                const errorMessage = await response.json();
                alert(`Error: ${errorMessage.error}`);
                return;
            }

        const data = await response.json();
        console.log('Reservation Response:', data);

        
        const successMessage = isAnonymous
        ? `You successfully reserved a seat on ${selectedDate}.`
        : `${name} successfully reserved a seat on ${selectedDate}.`;

        alert(successMessage);

        document.querySelector(`[data-seat="${seat}"]`).classList.toggle('taken');

        
        fetchReservedSeats();
    } catch (error) {
        console.error('Error reserving seat:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

async function fetchReservedSeats() {
    const selectedDate = document.getElementById('reservation').value;
    const room = ("GK302B");

    if (!selectedDate) {
        console.error('Selected date cannot be empty.');
        return;
    }

    try {
        const response = await fetch(`/reserved-seats?date=${selectedDate}&room=${room}`);
        const data = await response.json();

       
        document.querySelectorAll('.seat').forEach(seatElement => {
        seatElement.classList.remove('taken');
        });
        
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
    document.addEventListener('DOMContentLoaded', fetchReservedSeats);
