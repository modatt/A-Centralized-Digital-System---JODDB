// Technician dashboard logic
(function(){
  document.addEventListener('DOMContentLoaded', function() {
    // Team-specific operations setup: EDIT ONLY THE ARRAYS BELOW
    const PRODUCTION_OPERATIONS = [
		'Assemblage I',
		'Assemblage II',
		'Assemblage II tubeless',
		'Final Touch - Cleaning&Packing',
		'Final Touch - Paint&Labeling',
		'Final Touch - Purge Vulve&Cleaning',
		'FocusA340',
		'FocusA360',
		'Lens Cleaning',
		'Objective and Doublet',
		'Nitrogen',
		'Sub-Assemblies',
		'Battery Contact Assy.',
		'Battery Cover Assy.',
		'Beam Combiner Assy.',
		'Cover Assy.',
		'Eyepiece Assy.',
		'Focus Assy.A340',
		'Focus Assy.A360',
		'Reticle Assy.',
		'Tube Assy.',
		'Troubleshooting',
		'Adaptors Installation',
		'Add Tube Spacers',
		'Adjust the Fiber Optic',
		'Adjusters',
		'Attaching Label',
		'Bushing Installation',
		'Change Battery contact',
		'Change Beam',
		'Change Eye Piece',
		'Change Power Card',
		'Change Reticle',
		'Change Reticle-Assy.II',
		'Clean the Reticle',
		'Clean Assemblage 1',
		'Clean Assemblage 2',
		'Contact Battery Installation',
		'Cover Assembly Only',
		'Cover Lacing',
		'Cover lacing and macaroon',
		'Cover Silicon',
		'Dirt on Beam-Assy.I',
		'Dirt on Beam-Assy.II',
		'Dirt on Eye Piece',
		'Dirt on Objective Lens',
		'Dirt on Tube',
		'Dirt on Tube- Air blow gun',
		'Disassemble Assemblage I',
		'Epoxy on Blue Wire',
		'Epoxy on Blue Wire',
		'ESD Line Test',
      // 'Assembly', 'Soldering', 'Packaging', 'Handover Documentation'
    ];
    const TESTER_OPERATIONS = [
		'Adjustment',
		'Unit Test',
		'Immersion'
      // 'Unit Test', 'Integration Test', 'Bug Verification', 'Test Report'
    ];
    const QUALITY_OPERATIONS = [
		'Quality Assemblage I',
		'Quality Assemblage II',
		'Final inspection',
		'Packing'
      // 'Incoming Inspection', 'Process Audit', 'Calibration', 'Final QA Report'
    ];

    const TEAM_OPERATIONS = {
      production: PRODUCTION_OPERATIONS,
      tester: TESTER_OPERATIONS,
      quality: QUALITY_OPERATIONS,
      _all: [] // fallback if team not set/missing
    };

    const TEAM_OTHER_PLACEHOLDER = {
      production: 'Describe a production-specific operation...',
      tester: 'Describe a testing-specific operation...',
      quality: 'Describe a quality-specific operation...',
      _default: 'Describe a custom operation for this team...'
    };
    // Remove any legacy priority fields from stored documents
    try {
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      let changed = false;
      docs.forEach(d => {
        if (Array.isArray(d.operations)) {
          d.operations = d.operations.map(o => {
            if (o && typeof o === 'object' && 'priority' in o) {
              const { priority, ...rest } = o;
              changed = true;
              return rest;
            }
            return o;
          });
        }
      });
      if (changed) localStorage.setItem('documents', JSON.stringify(docs));
    } catch (_) {}
    // Auth guard
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = 'index.html';
      return;
    }
    const role = localStorage.getItem('role');
    if (role !== 'technician') {
      // Non-tech users go to planner dashboard
      window.location.href = 'dashboard.html';
      return;
    }

    const currentUsername = localStorage.getItem('username') || 'Technician';
    document.getElementById('current-user').textContent = currentUsername;

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e){
        if (!this.classList.contains('logout')) {
          e.preventDefault();
          navLinks.forEach(l=>l.classList.remove('active'));
          sections.forEach(s=>s.classList.remove('active'));
          this.classList.add('active');
          const sectionId = this.getAttribute('data-section') + '-section';
          const section = document.getElementById(sectionId);
          if (section) {
            section.classList.add('active');
            document.getElementById('section-title').textContent = this.textContent;
          }
          if (sectionId === 'my-work-section') {
            loadAssignedDocs();
          } else if (sectionId === 'assigned-docs-section') {
            loadAssignedSummary();
          }
        }
      })
    });

    // Logout
    document.querySelector('.logout').addEventListener('click', function(e){
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = 'index.html';
    });

    document.getElementById('refresh-tech').addEventListener('click', loadAssignedDocs);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const me = users.find(u => u.username === currentUsername);
    const myId = me ? me.id : null;

    function loadAssignedDocs(){
      const tbody = document.getElementById('tech-docs-tbody');
      const empty = document.getElementById('tech-empty-state');
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      const assigned = myId ? docs.filter(d => Array.isArray(d.assignedUsers) && d.assignedUsers.includes(myId)) : [];

      tbody.innerHTML = '';
      if (assigned.length === 0) {
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';

      assigned.forEach(doc => {
        const tr = document.createElement('tr');
        const created = new Date(doc.createdDate).toLocaleDateString();
        const opsCompleted = (doc.operations || []).filter(op => op && op.status === true).length;
        const opsTotal = (doc.operations || []).length;
        tr.innerHTML = `
          <td>${doc.jobOrder || '-'}</td>
          <td><strong>${doc.jobOrderId || doc.serial || '-'}</strong></td>
          <td>${doc.device || '-'}</td>
          <td>${created}</td>
          <td>${opsCompleted}/${opsTotal}</td>
          <td>
            <button class="action-btn view" data-doc-id="${doc.id}">Open</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Attach open handlers
      tbody.querySelectorAll('button.action-btn.view').forEach(btn => {
        btn.addEventListener('click', () => openDocModal(parseInt(btn.dataset.docId)));
      });
    }

    function loadAssignedSummary(){
      const body = document.getElementById('assigned-summary-body');
      if (!body) return; // Section not present
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      const assigned = myId ? docs.filter(d => Array.isArray(d.assignedUsers) && d.assignedUsers.includes(myId)) : [];
      body.innerHTML = assigned.map(d => `
        <tr>
          <td>${d.jobOrder || '-'}</td>
          <td>${d.jobOrderId || d.serial || '-'}</td>
          <td>${d.device || '-'}</td>
          <td>${(d.assignedUsers || []).length}</td>
        </tr>
      `).join('');
    }

    // Modal logic
    const modal = document.getElementById('op-modal');
    const modalClose = document.getElementById('op-modal-close');
    const modalCancel = document.getElementById('cancel-ops-btn');
    const modalSave = document.getElementById('save-ops-btn');
    const modalBody = document.getElementById('op-modal-body');

    let currentDocId = null;

    modalClose.addEventListener('click', ()=> modal.style.display = 'none');
    modalCancel.addEventListener('click', ()=> modal.style.display = 'none');
    window.addEventListener('click', (e)=>{ if (e.target === modal) modal.style.display = 'none'; });

  let currentOpsList = [];
  let currentOtherPlaceholder = 'Enter custom operation';

  function openDocModal(docId){
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      const doc = docs.find(d => d.id === docId);
      if (!doc) return;
      currentDocId = docId;
      document.getElementById('op-modal-title').textContent = `Update Operations - ${doc.jobOrder || doc.title || 'Document'}`;

      // Prefill header fields in static HTML (fallback to dynamic only if missing)
      const now = new Date();
      const dayName = now.toLocaleDateString(undefined, { weekday: 'long' });
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const isoDate = `${yyyy}-${mm}-${dd}`;

      const dayEl = document.getElementById('tech-day');
      const dateEl = document.getElementById('tech-date');
      const joEl = document.getElementById('tech-job-order');
      const serialEl = document.getElementById('tech-serial-no');
      const nameEl = document.getElementById('tech-name');
      const idEl = document.getElementById('tech-id');
      if (dayEl) dayEl.value = dayName;
      if (dateEl) dateEl.value = isoDate;
      if (joEl) joEl.value = (doc.jobOrder || '');
      if (serialEl) serialEl.value = (doc.jobOrderId || doc.serial || '');
      if (nameEl) nameEl.value = currentUsername;
      if (idEl) idEl.value = (myId ?? '');

  // Team-aware defaults for dropdowns
  const teamKey = (doc.assignedTeam || '').toLowerCase();
  const teamDefaults = Array.from(new Set((TEAM_OPERATIONS[teamKey] || TEAM_OPERATIONS._all || []).filter(Boolean)));
  currentOpsList = teamDefaults.length
    ? teamDefaults
    : Array.from(new Set((Array.isArray(doc.operations) ? doc.operations : [])
        .map(o => typeof o === 'string' ? o : (o?.description || ''))
        .filter(Boolean)));
  currentOtherPlaceholder = TEAM_OTHER_PLACEHOLDER[teamKey] || TEAM_OTHER_PLACEHOLDER._default;

  const ops = Array.isArray(doc.operations) ? doc.operations : [];
      const tbody = document.getElementById('tech-ops-tbody');
      if (tbody) {
        if (ops.length === 0) {
          if (teamDefaults.length > 0) {
            tbody.innerHTML = teamDefaults.map((desc, idx) => renderOpRow({ description: desc }, idx)).join('');
          } else {
            tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No operations defined for this document.</td></tr>';
          }
        } else {
          tbody.innerHTML = ops.map((op, idx) => renderOpRow(op, idx)).join('');
        }
      }

      modal.style.display = 'block';
    }

    function renderOpRow(op, idx){
      if (typeof op === 'string') {
        op = { description: op };
      }
      const statusVal = op.status === true ? 'true' : op.status === false ? 'false' : '';
      const opDesc = op.description || '';
      const knownList = currentOpsList.length ? currentOpsList : (opDesc ? [opDesc] : []);
      const isKnown = knownList.includes(opDesc);
      const opOptions = `
        ${knownList.map(desc => `<option value="${escapeHtml(desc)}" ${desc===opDesc ? 'selected' : ''}>${escapeHtml(desc)}</option>`).join('')}
        <option value="__other__" ${!isKnown ? 'selected' : ''}>Other...</option>
      `;
      return `
        <tr data-index="${idx}">
          <td>${idx+1}</td>
          <td>
            <select class="tech-operation">
              <option value="">Select operation</option>
              ${opOptions}
            </select>
          </td>
          <td>
            <input type="text" class="tech-operation-other" placeholder="${escapeHtml(currentOtherPlaceholder || 'Enter custom operation')}" value="${!isKnown ? escapeHtml(opDesc) : ''}" style="${isKnown ? 'display:none;' : ''}" />
          </td>
          <td><input type="number" step="0.01" class="tech-min-output" value="${op.minOutput ?? ''}" /></td>
          <td><input type="number" step="0.1" class="tech-min-time" value="${op.minTime ?? ''}" /></td>
          <td><input type="number" step="0.01" class="tech-actual-output" value="${op.actualOutput ?? ''}" /></td>
          <td><input type="time" class="tech-start-time" value="${op.startTime ?? ''}" /></td>
          <td><input type="time" class="tech-end-time" value="${op.endTime ?? ''}" /></td>
          <td>
            <select class="tech-status">
              <option value="">Not Set</option>
              <option value="true" ${statusVal==='true' ? 'selected' : ''}>Completed</option>
              <option value="false" ${statusVal==='false' ? 'selected' : ''}>Not Completed</option>
            </select>
          </td>
          <td><textarea rows="2" class="tech-notes">${escapeHtml(op.notes || '')}</textarea></td>
        </tr>
      `;
    }

    function saveOps(){
      if (currentDocId == null) return;
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      const idx = docs.findIndex(d => d.id === currentDocId);
      if (idx === -1) return;

      // Read header fields
      const header = {
        day: (document.getElementById('tech-day')?.value || '').trim(),
        date: (document.getElementById('tech-date')?.value || '').trim(),
        jobOrder: (document.getElementById('tech-job-order')?.value || '').trim(),
        serialNo: (document.getElementById('tech-serial-no')?.value || '').trim(),
        techName: (document.getElementById('tech-name')?.value || '').trim(),
        techId: (document.getElementById('tech-id')?.value || '').trim(),
      };

      const rows = modalBody.querySelectorAll('tbody tr');
      const updatedOps = [];
      rows.forEach(row => {
        const i = parseInt(row.dataset.index);
        const opOrig = (docs[idx].operations || [])[i] || {};
        const descSel = row.querySelector('.tech-operation').value || '';
        let desc = '';
        if (descSel === '__other__') {
          desc = (row.querySelector('.tech-operation-other')?.value || '').trim();
        } else {
          desc = descSel || (typeof opOrig === 'string' ? opOrig : (opOrig.description || ''));
        }
        // Fallback to original description if user left blank on an existing row
        if (!desc && opOrig && (typeof opOrig === 'string' ? opOrig : opOrig.description)) {
          desc = typeof opOrig === 'string' ? opOrig : opOrig.description;
        }
        const minOutputInput = row.querySelector('.tech-min-output').value;
        const minTimeInput = row.querySelector('.tech-min-time').value;
        const minOutput = minOutputInput !== '' ? parseFloat(minOutputInput) || 0 : (typeof opOrig === 'object' ? (parseFloat(opOrig.minOutput) || 0) : 0);
        const minTime = minTimeInput !== '' ? parseFloat(minTimeInput) || 0 : (typeof opOrig === 'object' ? (parseFloat(opOrig.minTime) || 0) : 0);
        const actualOutput = parseFloat(row.querySelector('.tech-actual-output').value) || 0;
        const startTime = row.querySelector('.tech-start-time').value || '';
        const endTime = row.querySelector('.tech-end-time').value || '';
        // Compute actualTime in hours if start/end provided; otherwise keep existing numeric
        let actualTime = 0;
        if (startTime && endTime) {
          const today = (document.getElementById('tech-date')?.value || new Date().toISOString().slice(0,10));
          const start = new Date(`${today}T${startTime}`);
          const end = new Date(`${today}T${endTime}`);
          const ms = end - start;
          if (!isNaN(ms) && ms > 0) {
            actualTime = Math.round((ms / 36e5) * 100) / 100; // hours, 2 decimals
          }
        } else if (typeof opOrig === 'object' && opOrig.actualTime) {
          actualTime = parseFloat(opOrig.actualTime) || 0;
        }
        const statusRaw = row.querySelector('.tech-status').value;
        const status = statusRaw === 'true' ? true : statusRaw === 'false' ? false : null;
        const notes = row.querySelector('.tech-notes').value.trim();
        // If this is a newly added row with no description, skip it
        const isNewRow = !(docs[idx].operations || [])[i];
        if (!desc && isNewRow) {
          return; // skip adding blank new rows
        }
        const opData = { description: desc, minOutput, minTime, actualOutput, actualTime, startTime, endTime, status, notes };
        // Explicitly drop any legacy priority field
        updatedOps.push(opData);
      });

      const oldDoc = { ...docs[idx] };
      docs[idx] = {
        ...docs[idx],
        operations: updatedOps,
        lastModified: new Date().toISOString(),
        lastTechUpdate: header
      };
      localStorage.setItem('documents', JSON.stringify(docs));

      try { addDocumentHistory(currentDocId, 'operation_updated', `Technician ${header.techName || currentUsername} updated operation details`); } catch(e){}

      modal.style.display = 'none';
      loadAssignedDocs();
    }

    // Toggle custom operation input when selecting Other...
    const opsTbody = document.getElementById('tech-ops-tbody');
    if (opsTbody) {
      opsTbody.addEventListener('change', function(e){
        const sel = e.target.closest('select.tech-operation');
        if (!sel) return;
        const row = sel.closest('tr');
        const otherInput = row.querySelector('.tech-operation-other');
        if (!otherInput) return;
        if (sel.value === '__other__') {
          otherInput.style.display = '';
          otherInput.focus();
        } else {
          otherInput.style.display = 'none';
        }
      });
    }

    // Add new operation row handler
    const addOpBtn = document.getElementById('add-op-btn');
    function addNewOperationRow(){
      const tbody = document.getElementById('tech-ops-tbody');
      if (!tbody) return;
      // Remove empty state row if present
      const emptyRow = tbody.querySelector('.empty-state');
      if (emptyRow) {
        tbody.innerHTML = '';
      }
      const nextIndex = tbody.querySelectorAll('tr').length;
      const rowHtml = renderOpRow({}, nextIndex);
      const temp = document.createElement('tbody');
      temp.innerHTML = rowHtml.trim();
      const newRow = temp.firstElementChild;
      tbody.appendChild(newRow);
      // Focus custom operation input by default (since Other... is preselected)
      const otherInput = newRow.querySelector('.tech-operation-other');
      if (otherInput) otherInput.focus();
    }

    if (addOpBtn) {
      addOpBtn.addEventListener('click', function(e){
        e.preventDefault();
        addNewOperationRow();
      });
    }

    modalSave.addEventListener('click', saveOps);

    function escapeHtml(str){
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Initial load
    loadAssignedDocs();
    if (document.getElementById('assigned-summary-body')) {
      loadAssignedSummary();
    }
  });
})();
