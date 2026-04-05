import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Member.css"; // Use your existing table styles

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { token } = useContext(AuthContext);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "manager",
    restaurant_id: ""
  });

  useEffect(() => {
    fetchMembers();
    fetchRestaurants();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/members`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMembers(data.members);
  };

  const fetchRestaurants = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/restaurants`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    // console.log(data);
    setRestaurants(data.data);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/members/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowForm(false);
      fetchMembers();
      setFormData({ name: "", email: "", role: "manager", restaurant_id: "" });
    }
  };

  const deleteMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      await fetch(`{process.env.REACT_APP_API_URL}/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
    }
  };

  return (
    <div className="member-list-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Staff Members Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? "Close" : "+ Add Staff Member"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddMember} className="member-form">
          <input type="text" placeholder="Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <select required onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="manager">Manager</option>
            <option value="chef">Chef</option>
          </select>

          <select required onChange={e => setFormData({...formData, restaurant_id: e.target.value})}>
            <option value="">Select Restaurant</option>
            {/* Add the ?. check here */}
            {restaurants?.map(rest => (
              <option key={rest.id} value={rest.id}>{rest.name}</option>
            ))}
          </select>

          <button type="submit">Save Member</button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Restaurant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members?.map(member => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td><span className={`badge ${member.role}`}>{member.role}</span></td>
              <td>{member.restaurant?.name || "N/A"}</td>
              <td>
                <button onClick={() => deleteMember(member.id)} className="btn-delete">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}