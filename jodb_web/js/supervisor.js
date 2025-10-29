// Supervisor dashboard and approvals
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Auth guard
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = 'index.html';
      return;
    }
    const role = localStorage.getItem('role');
    if (role !== 'supervisor') {
      window.location.href = 'dashboard.html';
      return;
    }

    const currentUsername = localStorage.getItem('username') || 'Supervisor';
    const currentUserEl = document.getElementById('current-user');
    if (currentUserEl) currentUserEl.textContent = currentUsername;

    // Nav handling
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
          if (sectionId === 'overview-section') {
            loadOverview();
            startDashboardAutoRefresh();
          } else {
            stopDashboardAutoRefresh();
            if (sectionId === 'approvals-section') {
              loadApprovals();
            }
          }
        }
      });
    });

    // Logout
    document.querySelector('.logout')?.addEventListener('click', function(e){
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = 'index.html';
    });

    // Refresh buttons
    document.getElementById('refresh-dashboard')?.addEventListener('click', function(){
      loadOverview();
      this.style.transform = 'rotate(360deg)';
      setTimeout(()=> this.style.transform = 'rotate(0deg)', 500);
    });
    document.getElementById('refresh-approvals')?.addEventListener('click', loadApprovals);

    // Analytics (adapted from planner dashboard)
    function updateDashboardTime() {
      const now = new Date();
      const el = document.getElementById('last-update-time');
      if (el) el.textContent = now.toLocaleTimeString();
    }

    function calculateAnalytics() {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');

      const technicians = users.filter(u => u.role === 'technician').length;
      const supervisors = users.filter(u => u.role === 'supervisor').length;

      let totalOperations = 0;
      let completedOperations = 0;
      let totalActualTime = 0;
      let totalPlannedTime = 0;
      let totalEfficiency = 0;
      let efficiencyCount = 0;

      documents.forEach(doc => {
        if (Array.isArray(doc.operations)) {
          doc.operations.forEach(op => {
            if (typeof op === 'object') {
              totalOperations++;
              if (op.status === true) completedOperations++;
              if (op.actualTime) totalActualTime += parseFloat(op.actualTime);
              if (op.minTime) totalPlannedTime += parseFloat(op.minTime);
              if (op.actualTime && op.minTime && op.actualOutput && op.minOutput) {
                const timeEff = (parseFloat(op.minTime) / parseFloat(op.actualTime)) * 100;
                const outputEff = (parseFloat(op.actualOutput) / parseFloat(op.minOutput)) * 100;
                totalEfficiency += (timeEff + outputEff) / 2;
                efficiencyCount++;
              }
            }
          });
        }
      });

      const successRate = totalOperations > 0 ? (completedOperations / totalOperations) * 100 : 0;
      const avgEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : 0;
      const timeUtilization = totalPlannedTime > 0 ? (totalActualTime / totalPlannedTime) * 100 : 0;
      const avgCompletionTime = completedOperations > 0 ? totalActualTime / completedOperations : 0;
      const pendingOperations = totalOperations - completedOperations;
      const overdueCount = Math.floor(pendingOperations * 0.3);

      // For active projects, count docs with any not-completed operations
      const activeProjects = documents.filter(doc => (doc.operations || []).some(op => typeof op === 'object' && op.status === false)).length;

      return {
        users: users.length,
        technicians,
        supervisors,
        documents: documents.length,
        totalOperations,
        completedOperations,
        pendingOperations,
        successRate,
        avgEfficiency,
        timeUtilization,
        avgCompletionTime,
        overdueCount,
        activeProjects
      };
    }

    function generateSystemAlerts(analytics){
      const alerts = [];
      if (analytics.successRate < 70) {
        alerts.push({ type:'warning', icon:'⚠️', text:`Operation success rate is below target (${analytics.successRate.toFixed(1)}%)`, time:'Just now' });
      }
      if (analytics.avgEfficiency < 75) {
        alerts.push({ type:'warning', icon:'🐌', text:`Average efficiency needs improvement (${analytics.avgEfficiency.toFixed(1)}%)`, time:'2 min ago' });
      }
      if (analytics.overdueCount > 0) {
        alerts.push({ type:'warning', icon:'⏰', text:`${analytics.overdueCount} operations are overdue`, time:'5 min ago' });
      }
      if (alerts.length === 0) {
        alerts.push({ type:'info', icon:'✅', text:'All systems operating normally', time:'Just now' });
      }
      return alerts;
    }

    function updateActivityFeed(analytics){
      const activities = [
        { time: new Date().toLocaleTimeString(), text: 'Dashboard refreshed' },
        { time: '--:--', text: `${analytics.completedOperations} operations completed today` },
        { time: '--:--', text: `${analytics.activeProjects} projects currently active` },
        { time: '--:--', text: `System efficiency: ${analytics.avgEfficiency.toFixed(1)}%` }
      ];
      const feed = document.getElementById('activity-feed');
      if (feed) {
        feed.innerHTML = activities.map(a => `
          <div class="activity-item">
            <div class="activity-time">${a.time}</div>
            <div class="activity-text">${a.text}</div>
          </div>
        `).join('');
      }
    }

    function updateSystemStatus(analytics){
      const db = document.getElementById('database-status');
      const ops = document.getElementById('operations-status');
      const opsVal = document.getElementById('operations-value');
      const wf = document.getElementById('workflow-status');
      const wfVal = document.getElementById('workflow-value');
      const perf = document.getElementById('performance-status');
      const perfVal = document.getElementById('performance-value');
      if (db) db.textContent = '🟢';
      if (ops && opsVal) {
        const status = analytics.successRate >= 80 ? '🟢' : analytics.successRate >= 60 ? '🟡' : '🔴';
        ops.textContent = status;
        opsVal.textContent = analytics.successRate >= 80 ? 'Optimal' : 'Degraded';
      }
      if (wf && wfVal) {
        const status = analytics.pendingOperations < 5 ? '🟢' : analytics.pendingOperations < 10 ? '🟡' : '🔴';
        wf.textContent = status;
        wfVal.textContent = analytics.pendingOperations < 5 ? 'Smooth' : 'Busy';
      }
      if (perf && perfVal) {
        const status = analytics.avgEfficiency >= 85 ? '🟢' : analytics.avgEfficiency >= 70 ? '🟡' : '🔴';
        perf.textContent = status;
        perfVal.textContent = analytics.avgEfficiency >= 85 ? 'Excellent' : analytics.avgEfficiency >= 70 ? 'Good' : 'Poor';
      }
    }

    function updateAlerts(analytics){
      const alerts = generateSystemAlerts(analytics);
      const container = document.getElementById('alerts-container');
      if (container) {
        container.innerHTML = alerts.map(alert => `
          <div class="alert-item alert-${alert.type}">
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-text">${alert.text}</div>
            <div class="alert-time">${alert.time}</div>
          </div>
        `).join('');
      }
    }

    function loadOverview(){
      const analytics = calculateAnalytics();
      const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
      set('total-users', analytics.users);
      set('total-technicians', analytics.technicians);
      set('total-supervisors', analytics.supervisors);
      set('total-documents', analytics.documents);
      set('users-trend', '+2.5%');
      set('tech-trend', '+1.2%');
      set('super-trend', '0%');
      set('docs-trend', '+5.1%');
      set('completed-ops', analytics.completedOperations);
      set('pending-ops', analytics.pendingOperations);
      set('success-rate', analytics.successRate.toFixed(1) + '%');

      const progressBar = document.getElementById('operations-progress');
      if (progressBar) progressBar.style.width = analytics.successRate + '%';
      set('avg-efficiency', analytics.avgEfficiency.toFixed(1) + '%');
      set('time-utilization', Math.min(analytics.timeUtilization, 100).toFixed(1) + '%');
      const res = document.getElementById('resource-usage');
      if (res) res.textContent = (Math.random() * 30 + 60).toFixed(1) + '%';
      const gauge = document.getElementById('performance-gauge');
      if (gauge) gauge.style.width = analytics.avgEfficiency + '%';
      set('total-operations', analytics.totalOperations);
      set('avg-completion-time', analytics.avgCompletionTime.toFixed(1) + 'h');
      set('overdue-count', analytics.overdueCount);
      set('active-projects', analytics.activeProjects);

      updateSystemStatus(analytics);
      updateActivityFeed(analytics);
      updateAlerts(analytics);
      updateDashboardTime();
    }

    let dashboardInterval;
    function startDashboardAutoRefresh(){
      dashboardInterval = setInterval(()=>{
        const sec = document.getElementById('overview-section');
        if (sec && sec.classList.contains('active')) loadOverview();
      }, 30000);
    }
    function stopDashboardAutoRefresh(){ if (dashboardInterval) clearInterval(dashboardInterval); }

    // Approvals
    const approvalsTbody = document.getElementById('approvals-tbody');
    function loadApprovals(){
      if (!approvalsTbody) return;
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const techById = Object.fromEntries(users.filter(u=>u.role==='technician').map(u => [u.id, u]));

      const rows = [];
      docs.forEach(doc => {
        (doc.operations || []).forEach((op, idx) => {
          const opObj = typeof op === 'string' ? { description: op } : (op || {});
          const isCompleted = opObj.status === true;
          const pendingApproval = !opObj.approvalStatus;
          if (!isCompleted || !pendingApproval) return;

          // Determine the technician who performed/updated this op
          let techId = opObj.updatedById || doc?.lastTechUpdate?.techId || null;
          if (techId != null && typeof techId !== 'number') {
            const parsed = parseInt(techId);
            techId = isNaN(parsed) ? null : parsed;
          }
          if (!techId && Array.isArray(doc.assignedUsers) && doc.assignedUsers.length === 1) {
            techId = doc.assignedUsers[0];
          }
          const tech = techById[techId] || null;

          // Only show if the technician's supervisor matches the current supervisor
          if (!tech || (tech.supervisor || '').toLowerCase() !== currentUsername.toLowerCase()) return;

          const techName = tech?.username || doc.lastTechUpdate?.techName || '-';
          // Determine the one device related to this task
          let deviceName = (opObj.deviceName && String(opObj.deviceName).trim()) || '';
          if (!deviceName && Array.isArray(doc.devices)) {
            // Try to infer by matching task description (and assignee if available)
            const desc = (opObj.description || '').trim();
            const candidate = doc.devices.find(dev => Array.isArray(dev.tasks) && dev.tasks.some(tsk => {
              const sameDesc = (tsk?.description || '').trim() === desc;
              if (!sameDesc) return false;
              if (techId && tsk?.assignedTo) {
                const tId = typeof tsk.assignedTo === 'number' ? tsk.assignedTo : parseInt(tsk.assignedTo);
                return !isNaN(tId) ? (tId === techId) : true;
              }
              return true;
            }));
            if (candidate && candidate.name) deviceName = candidate.name;
          }
          const deviceDisplay = escapeHtml(deviceName || doc.device || '-');
          rows.push(`
            <tr data-doc-id="${doc.id}" data-op-index="${idx}">
              <td>${escapeHtml(doc.jobOrder || '-')}</td>
              <td>${deviceDisplay}</td>
              <td>${escapeHtml(opObj.description || '-')}</td>
              <td>${escapeHtml(techName)}</td>
              <td>${opObj.minTime ?? '-'}</td>
              <td>${opObj.actualTime ?? '-'}</td>
              <td>${opObj.minOutput ?? '-'}</td>
              <td>${opObj.actualOutput ?? '-'}</td>
              <td class="notes-cell">${escapeHtml(opObj.notes || '-')}</td>
              <td><textarea class="supervisor-note" rows="2" placeholder="Add note (optional)"></textarea></td>
              <td>
                <button class="action-btn approve-btn">Approve</button>
                <button class="action-btn delete reject-btn">Reject</button>
              </td>
            </tr>
          `);
        });
      });

      approvalsTbody.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="12" class="empty-state">No completed tasks pending approval.</td></tr>';
    }

    function updateApproval(docId, opIndex, status, note){
      const docs = JSON.parse(localStorage.getItem('documents') || '[]');
      const dIdx = docs.findIndex(d => d.id === docId);
      if (dIdx === -1) return;
      const op = (docs[dIdx].operations || [])[opIndex];
      const opObj = typeof op === 'string' ? { description: op } : (op || {});
      opObj.approvalStatus = status; // 'approved' | 'rejected'
      opObj.approvedBy = currentUsername;
      opObj.approvedAt = new Date().toISOString();
      opObj.approvalNotes = note || '';
      docs[dIdx].operations[opIndex] = opObj;
      docs[dIdx].lastModified = new Date().toISOString();
      localStorage.setItem('documents', JSON.stringify(docs));
      try { addDocumentHistory(docId, 'status_changed', `Operation "${opObj.description || ''}" ${status} by supervisor ${currentUsername}`); } catch(e){}
      loadApprovals();
    }

    // Minimal history logger
    function addDocumentHistory(docId, action, details){
      const currentUser = currentUsername;
      const timestamp = new Date().toISOString();
      const entry = { id: Date.now(), timestamp, user: currentUser, action, details };
      let documentHistory = JSON.parse(localStorage.getItem('documentHistory') || '{}');
      if (!documentHistory[docId]) documentHistory[docId] = [];
      documentHistory[docId].unshift(entry);
      if (documentHistory[docId].length > 50) documentHistory[docId] = documentHistory[docId].slice(0,50);
      localStorage.setItem('documentHistory', JSON.stringify(documentHistory));
    }

    // Delegated actions
    approvalsTbody?.addEventListener('click', function(e){
      const btn = e.target.closest('button');
      if (!btn) return;
      const row = btn.closest('tr');
      const docId = parseInt(row.dataset.docId);
      const opIndex = parseInt(row.dataset.opIndex);
      const note = row.querySelector('.supervisor-note')?.value || '';
      if (btn.classList.contains('approve-btn')) {
        updateApproval(docId, opIndex, 'approved', note);
      } else if (btn.classList.contains('reject-btn')) {
        updateApproval(docId, opIndex, 'rejected', note);
      }
    });

    function escapeHtml(str){
      return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
    }

    // Initial loads
    loadOverview();
    startDashboardAutoRefresh();
  });
})();
