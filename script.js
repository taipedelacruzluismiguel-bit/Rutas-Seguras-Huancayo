// PEGA AQUÍ LA URL DE TU REALTIME DATABASE (SIN LA BARRA "/" AL FINAL)
const FIREBASE_DB_URL = "https://ruta-segura-hyo-default-rtdb.firebaseio.com";

// ================= DATOS INICIALES DE RESPALDO (HUANCAYO) =================
const defaultIncidents = [
  {
    id: 1,
    type: 'Arrebato',
    severity: 'high',
    zone: 'El Tambo',
    place: 'Av. Huancavelica y Jr. Julio Sumar',
    desc: 'Dos sujetos en moto lineal arrebataron celular en paradero.',
    createdAt: Date.now() - 12 * 60000,
    confirmations: 4
  },
  {
    id: 2,
    type: 'Calle oscura',
    severity: 'medium',
    zone: 'Huancayo Centro',
    place: 'Prolongación Puno y Av. Ferrocarril',
    desc: 'Postes de alumbrado público apagados desde las 7:00 p.m.',
    createdAt: Date.now() - 35 * 60000,
    confirmations: 7
  },
  {
    id: 3,
    type: 'Robo',
    severity: 'high',
    zone: 'Chilca',
    place: 'Óvalo de Chilca / Av. 9 de Diciembre',
    desc: 'Asalto al paso cerca del puente peatonal. Transitar con precaución.',
    createdAt: Date.now() - 60 * 60000,
    confirmations: 5
  }
];

const defaultPatrolZones = [
  {
    id: 101,
    agency: 'Patrullaje Integrado (PNP + Serenazgo)',
    zone: 'Huancayo Centro',
    place: 'Plaza Constitución y Calle Real (cdras. 4 a 9)',
    schedule: 'Vigilancia permanente 24 horas y cámaras activas'
  },
  {
    id: 102,
    agency: 'Serenazgo El Tambo',
    zone: 'El Tambo',
    place: 'Parque Bolognesi / Av. Mariscal Castilla',
    schedule: 'Módulo de auxilio rápido y patrullaje motorizado'
  },
  {
    id: 103,
    agency: 'Policía (PNP) y Serenazgo',
    zone: 'Chilca',
    place: 'Parque Abel Martínez / Frente a Comisaría Chilca',
    schedule: 'Presencia policial continua y ronda nocturna'
  }
];

// Directorio real de Comisarías y Serenazgos de Huancayo
const emergencyContacts = [
  {
    category: 'Emergencia Nacional',
    isPnp: true,
    name: 'Central de Emergencias PNP',
    address: 'Atención inmediata en todo Huancayo (24h)',
    phones: [{ label: 'Llamar 105', number: '105', primary: true }]
  },
  {
    category: 'Comisaría PNP',
    isPnp: true,
    name: 'Comisaría PNP Huancayo (Centro)',
    address: 'Av. Ferrocarril N° 555 - Huancayo',
    phones: [
      { label: '(064) 211637', number: '064211637', primary: true },
      { label: '980 121 870', number: '980121870', primary: false }
    ]
  },
  {
    category: 'Serenazgo Municipal',
    isPnp: false,
    name: 'Serenazgo de Huancayo',
    address: 'Prol. Puno y Jr. José Gálvez - Huancayo',
    phones: [
      { label: '(064) 202050', number: '064202050', primary: true },
      { label: '(064) 200103', number: '064200103', primary: false }
    ]
  },
  {
    category: 'Comisaría PNP',
    isPnp: true,
    name: 'Comisaría PNP El Tambo',
    address: 'Av. Mariscal Castilla N° 1001 - El Tambo',
    phones: [
      { label: '(064) 247214', number: '064247214', primary: true },
      { label: '980 122 632', number: '980122632', primary: false }
    ]
  },
  {
    category: 'Serenazgo Municipal',
    isPnp: false,
    name: 'Serenazgo de El Tambo',
    address: 'Av. Mariscal Castilla N° 1051 - El Tambo',
    phones: [
      { label: '(064) 252510', number: '064252510', primary: true },
      { label: '(064) 252577', number: '064252577', primary: false }
    ]
  },
  {
    category: 'Comisaría PNP',
    isPnp: true,
    name: 'Comisaría PNP Chilca',
    address: 'Distrito de Chilca - Huancayo',
    phones: [
      { label: '(064) 200225', number: '064200225', primary: true },
      { label: '980 121 862', number: '980121862', primary: false }
    ]
  },
  {
    category: 'Serenazgo Municipal',
    isPnp: false,
    name: 'Serenazgo de Chilca',
    address: 'Central de Seguridad Ciudadana - Chilca',
    phones: [
      { label: '931 420 893', number: '931420893', primary: true },
      { label: '(064) 212223', number: '064212223', primary: false }
    ]
  },
  {
    category: 'Rescate y Salud',
    isPnp: false,
    name: 'Bomberos Huancayo / SAMU',
    address: 'Jr. Áncash N° 603 - Huancayo',
    phones: [
      { label: 'Bomberos 116', number: '116', primary: true },
      { label: 'SAMU 106', number: '106', primary: false }
    ]
  }
];

// ================= ESTADO GLOBAL =================
let incidents = [...defaultIncidents];
let patrolZones = [...defaultPatrolZones];
let confirmedIds = JSON.parse(localStorage.getItem('hyo_confirmed_ids') || '[]');
let currentZoneFilter = 'Todos';
let currentPatrolFilter = 'Todos';
let selectedDanger = { type: 'Arrebato', severity: 'high' };
let selectedPatrolAgency = 'Serenazgo';
let unreadNotifs = 0;
let lastKnownIncidentKey = null;

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Reciente';
  const diffMins = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return `Hace ${Math.floor(diffHours / 24)} d`;
}

// ================= SINCRONIZACIÓN CON FIREBASE =================
async function fetchCloudData(isInitial = false) {
  try {
    const [incRes, patRes] = await Promise.all([
      fetch(`${FIREBASE_DB_URL}/reportes.json`),
      fetch(`${FIREBASE_DB_URL}/vigilados.json`)
    ]);

    if (incRes.ok) {
      const incData = await incRes.json();
      if (incData) {
        const cloudIncidents = Object.entries(incData).map(([fbKey, val]) => ({
          fbKey,
          ...val
        }));
        cloudIncidents.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        const newestKey = cloudIncidents[0]?.fbKey;
        if (!isInitial && newestKey && lastKnownIncidentKey && newestKey !== lastKnownIncidentKey) {
          const newest = cloudIncidents[0];
          showPushNotification(
            `Nueva alerta en ${newest.zone}: ${newest.type}`,
            `${newest.place} · ${newest.desc}`
          );
        }
        lastKnownIncidentKey = newestKey;
        incidents = [...cloudIncidents, ...defaultIncidents];
      } else {
        incidents = [...defaultIncidents];
      }
      renderIncidents();
    }

    if (patRes.ok) {
      const patData = await patRes.json();
      if (patData) {
        const cloudPatrols = Object.entries(patData).map(([fbKey, val]) => ({
          fbKey,
          ...val
        }));
        cloudPatrols.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        patrolZones = [...cloudPatrols, ...defaultPatrolZones];
      } else {
        patrolZones = [...defaultPatrolZones];
      }
      renderPatrolZones();
    }
  } catch (err) {
    console.warn('Error sincronizando con Firebase:', err);
  }
}

// ================= NOTIFICACIONES =================
function enableSystemNotifications() {
  unreadNotifs = 0;
  document.getElementById('notifCounter').textContent = '0';

  if (!('Notification' in window)) {
    showPushNotification('Alertas activas', 'Recibirás avisos inmediatos dentro de la app.');
    return;
  }

  if (Notification.permission === 'granted') {
    showPushNotification('Notificaciones activadas', 'Recibirás alertas vecinales de Huancayo en tiempo real.');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showPushNotification('Permiso concedido', 'Te avisaremos cuando otros usuarios reporten.');
      } else {
        showPushNotification('Aviso interno activo', 'Verás las alertas en la parte superior de la pantalla.');
      }
    });
  } else {
    showPushNotification('Notificaciones internas', 'Las alertas aparecerán en tiempo real en tu app.');
  }
}

function showPushNotification(title, body) {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

  const banner = document.getElementById('pushBanner');
  document.getElementById('pushTitle').textContent = title;
  document.getElementById('pushBody').textContent = body;
  banner.classList.add('show');

  unreadNotifs++;
  document.getElementById('notifCounter').textContent = unreadNotifs;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body });
    } catch (e) {}
  }

  setTimeout(() => banner.classList.remove('show'), 5000);
}

function closePushBanner() {
  document.getElementById('pushBanner').classList.remove('show');
}

// ================= RENDERIZADO =================
function renderIncidents() {
  const container = document.getElementById('incidentsList');
  const filtered = currentZoneFilter === 'Todos'
    ? incidents
    : incidents.filter(i => i.zone === currentZoneFilter);

  container.innerHTML = filtered.map(item => {
    const itemId = item.fbKey || String(item.id);
    const isConfirmed = confirmedIds.includes(itemId);
    return `
      <article class="incident-card ${item.severity}">
        <div class="card-header-row">
          <span class="tag-type"><i class="fa-solid fa-triangle-exclamation"></i> ${item.type}</span>
          <span class="tag-zone">${item.zone}</span>
        </div>
        <div class="card-place">${item.place}</div>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer-row">
          <span class="time-text"><i class="fa-regular fa-clock"></i> ${formatRelativeTime(item.createdAt)}</span>
          <button class="btn-confirm ${isConfirmed ? 'confirmed' : ''}" onclick="confirmIncident('${itemId}')">
            <i class="fa-solid fa-thumbs-up"></i> Confirmar (${item.confirmations || 1})
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderPatrolZones() {
  const container = document.getElementById('patrolList');
  const filtered = currentPatrolFilter === 'Todos'
    ? patrolZones
    : patrolZones.filter(p => p.zone === currentPatrolFilter);

  container.innerHTML = filtered.map(item => `
    <article class="patrol-card">
      <div class="card-header-row">
        <span class="tag-patrol"><i class="fa-solid fa-shield-halved"></i> ${item.agency}</span>
        <span class="tag-zone">${item.zone}</span>
      </div>
      <div class="card-place">${item.place}</div>
      <div class="patrol-schedule">
        <i class="fa-solid fa-circle-check"></i> ${item.schedule}
      </div>
    </article>
  `).join('');
}

function renderContacts() {
  const container = document.getElementById('contactsList');
  container.innerHTML = emergencyContacts.map(c => `
    <article class="contact-card">
      <div class="contact-info">
        <span class="contact-badge ${c.isPnp ? 'pnp' : ''}">${c.category}</span>
        <div class="contact-name">${c.name}</div>
        <div class="contact-address">${c.address}</div>
      </div>
      <div class="call-buttons">
        ${c.phones.map(p => `
          <a href="tel:${p.number}" class="btn-call ${p.primary ? '' : 'secondary'}">
            <i class="fa-solid fa-phone"></i> ${p.label}
          </a>
        `).join('')}
      </div>
    </article>
  `).join('');
}

// ================= INTERACCIONES =================
function switchTab(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`screen-${tab}`).classList.add('active');
  document.getElementById(`nav-${tab}`).classList.add('active');
}

function filterByZone(zone, btn) {
  currentZoneFilter = zone;
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderIncidents();
}

function filterPatrolByZone(zone, btn) {
  currentPatrolFilter = zone;
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderPatrolZones();
}

async function confirmIncident(itemId) {
  if (confirmedIds.includes(itemId)) return;

  const item = incidents.find(i => (i.fbKey || String(i.id)) === itemId);
  if (!item) return;

  const newCount = (item.confirmations || 1) + 1;
  item.confirmations = newCount;
  confirmedIds.push(itemId);
  localStorage.setItem('hyo_confirmed_ids', JSON.stringify(confirmedIds));
  renderIncidents();

  if (item.fbKey) {
    try {
      await fetch(`${FIREBASE_DB_URL}/reportes/${item.fbKey}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmations: newCount })
      });
    } catch (e) {}
  }
}

function setReportMode(mode) {
  const dangerBox = document.getElementById('dangerFormBox');
  const safeBox = document.getElementById('safeFormBox');
  const btnDanger = document.getElementById('modeDangerBtn');
  const btnSafe = document.getElementById('modeSafeBtn');

  if (mode === 'danger') {
    dangerBox.style.display = 'flex';
    safeBox.style.display = 'none';
    btnDanger.className = 'mode-btn active-danger';
    btnSafe.className = 'mode-btn';
  } else {
    dangerBox.style.display = 'none';
    safeBox.style.display = 'flex';
    btnSafe.className = 'mode-btn active-safe';
    btnDanger.className = 'mode-btn';
  }
}

function selectCategory(btn, type, severity) {
  btn.parentElement.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedDanger = { type, severity };
}

function selectPatrolType(btn, agency) {
  btn.parentElement.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected-safe'));
  btn.classList.add('selected-safe');
  selectedPatrolAgency = agency;
}

async function submitDangerReport() {
  const zone = document.getElementById('dangerZone').value;
  const place = document.getElementById('dangerPlace').value.trim();
  const desc = document.getElementById('dangerDesc').value.trim() || 'Reportado por usuario de la comunidad.';

  if (!place) {
    showPushNotification('Falta la ubicación', 'Ingresa la calle o referencia del incidente.');
    return;
  }

  const newReport = {
    type: selectedDanger.type,
    severity: selectedDanger.severity,
    zone,
    place,
    desc,
    createdAt: Date.now(),
    confirmations: 1
  };

  try {
    const res = await fetch(`${FIREBASE_DB_URL}/reportes.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport)
    });
    const saved = await res.json();
    if (saved && saved.name) {
      lastKnownIncidentKey = saved.name;
    }
    await fetchCloudData(true);
  } catch (e) {
    showPushNotification('Error de red', 'No se pudo conectar con la nube. Revisa tu internet.');
    return;
  }

  document.getElementById('dangerPlace').value = '';
  document.getElementById('dangerDesc').value = '';
  switchTab('feed');
  showPushNotification(
    `Reporte publicado en ${zone}`,
    `${selectedDanger.type} en ${place} · Visible para todos los usuarios.`
  );
}

async function submitPatrolReport() {
  const zone = document.getElementById('safeZone').value;
  const place = document.getElementById('safePlace').value.trim();
  const schedule = document.getElementById('safeSchedule').value.trim() || 'Vigilancia reportada por vecinos';

  if (!place) {
    showPushNotification('Falta el lugar', 'Escribe la referencia del punto vigilado.');
    return;
  }

  const newPatrol = {
    agency: selectedPatrolAgency,
    zone,
    place,
    schedule,
    createdAt: Date.now()
  };

  try {
    await fetch(`${FIREBASE_DB_URL}/vigilados.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatrol)
    });
    await fetchCloudData(true);
  } catch (e) {
    showPushNotification('Error de red', 'No se pudo guardar en la nube.');
    return;
  }

  document.getElementById('safePlace').value = '';
  document.getElementById('safeSchedule').value = '';
  switchTab('patrol');
  showPushNotification(
    `Zona vigilada agregada (${zone})`,
    `${selectedPatrolAgency} en ${place}`
  );
}

async function simulateIncomingAlert() {
  const sampleAlerts = [
    { type: 'Arrebato', zone: 'El Tambo', place: 'Av. Universitaria / Ciudad Universitaria', desc: 'Alerta vecinal reciente en paradero.' },
    { type: 'Calle oscura', zone: 'Chilca', place: 'Jr. Próceres y Av. 9 de Diciembre', desc: 'Tramo sin iluminación pública.' },
    { type: 'Persona sospechosa', zone: 'Huancayo Centro', place: 'Jr. Cajamarca y Jr. Mantaro', desc: 'Sujetos merodeando comercios.' }
  ];
  const random = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];

  await fetch(`${FIREBASE_DB_URL}/reportes.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: random.type,
      severity: random.type === 'Arrebato' ? 'high' : 'medium',
      zone: random.zone,
      place: random.place,
      desc: random.desc,
      createdAt: Date.now(),
      confirmations: 1
    })
  });

  await fetchCloudData(false);
}

// ================= INICIO Y ACTUALIZACIÓN AUTOMÁTICA =================
renderIncidents();
renderPatrolZones();
renderContacts();
fetchCloudData(true);

// Consulta cada 6 segundos si otros usuarios publicaron algo nuevo
setInterval(() => fetchCloudData(false), 6000);
