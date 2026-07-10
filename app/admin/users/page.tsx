'use client';
import { UserPlus, MoreVertical, Mail, Shield, User } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 'U-3942', name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', registered: '2025-11-20', status: 'Active' },
    { id: 'U-3943', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', registered: '2025-10-15', status: 'Active' },
    { id: 'U-3944', name: 'Bob Wilson', email: 'bob.w@example.com', role: 'Customer', registered: '2026-01-05', status: 'Inactive' },
    { id: 'U-3945', name: 'Alice Brown', email: 'alice.b@example.com', role: 'Designer', registered: '2026-02-12', status: 'Active' },
    { id: 'U-3946', name: 'Charlie Davis', email: 'charlie.d@example.com', role: 'Customer', registered: '2026-03-22', status: 'Active' },
  ];

  return (
    <div>
      <style>{`
        .btn-primary { 
          background: #4ade80; color: #000; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; 
          font-weight: bold; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2); }
        .btn-icon { 
          background: transparent; border: 1px solid #333; color: #fff; padding: 0.5rem; 
          border-radius: 6px; cursor: pointer; transition: all 0.2s;
        }
        .btn-icon:hover { background: #222; border-color: #555; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>User Management</h1>
        <button className="btn-primary">
          <UserPlus size={18} />
          Invite User
        </button>
      </div>
      
      <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
              <th style={{ padding: '1.2rem' }}>User ID</th>
              <th style={{ padding: '1.2rem' }}>Name</th>
              <th style={{ padding: '1.2rem' }}>Email</th>
              <th style={{ padding: '1.2rem' }}>Role</th>
              <th style={{ padding: '1.2rem' }}>Registered</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1.2rem', fontWeight: '500', color: '#aaa' }}>{user.id}</td>
                <td style={{ padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                    </div>
                </td>
                <td style={{ padding: '1.2rem', color: '#aaa' }}>{user.email}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{
                    padding: '0.3rem 0.8rem', border: '1px solid #333', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: user.role === 'Admin' ? '#fde047' : user.role === 'Designer' ? '#a78bfa' : '#aaa'
                  }}>
                    {user.role === 'Admin' && <Shield size={12}/>}
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1.2rem', color: '#aaa' }}>{user.registered}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: user.status === 'Active' ? '#4ade80' : '#888'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'Active' ? '#4ade80' : '#888' }}></span>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-icon" onClick={() => alert(`Emailing ${user.name}`)}><Mail size={16}/></button>
                    <button className="btn-icon"><MoreVertical size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
