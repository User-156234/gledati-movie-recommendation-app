import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('username');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Access denied');
      navigate('/home');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersWithRole = res.data.filter((u) => u.role);
        setUsers(usersWithRole);
      } catch (err) {
        alert('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [user, token, navigate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const filteredUsers = users
    .filter((u) => {
      const name = u?.username?.toLowerCase() || '';
      const email = u?.email?.toLowerCase() || '';
      const role = u?.role || '';
      return (
        (name.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase())) &&
        (roleFilter ? role === roleFilter : true)
      );
    })
    .sort((a, b) => {
      const valA = a?.[sortField]?.toLowerCase?.() || '';
      const valB = b?.[sortField]?.toLowerCase?.() || '';
      return valA.localeCompare(valB);
    });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Role'],
      ...filteredUsers.map((u) => [u.username, u.email, u.role])
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="username">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
        </select>

        <button onClick={exportToCSV} className="export-btn">Export CSV</button>
      </div>

      <div className="users-section">
        <h3>Registered Users with Roles ({filteredUsers.length})</h3>

        {filteredUsers.length === 0 ? (
          <p>No matching users found.</p>
        ) : (
          <>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ⬅ Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next ➡
              </button>
            </div>
            <button onClick={() => navigate('/home')}>
              Go to HomePage
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
