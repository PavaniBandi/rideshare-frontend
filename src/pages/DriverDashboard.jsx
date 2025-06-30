import { useState, useEffect } from 'react';
import RideHistory from '../components/RideHistory.jsx';
import { apiRequest } from '../api.jsx';

export default function DriverDashboard() {
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem('token');
  const myName = localStorage.getItem('name');
  const myUserId = localStorage.getItem('userId');

  // Fetch all non-completed rides and ride history
  const fetchRides = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all non-completed rides
      const active = await apiRequest('/rides/requested', 'GET', null, token);
      setActiveRides(active);
      // Fetch ride history for this driver
      const all = await apiRequest('/rides/history', 'GET', null, token);
      setHistory(all.filter(r => r.driverId && myUserId && r.driverId.toString() === myUserId));
    } catch (err) {
      setError('Failed to fetch rides: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRides();
    const interval = setInterval(fetchRides, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Handler to update ride status
  const updateStatus = async (rideId, status) => {
    try {
      await apiRequest(`/rides/status/${rideId}`, 'POST', { status }, token);
      fetchRides();
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  // Handler to accept a ride (assign self as driver)
  const acceptRide = async (ride) => {
    try {
      // Assign driverId to this driver (simulate by updating status to ACCEPTED)
      await apiRequest(`/rides/status/${ride.id}`, 'POST', { status: 'ACCEPTED', driverId: myUserId }, token);
      fetchRides();
    } catch (err) {
      setError('Failed to accept ride: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Active Rides</h2>
          {activeRides.length === 0 ? (
            <div>No active rides at the moment.</div>
          ) : (
            <div className="space-y-4 mb-8">
              {activeRides.map(ride => (
                <div key={ride.id} className="bg-white rounded-xl shadow-md p-6">
                  <div>Pickup: <span className="font-semibold">{ride.pickupLocation}</span></div>
                  <div>Drop: <span className="font-semibold">{ride.dropLocation}</span></div>
                  <div>Fare: <span className="font-semibold">₹{ride.fare}</span></div>
                  <div>Status: <span className="font-semibold">{ride.status}</span></div>
                  <div>Payment Mode: <span className="font-semibold">{ride.paymentMode}</span></div>
                  <div className="flex gap-2 mt-2">
                    {ride.status === 'REQUESTED' && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => acceptRide(ride)}>Accept</button>
                    )}
                    {ride.status === 'ACCEPTED' && ride.driverId && ride.driverId.toString() === myUserId && (
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => updateStatus(ride.id, 'PICKED')}>Picked</button>
                    )}
                    {ride.status === 'PICKED' && ride.driverId && ride.driverId.toString() === myUserId && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => updateStatus(ride.id, 'COMPLETED')}>Complete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <RideHistory rides={history} />
        </>
      )}
    </div>
  );
} 