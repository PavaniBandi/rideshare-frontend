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
    // Only fetch once on mount
    // eslint-disable-next-line
  }, []);

  // Handler after booking a ride or ride completion
  const handleRefresh = () => {
    fetchRides();
  };

  return (
    <div className="container mx-auto py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome, Rider!</h1>
          <p className="text-lg">Ready for your next journey? Book a ride in seconds.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-xl font-bold">⭐</span>
            <span className="font-semibold">4.8/5</span>
            <span className="text-xs">Avg. Rating</span>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-xl font-bold">🛣️</span>
            <span className="font-semibold">120</span>
            <span className="text-xs">Rides</span>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-xl font-bold">💸</span>
            <span className="font-semibold">₹2,500</span>
            <span className="text-xs">Saved</span>
          </div>
        </div>
      </div>
      {/* End Welcome Banner */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!currentRide && (
            <div className="mb-8">
              <RideBookingForm onBook={handleRefresh} />
            </div>
          )}
          {currentRide && (
            <div className="mb-8">
              <RideStatus ride={currentRide} onComplete={handleRefresh} />
            </div>
          )}
          <RideHistory />
          {/* Tips Section */}
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tips for a Great Ride</h2>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: "🪪", text: "Verify your driver and vehicle before starting the ride." },
                { icon: "💳", text: "Use digital payments for a seamless experience." },
                { icon: "📱", text: "Share your ride status with friends or family." },
                { icon: "⭐", text: "Rate your driver to help us improve our service." },
              ].map((tip, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4 flex items-center gap-3 shadow w-72">
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