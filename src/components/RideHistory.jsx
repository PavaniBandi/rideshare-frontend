import { useState, useEffect } from 'react';
import { apiRequest } from '../api.jsx';

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchRides = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/rides/history', 'GET', null, token);
      setRides(data);
    } catch (err) {
      setError('Failed to fetch rides: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRides();
    const interval = setInterval(fetchRides, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading ride history...</div>;
  if (error) return <div className="text-red-500 mb-4">{error}</div>;
  if (!rides || rides.length === 0) return <div>No rides found.</div>;
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
        <span>🕓</span> Ride History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg border border-gray-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left">Pickup</th>
              <th className="px-4 py-3 text-left">Drop</th>
              <th className="px-4 py-3 text-left">Fare</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Payment</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride, idx) => (
              <tr key={ride.id} className={`border-t transition hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-blue-500">📍</span> {ride.pickupLocation}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-green-500">🏁</span> {ride.dropLocation}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-yellow-700">₹{ride.fare}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    ride.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    ride.status === 'PICKED' ? 'bg-yellow-100 text-yellow-700' :
                    ride.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {ride.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {ride.paymentMode === 'CASH' && <span className="text-green-600">💵</span>}
                  {ride.paymentMode === 'CARD' && <span className="text-blue-600">💳</span>}
                  {ride.paymentMode === 'WALLET' && <span className="text-purple-600">👛</span>}
                  <span>{ride.paymentMode || '-'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 