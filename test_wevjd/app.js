const { useState, useEffect } = React;

function storageGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('storageGet parse error', e);
    return [];
  }
}
function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('storageSet error', e);
  }
}

function OperationsManagementSystem() {
  const [currentUser, setCurrentUser] = useState('supervisor');
  const [tasks, setTasks] = useState([]);
  const [operations, setOperations] = useState([]);
  const [customPages, setCustomPages] = useState([]);
  const [availableOperations, setAvailableOperations] = useState([]);

  useEffect(() => {
    // load data from localStorage
    setTasks(storageGet('tasks'));
    setOperations(storageGet('operations'));
    setCustomPages(storageGet('customPages'));
    setAvailableOperations(storageGet('availableOperations'));
  }, []);

  // save helpers
  const saveAndSet = (key, setter, data) => {
    setter(data);
    storageSet(key, data);
  };

  const addOperation = (operationData) => {
    const newOperation = {
      id: Date.now(),
      technicianName: 'Tech-Nation User',
      ...operationData,
      status: operationData.endTime ? 'completed' : 'in-progress',
      createdAt: new Date().toISOString(),
    };
    const updated = [...operations, newOperation];
    saveAndSet('operations', setOperations, updated);
  };

  const addTask = (taskData) => {
    const newTask = { id: Date.now(), ...taskData, status: 'pending', createdAt: new Date().toISOString() };
    const updated = [...tasks, newTask];
    saveAndSet('tasks', setTasks, updated);
  };

  const addCustomPage = (pageName) => {
    const newPage = { id: Date.now(), name: pageName, createdAt: new Date().toISOString() };
    const updated = [...customPages, newPage];
    saveAndSet('customPages', setCustomPages, updated);
  };

  const addAvailableOperation = (opName) => {
    const newOp = { id: Date.now(), name: opName, createdAt: new Date().toISOString() };
    const updated = [...availableOperations, newOp];
    saveAndSet('availableOperations', setAvailableOperations, updated);
  };

  const deleteAvailableOperation = (opId) => {
    const updated = availableOperations.filter((o) => o.id !== opId);
    saveAndSet('availableOperations', setAvailableOperations, updated);
  };

  function RoleSelector() {
    return (
      <div className="header">
        <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="title">Operations Management System</div>
          <div className="role-buttons">
            <button className={currentUser==='supervisor'? 'role-active':'role-inactive'} onClick={()=>setCurrentUser('supervisor')}>Supervisor</button>
            <button className={currentUser==='tech-nation'? 'role-active':'role-inactive'} onClick={()=>setCurrentUser('tech-nation')}>Tech-Nation</button>
            <button className={currentUser==='planner'? 'role-active':'role-inactive'} onClick={()=>setCurrentUser('planner')}>Planner</button>
          </div>
        </div>
      </div>
    );
  }

  function SupervisorDashboard() {
    const completedOps = operations.filter(op => op.status==='completed').length;
    const inProgressOps = operations.filter(op => op.status==='in-progress').length;

    return (
      <div className="container">
        <div style={{marginTop:16}}>
          <h2 style={{display:'flex',alignItems:'center',gap:8}}>👥 Supervisor Dashboard</h2>
        </div>

        <div className="grid cols-3" style={{marginTop:12}}>
          <div className="card kpi border-blue">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="small">Total Operations</div>
                <div style={{fontSize:24,fontWeight:700}}>{operations.length}</div>
              </div>
              <div style={{fontSize:28}}>📄</div>
            </div>
          </div>

          <div className="card kpi border-green">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="small">Completed</div>
                <div style={{fontSize:24,fontWeight:700}}>{completedOps}</div>
              </div>
              <div style={{fontSize:28}}>✅</div>
            </div>
          </div>

          <div className="card kpi border-orange">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="small">In Progress</div>
                <div style={{fontSize:24,fontWeight:700}}>{inProgressOps}</div>
              </div>
              <div style={{fontSize:28}}>⚠️</div>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop:16}}>
          <h3 style={{marginTop:0}}>📊 Tech-Nation Operations Status</h3>
          <div style={{overflowX:'auto'}}>
            <table className="table">
              <thead style={{background:'#f3f4f6'}}>
                <tr>
                  <th>Serial Number</th>
                  <th>Product</th>
                  <th>Selected Operations</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {operations.length===0 ? (
                  <tr><td colSpan="6" style={{padding:16,textAlign:'center',color:'#6b7280'}}>No operations recorded yet</td></tr>
                ) : (
                  operations.map((op)=> (
                    <tr key={op.id}>
                      <td>{op.serialNumber}</td>
                      <td>{op.productName}</td>
                      <td>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                          {op.selectedOperations && op.selectedOperations.map((s,i)=>{
                            const name = s && s.name ? s.name : s;
                            return (<span key={i} className="op-chip">{name}</span>);
                          })}
                        </div>
                      </td>
                      <td>{op.startTime? new Date(op.startTime).toLocaleString() : '-'}</td>
                      <td>{op.endTime? new Date(op.endTime).toLocaleString() : '-'}</td>
                      <td><span className={op.status==='completed'? 'badge badge-green':'badge badge-orange'} style={{display:'inline-block',padding:'6px 10px',borderRadius:999,fontSize:13}}>{op.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function TechNationDashboard() {
    // selectedOperationsMap keeps a boolean per available operation id: { [opId]: true }
    const [formData, setFormData] = useState({ serialNumber:'', productName:'', startTime:'', endTime:'', notes:'', selectedOperationsMap: {} });

    function toggleOperation(op) {
      setFormData(prev => {
        const map = { ...prev.selectedOperationsMap };
        map[op.id] = !map[op.id];
        return { ...prev, selectedOperationsMap: map };
      });
    }

    function handleSubmit() {
      const selectedIds = Object.keys(formData.selectedOperationsMap).filter(id => formData.selectedOperationsMap[id]);
      if (!formData.serialNumber || !formData.productName || !formData.startTime || selectedIds.length === 0) {
        alert('Please fill Serial, Product, Start Time and pick at least one operation');
        return;
      }

      // create a richer selectedOperations array with performed=true
      const selectedOps = availableOperations
        .filter(op => selectedIds.includes(String(op.id)))
        .map(op => ({ id: op.id, name: op.name, performed: true }));

      const payload = { ...formData, selectedOperations: selectedOps };
      addOperation(payload);
      setFormData({ serialNumber:'', productName:'', startTime:'', endTime:'', notes:'', selectedOperationsMap: {} });
    }

    return (
      <div className="container">
        <div style={{marginTop:16}}><h2>📄 Tech-Nation Dashboard</h2></div>

        <div className="card section">
          <h3 style={{marginTop:0}}>Assigned Tasks</h3>
          <div style={{display:'grid',gap:8}}>
            {tasks.length===0 ? <div className="small">No tasks assigned yet</div> : tasks.map(t=>(<div key={t.id} className="task-card"><div style={{fontWeight:600}}>{t.taskName}</div><div className="small">{t.description}</div></div>))}
          </div>
        </div>

        <div className="card section">
          <h3 style={{marginTop:0}}>Add Operation Document</h3>
          <div style={{display:'grid',gap:12}}>
            <div className="form-row">
              <div>
                <label className="small">Serial Number *</label>
                <input className="input" value={formData.serialNumber} onChange={(e)=>setFormData({...formData, serialNumber:e.target.value})} placeholder="e.g., SN-2024-001" />
              </div>
              <div>
                <label className="small">Product Name *</label>
                <input className="input" value={formData.productName} onChange={(e)=>setFormData({...formData, productName:e.target.value})} placeholder="e.g., Widget A" />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label className="small">Start Time *</label>
                <input className="input" type="datetime-local" value={formData.startTime} onChange={(e)=>setFormData({...formData, startTime:e.target.value})} />
              </div>
              <div>
                <label className="small">End Time (Optional)</label>
                <input className="input" type="datetime-local" value={formData.endTime} onChange={(e)=>setFormData({...formData, endTime:e.target.value})} />
              </div>
            </div>

            <div>
              <label className="small">Select Operations *</label>
              {availableOperations.length===0 ? (
                <div className="small">No operations available. Ask Planner to add some.</div>
              ) : (
                <div className="ops-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                  {availableOperations.map(op => (
                    <div key={op.id} onClick={()=>toggleOperation(op)} className={"op-select "+(formData.selectedOperationsMap[op.id]? 'op-selected' : '')}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:18,height:18, borderRadius:4, border:'2px solid', borderColor: formData.selectedOperationsMap[op.id]? '#2563eb':'#d1d5db', background: formData.selectedOperationsMap[op.id]? '#2563eb':'transparent'}}></div>
                        <div style={{fontWeight:600}}>{op.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {Object.values(formData.selectedOperationsMap).filter(Boolean).length>0 && <div className="small" style={{color:'#2563eb',marginTop:8}}>{Object.values(formData.selectedOperationsMap).filter(Boolean).length} operation(s) selected</div>}
            </div>

            <div>
              <label className="small">Notes</label>
              <textarea className="input" rows={3} value={formData.notes} onChange={(e)=>setFormData({...formData, notes:e.target.value})}></textarea>
            </div>

            <div>
              <button onClick={handleSubmit} className={Object.values(formData.selectedOperationsMap).filter(Boolean).length===0? 'btn btn-disabled':'btn btn-primary'} disabled={Object.values(formData.selectedOperationsMap).filter(Boolean).length===0}>{Object.values(formData.selectedOperationsMap).filter(Boolean).length===0? 'Select operations' : 'Submit Operation'}</button>
            </div>
          </div>
        </div>

        <div className="card section">
          <h3 style={{marginTop:0}}>My Recent Operations</h3>
          <div style={{display:'grid',gap:8}}>
            {operations.length===0 ? <div className="small">No operations recorded yet</div> : operations.slice(-5).reverse().map(op => (
              <div key={op.id} className="recent-item">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{op.productName} - {op.serialNumber}</div>
                    <div className="meta">Started: {op.startTime? new Date(op.startTime).toLocaleString() : '-'}</div>
                  </div>
                  <div><span className={op.status==='completed'? 'badge-green':'badge-orange'} style={{padding:'6px 10px',borderRadius:999}}>{op.status}</span></div>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                  {op.selectedOperations && op.selectedOperations.map((s,i)=>{
                    const name = s && s.name ? s.name : s;
                    return (<span key={i} className="op-chip">{name}</span>);
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function PlannerDashboard(){
    const [activeTab, setActiveTab] = useState('operations');
    const [taskForm, setTaskForm] = useState({ taskName:'', description:'', assignedTo:'Tech-Nation' });
    const [newPageName, setNewPageName] = useState('');
    const [newOperationName, setNewOperationName] = useState('');

    function handleTaskSubmit(){
      if (!taskForm.taskName) return alert('Task name required');
      addTask(taskForm);
      setTaskForm({ taskName:'', description:'', assignedTo:'Tech-Nation' });
    }
    function handleAddPage(){ if (!newPageName.trim()) return; addCustomPage(newPageName.trim()); setNewPageName(''); }
    function handleAddOperation(){ if (!newOperationName.trim()) return; addAvailableOperation(newOperationName.trim()); setNewOperationName(''); }

    return (
      <div className="container">
        <div style={{marginTop:16}}><h2>📅 Planner Dashboard</h2></div>

        <div className="tabs">
          <div className={activeTab==='operations'? 'tab tab-active':'tab'} onClick={()=>setActiveTab('operations')}>Operations Setup</div>
          <div className={activeTab==='tasks'? 'tab tab-active':'tab'} onClick={()=>setActiveTab('tasks')}>Task Management</div>
          <div className={activeTab==='pages'? 'tab tab-active':'tab'} onClick={()=>setActiveTab('pages')}>Custom Pages</div>
          <div className={activeTab==='settings'? 'tab tab-active':'tab'} onClick={()=>setActiveTab('settings')}>Settings</div>
        </div>

        {activeTab==='operations' && (
          <div className="card">
            <h3 style={{marginTop:0}}>Define Available Operations</h3>
            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <input className="input" value={newOperationName} onChange={(e)=>setNewOperationName(e.target.value)} placeholder="e.g., Cutting, Welding" />
              <button className="btn btn-primary" onClick={handleAddOperation}>Add Operation</button>
            </div>
            <div style={{display:'grid',gap:8}}>
              {availableOperations.length===0 ? <div className="small">No operations defined yet</div> : availableOperations.map(op=>(
                <div key={op.id} className="operation-item">
                  <div style={{fontWeight:600}}>{op.name}</div>
                  <div><button onClick={()=>deleteAvailableOperation(op.id)} style={{background:'transparent',border:0,color:'#ef4444',cursor:'pointer'}}>✖</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='tasks' && (
          <div>
            <div className="card" style={{marginBottom:12}}>
              <h3 style={{marginTop:0}}>Create New Task</h3>
              <div style={{display:'grid',gap:8}}>
                <input className="input" value={taskForm.taskName} onChange={(e)=>setTaskForm({...taskForm, taskName:e.target.value})} placeholder="Task name" />
                <textarea className="input" rows={3} value={taskForm.description} onChange={(e)=>setTaskForm({...taskForm, description:e.target.value})} placeholder="Description"></textarea>
                <input className="input" value={taskForm.assignedTo} onChange={(e)=>setTaskForm({...taskForm, assignedTo:e.target.value})} />
                <button className="btn btn-primary" onClick={handleTaskSubmit}>Create Task</button>
              </div>
            </div>

            <div className="card">
              <h3 style={{marginTop:0}}>All Tasks</h3>
              <div style={{display:'grid',gap:8}}>
                {tasks.length===0? <div className="small">No tasks created yet</div> : tasks.map(t=>(
                  <div key={t.id} className="recent-item">
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontWeight:700}}>{t.taskName}</div>
                        <div className="small">{t.description}</div>
                        <div className="meta">Assigned to: {t.assignedTo}</div>
                      </div>
                      <div><span style={{background:'#ebf8ff',color:'#075985',padding:'6px 10px',borderRadius:999}}>{t.status}</span></div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}

        {activeTab==='pages' && (
          <div className="card">
            <h3 style={{marginTop:0}}>Custom Pages</h3>
            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <input className="input" value={newPageName} onChange={(e)=>setNewPageName(e.target.value)} placeholder="Enter new page name" />
              <button className="btn btn-primary" onClick={handleAddPage}>Add Page</button>
            </div>
            <div style={{display:'grid',gap:8}}>
              {customPages.map(p=>(<div key={p.id} className="recent-item"><div style={{fontWeight:700}}>{p.name}</div><div className="meta">Created: {new Date(p.createdAt).toLocaleDateString()}</div></div>))}
            </div>
          </div>
        )}

        {activeTab==='settings' && (
          <div className="card">
            <h3 style={{marginTop:0}}>⚙️ System Settings</h3>
            <div style={{display:'grid',gap:12}}>
              <div>
                <div style={{fontWeight:700}}>Data Management</div>
                <div className="small">All data is stored locally (localStorage).</div>
                <div style={{marginTop:8}}><button className="btn" style={{background:'#ef4444',color:'white'}} onClick={()=>{ if(confirm('Clear all data?')){ localStorage.clear(); setTasks([]); setOperations([]); setCustomPages([]); setAvailableOperations([]); }}}>Clear All Data</button></div>
              </div>
              <div>
                <div style={{fontWeight:700}}>System Info</div>
                <div className="small">Available Operations: {availableOperations.length}</div>
                <div className="small">Total Operations Logs: {operations.length}</div>
                <div className="small">Total Tasks: {tasks.length}</div>
                <div className="small">Custom Pages: {customPages.length}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div>
      <RoleSelector />
      {currentUser==='supervisor' && <SupervisorDashboard />}
      {currentUser==='tech-nation' && <TechNationDashboard />}
      {currentUser==='planner' && <PlannerDashboard />}
      <div className="footer">Demo - data saved to localStorage in your browser</div>
    </div>
  );
}

// Render app
const root = document.getElementById('root');
ReactDOM.createRoot(root).render(React.createElement(OperationsManagementSystem));
