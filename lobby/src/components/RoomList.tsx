import React from 'react';
import type { Room } from '../types';

interface Props {
  rooms: Room[];
  activeRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export const RoomList: React.FC<Props> = ({ rooms, activeRoomId, onSelect }) => {
  const sorted = [...rooms].sort((a, b) => a.order - b.order);

  return (
    <nav className="lobby-room-list">
      <div className="lobby-room-list-header">Rooms</div>
      <ul>
        {sorted.map((room) => (
          <li key={room.id}>
            <button
              className={`room-item ${activeRoomId === room.id ? 'active' : ''}`}
              onClick={() => onSelect(room.id)}
            >
              <span className="room-name">#{room.slug}</span>
              {room.description && (
                <span className="room-desc">{room.description}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
