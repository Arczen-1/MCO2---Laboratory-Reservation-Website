async function removeSeat(seat) {
    const selectedDate = document.getElementById('reservation').value;

    try {
        const response = await fetch('/remove-seat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seat, selectedDate }),
        });

        const data = await response.json();
    

        console.log('Remove Seat Request:', JSON.stringify({ seat, selectedDate }));
        console.log('Remove Seat Response:', data);

        if (response.ok) {
        alert(data.message);
        document.querySelector(`[data-seat="${seat}"]`).classList.remove('taken');
       
        } else {
        console.error('Error removing seat reservation:', data.error);
        alert('Error removing seat reservation. Please try again.');
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
async function fetchReservedSeats() {
    const selectedDate = document.getElementById('reservation').value;
    const room = "GK302B";
    
    

    
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

