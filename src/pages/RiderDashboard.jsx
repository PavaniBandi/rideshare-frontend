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

  const token = localStorage.getItem('token');

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
  const handleBook = (ride) => {
    setCurrentRide(ride);
    fetchRides();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Rider Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!currentRide && (
            <div className="mb-8">
              <RideBookingForm onBook={handleBook} />
            </div>
          )}
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