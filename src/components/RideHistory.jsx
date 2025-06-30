export default function RideHistory({ rides }) {
  if (!rides || rides.length === 0) return <div>No rides found.</div>;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Ride History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Drop</th>
              <th className="px-4 py-2">Fare</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} className="border-t">
                <td className="px-4 py-2">{ride.pickupLocation}</td>
                <td className="px-4 py-2">{ride.dropLocation}</td>
                <td className="px-4 py-2">₹{ride.fare}</td>
                <td className="px-4 py-2">{ride.status}</td>
                <td className="px-4 py-2">{ride.paymentMode || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 