import { useState, useEffect } from 'react';
import RideBookingForm from '../components/RideBookingForm.jsx';
import RideStatus from '../components/RideStatus.jsx';
import RideHistory from '../components/RideHistory.jsx';
import { apiRequest } from '../api.jsx';

export default function RiderDashboard() {
  const [rides, setRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(true);

  // Form state lifted up
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [rideType, setRideType] = useState('Economy');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [fare, setFare] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  // Simple fare/time calculation
  const calculateFareAndTime = () => {
    if (pickup && drop) {
      const baseFare = 50;
      const typeMultiplier = rideType === 'XL' ? 2 : rideType === 'Premium' ? 1.5 : rideType === 'Comfort' ? 1.2 : 1;
      const fareVal = baseFare * typeMultiplier;
      setFare(fareVal);
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

  // Fetch ride history and current ride
  const fetchRides = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/rides/history', 'GET', null, token);
      setRides(data);
      // Find the most recent ride that is not COMPLETED
      const active = data.find(r => r.status !== 'COMPLETED');
      setCurrentRide(active || null);
      if (active) setShowBookingForm(false);
      else setShowBookingForm(true);
    } catch (err) {
      setError('Failed to fetch rides: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRides();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchRides, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Handler after booking a ride
  const handleBook = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    if (!token) {
      setFormError('You must be logged in to book a ride.');
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
      setCurrentRide(data);
      setShowBookingForm(false);
      fetchRides();
    } catch (err) {
      setFormError('Booking failed: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Rider Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={`mb-8 ${showBookingForm ? '' : 'hidden'}`}>
            <RideBookingForm
              pickup={pickup}
              setPickup={setPickup}
              drop={drop}
              setDrop={setDrop}
              rideType={rideType}
              setRideType={setRideType}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              fare={fare}
              estimate={estimate}
              error={formError}
              success={success}
              onBook={handleBook}
            />
          </div>
          {currentRide && (
            <div className="mb-8">
              <RideStatus ride={currentRide} />
            </div>
          )}
          <RideHistory rides={rides} />
        </>
      )}
    </div>
  );
} 