import React from 'react';
import rapidoBg from '../assets/rapidobg.png';

export default function RideBookingForm({
  pickup,
  setPickup,
  drop,
  setDrop,
  rideType,
  setRideType,
  paymentMode,
  setPaymentMode,
  fare,
  estimate,
  error,
  success,
  onBook
}) {
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
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto p-8 rounded-xl shadow-lg bg-white/90">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 text-center">
          Bharat Moves On Rapido!
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Fast, safe, and affordable rides at your fingertips.
        </p>
        <form className="space-y-4 w-full" onSubmit={onBook}>
          <div>
            <label className="block font-semibold mb-1">Pickup Location</label>
            <input type="text" className="w-full border rounded px-3 py-2 bg-white text-gray-900" value={pickup} onChange={e => setPickup(e.target.value)} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Destination</label>
            <input type="text" className="w-full border rounded px-3 py-2 bg-white text-gray-900" value={drop} onChange={e => setDrop(e.target.value)} required />
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
          <div>
            <label className="block font-semibold mb-1">Payment Mode</label>
            <select className="w-full border rounded px-3 py-2 bg-white text-gray-900" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
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
      </div>
    </section>
  );
}