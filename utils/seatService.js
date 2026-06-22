const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateSeatNumbers(totalSeats) {
  const seats = [];
  let index = 0;

  while (seats.length < totalSeats) {
    const row = alphabet[Math.floor(index / 4) % alphabet.length];
    const column = (index % 4) + 1;
    seats.push(`${row}${column}`);
    index += 1;
  }

  return seats;
}

function createSeatMap(totalSeats) {
  return generateSeatNumbers(totalSeats).map((seatNumber) => ({
    seatNumber,
    isBooked: false,
    bookedBy: null,
    bookedAt: null
  }));
}

function getAvailableSeatNumbers(seatMap) {
  return seatMap.filter((seat) => !seat.isBooked).map((seat) => seat.seatNumber);
}

function reserveSeat(seatMap, seatNumber, userId) {
  const seat = seatMap.find((item) => item.seatNumber === seatNumber);

  if (!seat) {
    throw new Error('Seat not found');
  }

  if (seat.isBooked) {
    throw new Error('Seat already booked');
  }

  seat.isBooked = true;
  seat.bookedBy = userId;
  seat.bookedAt = new Date();
}

function releaseSeat(seatMap, seatNumber) {
  const seat = seatMap.find((item) => item.seatNumber === seatNumber);

  if (!seat) {
    throw new Error('Seat not found');
  }

  seat.isBooked = false;
  seat.bookedBy = null;
  seat.bookedAt = null;
}

module.exports = {
  createSeatMap,
  getAvailableSeatNumbers,
  reserveSeat,
  releaseSeat
};
