const API_URL = "http://localhost:8000/api/dashboard";

export const fetchClientData = async () => {
    const res = await fetch(`${API_URL}/client`);
    if (!res.ok) throw new Error("API error");
    return res.json();
};

export const fetchHistoryData = async () => {
    const res = await fetch(`${API_URL}/history`);
    if (!res.ok) throw new Error("API error");
    return res.json();
};

export const fetchCompanyData = async () => {
    const res = await fetch(`${API_URL}/company`);
    if (!res.ok) throw new Error("API error");
    return res.json();
};

export const updateRoomPriority = async (roomName, priority) => {
    const res = await fetch(`${API_URL}/client/rooms/priority`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_name: roomName, priority })
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
};
