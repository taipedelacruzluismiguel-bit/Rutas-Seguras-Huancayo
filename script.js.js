// ================= DATOS INICIALES (HUANCAYO) =================
const defaultIncidents = [
  {
    id: 1,
    type: 'Arrebato',
    severity: 'high',
    zone: 'El Tambo',
    place: 'Av. Huancavelica y Jr. Julio Sumar',
    desc: 'Dos sujetos en moto lineal arrebataron celular en paradero.',
    time: 'Hace 12 min',
    confirmations: 4,
    confirmedByUser: false
  },
  {
    id: 2,
    type: 'Calle oscura',
    severity: 'medium',
    zone: 'Huancayo Centro',
    place: 'Prolongación Puno y Av. Ferrocarril',
    desc: 'Postes de alumbrado público apagados desde las 7:00 p.m.',
    time: 'Hace 35 min',
    confirmations: 7,
    confirmedByUser: false
  },
  {
    id: 3,
    type: 'Robo',
    severity: 'high',
    zone: 'Chilca',
    place: 'Óvalo de Chilca / Av. 9 de Diciembre',
    desc: 'Asalto al paso cerca del puente peatonal. Transitar con precaución.',
    time: 'Hace 1 hora',
    confirmations: 5,
    confirmedByUser: false
  },
  {
    id: 4,
    type: 'Cámara con fallas',
    severity: 'medium',
    zone: 'Huancayo Centro',
    place: 'Av. Giráldez cuadra 5',
    desc: 'Domo de videovigilancia municipal sin giro ni luz indicadora.',
    time: 'Hace 2 horas',
    confirmations: 3,
    confirmedByUser: false
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
  },
  {
    id: 104,
    agency: 'Cámara Operativa + Serenazgo',
    zone: 'El Tambo',
    place: 'Óvalo Julio Sumar y Av. Huancavelica',
    schedule: 'Monitoreo centralizado y unidad móvil en turno noche'
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

// ================= ESTADO CON PERSISTENCIA LOCAL =================
let incidents = JSON.parse(localStorage.getItem('hyo_incidents')) || defaultIncidents;
let patrolZones = JSON.parse(localStorage.getItem('hyo_patrols')) || defaultPatrolZones;
let currentZoneFilter = 'Todos';
let currentPatrolFilter = 'Todos';
let selectedDanger = { type: 'Arrebato', severity: 'high' };
let selectedPatrolAgency = 'Serenazgo';
let unreadNotifs = 0;

function saveState() {
  localStorage.setItem('hyo_incidents', JSON.stringify(incidents));
  localStorage.setItem('hyo_patrols', JSON.stringify(patrolZones));
}

// ================= NOTIFICACIONES (APP + SISTEMA) =================
function enableSystemNotifications() {
  unreadNotifs = 0;
  document.getElementById('notifCounter').textContent = '0';

  if (!('Notification' in window)) {
    showPushNotification('Alertas activas', 'Recibirás avisos inmediatos dentro de la aplicación.');
    return;
  }

  if (Notification.permission === 'granted') {
    showPushNotification('Notificaciones activadas', 'Ya estás recibiendo alertas vecinales de Huancayo.');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showPushNotification('Permiso concedido', 'Te avisaremos cuando haya reportes cerca.');
      } else {
        showPushNotification('Aviso interno activo', 'Verás las alertas en la parte superior de la app.');
      }
    });
  } else {
    showPushNotification('Notificaciones internas', 'Las alertas aparecerán en tiempo real en tu pantalla.');
  }
}

function showPushNotification(title, body) {
  // Vibración en celular
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

  // Banner superior dentro de la app
  const banner = document.getElementById('pushBanner');
  document.getElementById('pushTitle').textContent = title;
  document.getElementById('pushBody').textContent = body;
  banner.classList.add('show');

  // Contador
  unreadNotifs++;
  document.getElementById('notifCounter').textContent = unreadNotifs;

  // Notificación nativa del sistema si está permitida
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body: body });
    } catch (e) {
      // Respaldo silencioso en WebView
    }
  }

  setTimeout(() => {
    banner.classList.remove('show');
  }, 4500);
}

function closePushBanner() {
  document.getElementById('pushBanner').classList.remove('show');
}

// ================= RENDERIZADO DE PANTALLAS =================
function renderIncidents() {
  const container = document.getElementById('incidentsList');
  const filtered = currentZoneFilter === 'Todos'
    ? incidents
    : incidents.filter(i => i.zone === currentZoneFilter);

  container.innerHTML = filtered.map(item => `
    <article class="incident-card ${item.severity}">
      <div class="card-header-row">
        <span class="tag-type"><i class="fa-solid fa-triangle-exclamation"></i> ${item.type}</span>
        <span class="tag-zone">${item.zone}</span>
      </div>
      <div class="card-place">${item.place}</div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-footer-row">
        <span class="time-text"><i class="fa-regular fa-clock"></i> ${item.time}</span>
        <button class="btn-confirm ${item.confirmedByUser ? 'confirmed' : ''}" onclick="confirmIncident(${item.id})">
          <i class="fa-solid fa-thumbs-up"></i> Confirmar (${item.confirmations})
        </button>
      </div>
    </article>
  `).join('');
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

function confirmIncident(id) {
  const item = incidents.find(i => i.id === id);
  if (!item) return;

  if (!item.confirmedByUser) {
    item.confirmations++;
    item.confirmedByUser = true;
  } else {
    item.confirmations--;
    item.confirmedByUser = false;
  }
  saveState();
  renderIncidents();
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

function submitDangerReport() {
  const zone = document.getElementById('dangerZone').value;
  const place = document.getElementById('dangerPlace').value.trim();
  const desc = document.getElementById('dangerDesc').value.trim() || 'Reportado por usuario de la comunidad.';

  if (!place) {
    showPushNotification('Falta la ubicación', 'Ingresa la calle o referencia del incidente.');
    return;
  }

  const newReport = {
    id: Date.now(),
    type: selectedDanger.type,
    severity: selectedDanger.severity,
    zone: zone,
    place: place,
    desc: desc,
    time: 'Ahora mismo',
    confirmations: 1,
    confirmedByUser: true
  };

  incidents.unshift(newReport);
  saveState();
  renderIncidents();

  document.getElementById('dangerPlace').value = '';
  document.getElementById('dangerDesc').value = '';

  switchTab('feed');
  showPushNotification(
    `Alerta en ${zone}: ${selectedDanger.type}`,
    `${place} · Se notificó a los usuarios cercanos.`
  );
}

function submitPatrolReport() {
  const zone = document.getElementById('safeZone').value;
  const place = document.getElementById('safePlace').value.trim();
  const schedule = document.getElementById('safeSchedule').value.trim() || 'Vigilancia reportada por vecinos';

  if (!place) {
    showPushNotification('Falta el lugar', 'Escribe la referencia del punto vigilado.');
    return;
  }

  patrolZones.unshift({
    id: Date.now(),
    agency: selectedPatrolAgency,
    zone: zone,
    place: place,
    schedule: schedule
  });

  saveState();
  renderPatrolZones();

  document.getElementById('safePlace').value = '';
  document.getElementById('safeSchedule').value = '';

  switchTab('patrol');
  showPushNotification(
    `Zona vigilada agregada (${zone})`,
    `${selectedPatrolAgency} en ${place}`
  );
}

function simulateIncomingAlert() {
  const sampleAlerts = [
    { type: 'Arrebato', zone: 'El Tambo', place: 'Av. Universitaria / Ciudad Universitaria', desc: 'Alerta vecinal reciente en paradero.' },
    { type: 'Calle oscura', zone: 'Chilca', place: 'Jr. Próceres y Av. 9 de Diciembre', desc: 'Tramo sin iluminación pública.' },
    { type: 'Persona sospechosa', zone: 'Huancayo Centro', place: 'Jr. Cajamarca y Jr. Mantaro', desc: 'Sujetos merodeando comercios.' }
  ];
  const random = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];

  incidents.unshift({
    id: Date.now(),
    type: random.type,
    severity: random.type === 'Arrebato' ? 'high' : 'medium',
    zone: random.zone,
    place: random.place,
    desc: random.desc,
    time: 'Hace 1 min',
    confirmations: 2,
    confirmedByUser: false
  });

  saveState();
  renderIncidents();
  showPushNotification(`Alerta Vecinal · ${random.zone}`, `${random.type} en ${random.place}`);
}

// Inicializar vistas
renderIncidents();
renderPatrolZones();
renderContacts();