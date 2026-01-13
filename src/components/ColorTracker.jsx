import { useState } from 'react';
import { useHouse } from '../context/HouseContext';

export default function ColorTracker() {
  // Use the global context instead of local state
  const { colors, addColor, deleteColor, rooms, getRoomName } = useHouse();
  
  const [newColor, setNewColor] = useState({ ncs: '', name: '', roomId: '' });

  const handleAddColor = (e) => {
    e.preventDefault();
    if (!newColor.ncs || !newColor.name || !newColor.roomId) {
        alert("Please fill in all fields and select a room.");
        return;
    }

    addColor(newColor);
    setNewColor({ ncs: '', name: '', roomId: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">House Color Tracker</h2>
      
      {/* Add Color Form */}
      <form onSubmit={handleAddColor} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Color</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NCS Code</label>
            <input
              type="text"
              placeholder="e.g. S 0502-Y"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newColor.ncs}
              onChange={(e) => setNewColor({ ...newColor, ncs: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
            <input
              type="text"
              placeholder="e.g. Eggshell White"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={newColor.roomId}
              onChange={(e) => setNewColor({ ...newColor, roomId: e.target.value })}
            >
                <option value="">-- Select Room --</option>
                {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                        {room.name} ({room.floor ? `Floor ${room.floor}` : 'No floor'})
                    </option>
                ))}
            </select>
            {rooms.length === 0 && (
                <p className="text-xs text-red-500 mt-1">No rooms available. Create a room first.</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={rooms.length === 0}
        >
          Add Color
        </button>
      </form>

      {/* Color List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">NCS Code</th>
              <th className="py-3 px-6">Color Name</th>
              <th className="py-3 px-6">Room</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {colors.map((color) => (
              <tr key={color.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 font-medium whitespace-nowrap text-gray-900">{color.ncs}</td>
                <td className="py-3 px-6">{color.name}</td>
                <td className="py-3 px-6">
                    {/* Handle both new ID-based link and old string legacy data if necessary */}
                    {color.roomId ? getRoomName(color.roomId) : (color.room || 'Unassigned')}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => deleteColor(color.id)}
                    className="text-red-500 hover:text-red-700 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {colors.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No colors added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}