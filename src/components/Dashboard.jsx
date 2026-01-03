export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Home</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Colors</h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
          <p className="text-sm text-gray-500 mt-1">Recorded paint codes</p>
        </div>
        {/* Placeholder for future stats */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 opacity-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Appliances</h3>
          <p className="text-3xl font-bold text-gray-400">0</p>
          <p className="text-sm text-gray-500 mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
