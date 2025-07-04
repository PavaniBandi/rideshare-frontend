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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome, Driver!</h1>
          <p className="text-lg">Thank you for keeping the city moving. Have a great day on the road!</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-xl font-bold">🚗</span>
            <span className="font-semibold">85</span>
            <span className="text-xs">Rides Today</span>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-xl font-bold">💰</span>
            <span className="font-semibold">₹1,200</span>
            <span className="text-xs">Earnings</span>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-xl font-bold">⭐</span>
            <span className="font-semibold">4.9/5</span>
            <span className="text-xs">Rating</span>
          </div>
        </div>
      </div>
      {/* End Welcome Banner */}
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 text-xl">📍</span>
                    <span>Pickup: <span className="font-semibold">{ride.pickupLocation}</span></span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 text-xl">🏁</span>
                    <span>Drop: <span className="font-semibold">{ride.dropLocation}</span></span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-600 text-xl">💸</span>
                    <span>Fare: <span className="font-semibold">₹{ride.fare}</span></span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-600 text-xl">🔖</span>
                    <span>Status: <span className="font-semibold">{ride.status}</span></span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-pink-600 text-xl">💳</span>
                    <span>Payment Mode: <span className="font-semibold">{ride.paymentMode}</span></span>
                  </div>
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
          {/* Tips/Recognition Section */}
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Driver Tips & Recognition</h2>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: "🦺", text: "Always wear your helmet and follow traffic rules." },
                { icon: "😊", text: "Greet your riders with a smile for a great experience." },
                { icon: "🧼", text: "Keep your vehicle clean and well-maintained." },
                { icon: "🏆", text: "Top 10% drivers this week! Keep up the great work." },
              ].map((tip, idx) => (
                <div key={idx} className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3 shadow w-72">
                  <span className="text-2xl">{tip.icon}</span>
                  <span className="text-gray-700">{tip.text}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
} 