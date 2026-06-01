// ============================================================
//  MediCare — Hospital Appointment Manager
//  script.js  |  Alam Nashra Altaf Tamboli | PRN: 2445103198
// ============================================================

// ── DATA ─────────────────────────────────────────────────────

const DOCTORS = [
  { name: "Dr. Aisha Patel",      spec: "Cardiology",     exp: "12 yrs", icon: "A" },
  { name: "Dr. Rohan Mehta",      spec: "Cardiology",     exp: "8 yrs",  icon: "R" },
  { name: "Dr. Sneha Kulkarni",   spec: "Neurology",      exp: "15 yrs", icon: "S" },
  { name: "Dr. Arjun Desai",      spec: "Neurology",      exp: "10 yrs", icon: "A" },
  { name: "Dr. Priya Iyer",       spec: "Dentistry",      exp: "6 yrs",  icon: "P" },
  { name: "Dr. Vikram Joshi",     spec: "Dentistry",      exp: "9 yrs",  icon: "V" },
  { name: "Dr. Meera Nair",       spec: "Ophthalmology",  exp: "11 yrs", icon: "M" },
  { name: "Dr. Kiran Sharma",     spec: "Ophthalmology",  exp: "7 yrs",  icon: "K" },
  { name: "Dr. Suresh Yadav",     spec: "Orthopedics",    exp: "14 yrs", icon: "S" },
  { name: "Dr. Anjali Verma",     spec: "Orthopedics",    exp: "5 yrs",  icon: "A" },
  { name: "Dr. Nitin Bhat",       spec: "Pathology",      exp: "13 yrs", icon: "N" },
  { name: "Dr. Divya Reddy",      spec: "Pathology",      exp: "9 yrs",  icon: "D" },
];

const DEPT_DOCTORS = {};
DOCTORS.forEach(d => {
  if (!DEPT_DOCTORS[d.spec]) DEPT_DOCTORS[d.spec] = [];
  DEPT_DOCTORS[d.spec].push(d.name);
});

// In-memory appointment store
let appointments = [];
let apptCounter = 1;

// ── DOCTORS PAGE ─────────────────────────────────────────────

function renderDoctors(filter = "") {
  const grid = document.getElementById("doctorGrid");
  if (!grid) return;

  const filtered = DOCTORS.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.spec.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1">No doctors found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(d => `
    <div class="doctor-card">
      <div class="doctor-avatar">${d.icon}</div>
      <div class="doctor-name">${d.name}</div>
      <div class="doctor-spec">${d.spec}</div>
      <div class="doctor-exp">${d.exp} experience</div>
    </div>
  `).join("");
}

function filterDoctors() {
  const q = document.getElementById("docSearch").value;
  renderDoctors(q);
}

// ── APPOINTMENTS PAGE ─────────────────────────────────────────

function updateDoctors() {
  const dept = document.getElementById("department").value;
  const sel  = document.getElementById("doctorSelect");
  sel.innerHTML = `<option value="">Select Doctor</option>`;

  if (dept && DEPT_DOCTORS[dept]) {
    DEPT_DOCTORS[dept].forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
  } else {
    sel.innerHTML = `<option value="">Select Department First</option>`;
  }
}

function bookAppointment() {
  const name   = document.getElementById("patientName").value.trim();
  const age    = document.getElementById("patientAge").value.trim();
  const gender = document.getElementById("patientGender").value;
  const phone  = document.getElementById("contactNum").value.trim();
  const dept   = document.getElementById("department").value;
  const doctor = document.getElementById("doctorSelect").value;
  const date   = document.getElementById("apptDate").value;
  const time   = document.getElementById("timeSlot").value;
  const reason = document.getElementById("reason").value.trim();

  // Validation
  if (!name) { alert("Please enter patient name."); return; }
  if (!age || parseInt(age) <= 0) { alert("Please enter a valid age."); return; }
  if (!gender) { alert("Please select gender."); return; }
  if (!phone || phone.length < 10) { alert("Please enter a valid 10-digit contact number."); return; }
  if (!dept) { alert("Please select a department."); return; }
  if (!doctor) { alert("Please select a doctor."); return; }
  if (!date) { alert("Please select an appointment date."); return; }
  if (!time) { alert("Please select a time slot."); return; }
  if (!reason) { alert("Please describe your symptoms."); return; }

  const appt = {
    id: apptCounter++,
    name, age, gender, phone, dept, doctor, date, time, reason,
    status: "Confirmed"
  };

  appointments.push(appt);
  renderAppointments();
  resetForm();
  alert(`✅ Appointment booked successfully!\nAppointment ID: #${appt.id}`);
}

function cancelAppointment(id) {
  const appt = appointments.find(a => a.id === id);
  if (appt && confirm("Are you sure you want to cancel this appointment?")) {
    appt.status = "Cancelled";
    renderAppointments();
  }
}

function renderAppointments() {
  const tbody     = document.getElementById("apptBody");
  const emptyMsg  = document.getElementById("emptyMsg");
  const table     = document.getElementById("apptTable");
  if (!tbody) return;

  const total     = appointments.length;
  const confirmed = appointments.filter(a => a.status === "Confirmed").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;

  document.getElementById("chipTotal").textContent     = `Total: ${total}`;
  document.getElementById("chipConfirmed").textContent = `Confirmed: ${confirmed}`;
  document.getElementById("chipCancelled").textContent = `Cancelled: ${cancelled}`;

  if (total === 0) {
    table.style.display = "none";
    emptyMsg.style.display = "block";
    return;
  }

  table.style.display = "table";
  emptyMsg.style.display = "none";

  tbody.innerHTML = appointments.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${a.name}</strong><br/><small style="color:var(--muted)">${a.age}y • ${a.gender}</small></td>
      <td>${a.doctor}</td>
      <td>${formatDate(a.date)}</td>
      <td>${a.time}</td>
      <td>${a.dept}</td>
      <td><span class="badge ${a.status.toLowerCase()}">${a.status}</span></td>
      <td>
        <button class="btn-cancel" onclick="cancelAppointment(${a.id})" ${a.status === "Cancelled" ? "disabled" : ""}>
          Cancel
        </button>
      </td>
    </tr>
  `).join("");
}

function resetForm() {
  ["patientName","patientAge","contactNum","apptDate","reason"].forEach(id => {
    document.getElementById(id).value = "";
  });
  ["patientGender","department","timeSlot"].forEach(id => {
    document.getElementById(id).selectedIndex = 0;
  });
  const sel = document.getElementById("doctorSelect");
  if (sel) {
    sel.innerHTML = `<option value="">Select Department First</option>`;
  }
}

// ── UTILS ─────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
