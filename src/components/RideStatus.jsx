export default function RideStatus({ ride }) {
  if (!ride) return null;
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">Current Ride Status</h2>
      <div className="mb-2">Pickup: <span className="font-semibold">{ride.pickupLocation}</span></div>
      <div className="mb-2">Drop: <span className="font-semibold">{ride.dropLocation}</span></div>
      <div className="mb-2">Fare: <span className="font-semibold">₹{ride.fare}</span></div>
      <div className="mb-2">Status: <span className="font-semibold">{ride.status}</span></div>
      {ride.driver && (
        <div className="mb-2">Driver: <span className="font-semibold">{ride.driver.name || 'Assigned'}</span></div>
      )}
    </div>
  );
} 