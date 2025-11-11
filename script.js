// Update this with your ESP32 IP address https://esp32-dashboard-1.onrender.com
const socket = new WebSocket("wss://esp32-dashboard-1.onrender.com");

// UI panel switching
window.showPanel = function (panelId) {
  const panels = document.querySelectorAll('.panel');
  const buttons = document.querySelectorAll('.tab-btn');
  panels.forEach(panel => panel.classList.toggle('active', panel.id === panelId || panelId === 'all'));
  buttons.forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase() === panelId || panelId === 'all'));
  document.querySelector('.dashboard-grid').classList.toggle('split-screen', panelId === 'all');
};

// Handle WebSocket messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  document.getElementById('heartRate').innerText = `${data.heartRate?.toFixed(1) || 'N/A'} bpm`;
  document.getElementById('spo2').innerText = `${data.spo2?.toFixed(1) || 'N/A'}%`;
  document.getElementById('temp').innerText = `${data.temperature?.toFixed(1) || 'N/A'}°C`;

  if (data.spo2 < 90) {
    document.getElementById('alertPanel').style.display = 'block';
  } else {
    document.getElementById('alertPanel').style.display = 'none';
  }

  if (data.lat && data.lng) {
    document.getElementById('mapFrame').src =
      `https://www.google.com/maps?q=${data.lat},${data.lng}&z=15&output=embed`;
  }
};

// Example hospital list
const hospitals = [
  { name: "CityCare Hospital", distance: "1.2 km" },
  { name: "Metro Heart Institute", distance: "2.3 km" },
  { name: "GreenLife Medical Center", distance: "3.1 km" }
];

window.searchHospitals = function () {
  const hospitalList = document.getElementById('hospitalList');
  hospitalList.innerHTML = '';
  hospitals.forEach(hospital => {
    const button = document.createElement('button');
    button.className = 'hospital-btn';
    button.textContent = `🏥 ${hospital.name} (${hospital.distance})`;
    hospitalList.appendChild(button);
  });
};

window.onload = () => showPanel('health');
