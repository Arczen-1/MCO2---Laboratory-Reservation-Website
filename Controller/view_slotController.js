async function fetchReservedSeats() {
    const selectedDate = document.getElementById('reservation').value;

    if (!selectedDate) {
        console.error('Selected date cannot be empty.');
        return;
    }

    try {
        const response = await fetch(`/reserved-seats?date=${selectedDate}`);
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