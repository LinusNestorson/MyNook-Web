import { useState } from 'react';
import { useHouse } from '../context/HouseContext';

export default function RoomManager() {
  const { rooms, addRoom, deleteRoom, colors } = useHouse();
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    function: 'Bedroom', // Default
    floor: '1', // Default floor string
    area: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRoom.name) return;
    addRoom(newRoom);
    setNewRoom({ name: '', function: 'Bedroom', floor: '1', area: '' });
  };

  // Group rooms by floor for the "Map" visualization
  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floor || 'Unassigned';
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {});

  // Sort floors logically (this is a simple string sort, works for '1', '2', 'Basement' etc roughly)
  const sortedFloors = Object.keys(roomsByFloor).sort();

  const getColorsForRoom = (roomId) => {
    return colors.filter(c => c.roomId === roomId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My House Map</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Add Room Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Room</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Guest Room"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRoom.name}
                  onChange={e => setNewRoom({...newRoom, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Function</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRoom.function}
                  onChange={e => setNewRoom({...newRoom, function: e.target.value})}
                >
                  <option value="Bedroom">Bedroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Hallway">Hallway</option>
                  <option value="Office">Office</option>
                  <option value="Utility">Utility / Storage</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="text"
                    placeholder="e.g. 1"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newRoom.floor}
                    onChange={e => setNewRoom({...newRoom, floor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
                  <input
                    type="number"
                    placeholder="15"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newRoom.area}
                    onChange={e => setNewRoom({...newRoom, area: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition font-medium"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: The House Map (Visualization) */}
        <div className="lg:col-span-2 space-y-8">
          {rooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Your house map is empty. Add a room to get started!</p>
            </div>
          ) : (
            sortedFloors.map(floor => (
              <div key={floor} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-600 mb-4 border-b pb-2">
                  {isNaN(floor) ? floor : `Floor ${floor}`}
                </h3>
                
                {/* Grid of Rooms for this Floor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roomsByFloor[floor].map(room => {
                    const roomColors = getColorsForRoom(room.id);
                    
                    return (
                      <div key={room.id} className="bg-white p-4 rounded shadow-sm border border-gray-100 hover:shadow-md transition relative group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-gray-800">{room.name}</h4>
                          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {room.function}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-4">
                          {room.area ? `${room.area} m²` : 'Area not set'}
                        </div>

                        {/* Visual Indicators for Colors */}
                        <div className="flex gap-1 mb-2">
                            {roomColors.length > 0 ? (
                                roomColors.map(c => (
                                    <div 
                                        key={c.id} 
                                        className="w-4 h-4 rounded-full border border-gray-300" 
                                        style={{ backgroundColor: 'gray' /* Placeholder since we don't have HEX yet, only NCS names */ }} 
                                        title={`${c.name} (${c.ncs})`}
                                    ></div>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">No colors assigned</span>
                            )}
                            {roomColors.length > 0 && <span className="text-xs text-gray-400 ml-1">({roomColors.length})</span>}
                        </div>

                        <button 
                            onClick={() => deleteRoom(room.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                            title="Remove Room"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
