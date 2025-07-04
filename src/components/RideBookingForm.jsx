import React, { useState, useEffect } from 'react';
import rapidoBg from '../assets/rapidobg.png';
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

  // Home/Office and frequent locations
  const home = 'Kondapur';
  const office = 'HitechCity';
  const [recent, setRecent] = useState([]);

  // Load recent locations from localStorage
  useEffect(() => {
    const rec = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    setRecent(rec);
  }, []);

  // Save recent locations after booking
  const saveRecent = (pickup, drop) => {
    let rec = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    rec = rec.filter(l => l.pickup !== pickup || l.drop !== drop);
    rec.unshift({ pickup, drop });
    if (rec.length > 5) rec = rec.slice(0, 5);
    localStorage.setItem('recentLocations', JSON.stringify(rec));
    setRecent(rec);
  };

  // Simple fare/time calculation
  useEffect(() => {
    if (pickup && drop) {
      const baseFare = 50;
      const typeMultiplier = rideType === 'XL' ? 2 : rideType === 'Premium' ? 1.5 : rideType === 'Comfort' ? 1.2 : 1;
      setFare(baseFare * typeMultiplier);
      setEstimate('15-20 min');
    } else {
      setFare(null);
      setEstimate(null);
    }
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
      await apiRequest('/rides/book', 'POST', ride, token);
      setSuccess('Ride booked successfully!');
      setPickup('');
      setDrop('');
      setRideType('Economy');
      setPaymentMode('Cash');
      setFare(null);
      setEstimate(null);
      saveRecent(pickup, drop);
      onBook && onBook();
    } catch (err) {
      setError('Booking failed: ' + err.message);
    }
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[70vh] w-full"
      style={{
        backgroundImage: `url(${rapidoBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto p-8 rounded-xl shadow-lg bg-white/90">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 text-center">
          Bharat Moves On Rapido!
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Fast, safe, and affordable rides at your fingertips.
        </p>
        {/* Safety Tips Banner */}
        <div className="w-full mb-4">
          <div className="flex items-center gap-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 shadow">
            <span className="text-blue-500 text-2xl">🦺</span>
            <span className="text-gray-800 font-medium">Safety First: Always verify your driver and vehicle before starting your ride. Share your trip with loved ones for extra peace of mind.</span>
          </div>
        </div>
        {/* Promo/Offers Section */}
        <div className="w-full mb-4">
          <div className="flex items-center gap-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-3 shadow animate-pulse">
            <span className="text-yellow-500 text-2xl">🎁</span>
            <span className="text-gray-800 font-medium">Special Offer: Get 20% off on your first ride! Use code <span className="font-bold text-yellow-700">RAPIDO20</span></span>
          </div>
        </div>
        {/* Feature Highlights Section */}
        <div className="w-full mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center bg-green-50 rounded-lg p-4 shadow">
              <span className="text-green-600 text-3xl mb-2">⚡</span>
              <span className="font-semibold text-gray-800 mb-1">Instant Booking</span>
              <span className="text-gray-600 text-sm text-center">Book a ride in seconds with real-time driver matching.</span>
            </div>
            <div className="flex flex-col items-center bg-blue-50 rounded-lg p-4 shadow">
              <span className="text-blue-600 text-3xl mb-2">🛡️</span>
              <span className="font-semibold text-gray-800 mb-1">Verified Drivers</span>
              <span className="text-gray-600 text-sm text-center">All drivers are background-checked for your safety.</span>
            </div>
            <div className="flex flex-col items-center bg-purple-50 rounded-lg p-4 shadow">
              <span className="text-purple-600 text-3xl mb-2">💳</span>
              <span className="font-semibold text-gray-800 mb-1">Multiple Payment Options</span>
              <span className="text-gray-600 text-sm text-center">Pay with cash, card, or wallet—your choice, every time.</span>
            </div>
          </div>
        </div>
        {/* Frequent/Recent Locations */}
        {recent.length > 0 && (
          <div className="mb-4 w-full">
            <div className="font-semibold mb-1 text-gray-700">Frequent Locations:</div>
            <div className="flex flex-wrap gap-2">
              {recent.map((loc, idx) => (
                <button key={idx} type="button" className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1 text-sm font-medium flex items-center gap-1 hover:bg-yellow-100 transition" onClick={() => { setPickup(loc.pickup); setDrop(loc.drop); }}>
                  <span className="text-blue-500">📍</span> {loc.pickup} <span className="text-gray-400">→</span> <span className="text-green-500">🏁</span> {loc.drop}
                </button>
              ))}
            </div>
          </div>
        )}
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Pickup Location</label>
            <input type="text" className="w-full border rounded px-3 py-2 bg-white text-gray-900" value={pickup} onChange={e => setPickup(e.target.value)} required />
            {/* Quick Select for Pickup */}
            <div className="flex gap-2 mt-2">
              <span className="font-medium text-sm text-gray-600">Quick Select:</span>
              <button type="button" className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 font-semibold flex items-center gap-1 hover:bg-blue-100 transition" onClick={() => setPickup(home)}>
                <span className="text-blue-600">🏠</span> Home
              </button>
              <button type="button" className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1 font-semibold flex items-center gap-1 hover:bg-purple-100 transition" onClick={() => setPickup(office)}>
                <span className="text-purple-600">🏢</span> Office
              </button>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Destination</label>
            <input type="text" className="w-full border rounded px-3 py-2 bg-white text-gray-900" value={drop} onChange={e => setDrop(e.target.value)} required />
            {/* Quick Select for Drop */}
            <div className="flex gap-2 mt-2">
              <span className="font-medium text-sm text-gray-600">Quick Select:</span>
              <button type="button" className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 font-semibold flex items-center gap-1 hover:bg-blue-100 transition" onClick={() => setDrop(home)}>
                <span className="text-blue-600">🏠</span> Home
              </button>
              <button type="button" className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1 font-semibold flex items-center gap-1 hover:bg-purple-100 transition" onClick={() => setDrop(office)}>
                <span className="text-purple-600">🏢</span> Office
              </button>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Ride Type</label>
            <select className="w-full border rounded px-3 py-2 bg-white text-gray-900" value={rideType} onChange={e => setRideType(e.target.value)}>
              <option>Economy</option>
              <option>Comfort</option>
              <option>Premium</option>
              <option>XL</option>
            </select>
          </div>
          {/* Payment Options as Cards */}
          <div>
            <label className="block font-semibold mb-1">Payment Mode</label>
            <div className="flex gap-4">
              {[
                { mode: 'Cash', icon: '💵', color: 'bg-green-50 border-green-200', selected: paymentMode === 'Cash' },
                { mode: 'Card', icon: '💳', color: 'bg-blue-50 border-blue-200', selected: paymentMode === 'Card' },
                { mode: 'Wallet', icon: '👛', color: 'bg-purple-50 border-purple-200', selected: paymentMode === 'Wallet' },
              ].map(opt => (
                <button type="button" key={opt.mode} className={`flex-1 border rounded-lg px-3 py-2 font-semibold flex flex-col items-center gap-1 hover:shadow transition focus:outline-none ${opt.color} ${opt.selected ? 'ring-2 ring-blue-400' : ''}`} onClick={() => setPaymentMode(opt.mode)}>
                  <span className="text-2xl">{opt.icon}</span>
                  <span>{opt.mode}</span>
                </button>
              ))}
            </div>
          </div>
          {fare && (
            <div className="text-green-700">Estimated Fare: ₹{fare} | Time: {estimate}</div>
          )}
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition-all duration-200 shadow-lg">
            Book Ride
          </button>
        </form>
      </div>
    </section>
  );
}