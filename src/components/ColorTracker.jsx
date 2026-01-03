import { useState, useEffect } from 'react';

export default function ColorTracker() {
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem('house-colors');
    return saved ? JSON.parse(saved) : [
      { id: 1, ncs: 'S 0502-Y', name: 'Eggshell White', room: 'Living Room' },
      { id: 2, ncs: 'S 4502-B', name: 'Cool Grey', room: 'Kitchen' },
    ];
  });
  const [newColor, setNewColor] = useState({ ncs: '', name: '', room: '' });

  useEffect(() => {
    localStorage.setItem('house-colors', JSON.stringify(colors));
  }, [colors]);

  const handleAddColor = (e) => {
    e.preventDefault();
    if (!newColor.ncs || !newColor.name || !newColor.room) return;

    setColors([...colors, { ...newColor, id: Date.now() }]);
    setNewColor({ ncs: '', name: '', room: '' });
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
            <input
              type="text"
              placeholder="e.g. Living Room"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newColor.room}
              onChange={(e) => setNewColor({ ...newColor, room: e.target.value })}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full md:w-auto"
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
                <td className="py-3 px-6">{color.room}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setColors(colors.filter(c => c.id !== color.id))}
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
