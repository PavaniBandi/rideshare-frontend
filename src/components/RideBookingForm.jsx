import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api.jsx';

export default function RideBookingForm({ onBook }) {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [rideType, setRideType] = useState('Economy');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [fare, setFare] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Simple fare/time calculation
  const calculateFareAndTime = () => {
    if (pickup && drop) {
      const baseFare = 50;
      const typeMultiplier = rideType === 'XL' ? 2 : rideType === 'Premium' ? 1.5 : rideType === 'Comfort' ? 1.2 : 1;
      const fare = baseFare * typeMultiplier;
      setFare(fare);
      setEstimate('15-20 min');
    } else {
      setFare(null);
      setEstimate(null);
    }
  };

  useEffect(() => {
    calculateFareAndTime();
    // eslint-disable-next-line
  }, [pickup, drop, rideType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to book a ride.');
      return;
    }
    try {
      const ride = {
        pickupLocation: pickup,
        dropLocation: drop,
        fare,
        status: 'REQUESTED',
        rideType,
        paymentMode
      };
      const data = await apiRequest('/rides/book', 'POST', ride, token);
      setSuccess('Ride booked successfully!');
      onBook && onBook(data);
    } catch (err) {
      setError('Booking failed: ' + err.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold mb-1">Pickup Location</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={pickup} onChange={e => setPickup(e.target.value)} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Destination</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={drop} onChange={e => setDrop(e.target.value)} required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Ride Type</label>
        <select className="w-full border rounded px-3 py-2" value={rideType} onChange={e => setRideType(e.target.value)}>
          <option>Economy</option>
          <option>Comfort</option>
          <option>Premium</option>
          <option>XL</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Payment Mode</label>
        <select className="w-full border rounded px-3 py-2" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
          <option>Cash</option>
          <option>Online</option>
        </select>
      </div>
      {fare && (
        <div className="text-green-700">Estimated Fare: ₹{fare} | Time: {estimate}</div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700">
        Book Ride
      </button>
    </form>
  );
}