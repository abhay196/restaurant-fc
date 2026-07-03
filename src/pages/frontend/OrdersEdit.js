import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api"; // Ensure this path is correct
import "../../css/Admin.css"; 

function OrdersEdit() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Immediate Status Update Function
  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      alert("Status updated successfully!");
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (!order) return <div className="user-list-container"><p className="error-message">Order not found.</p></div>;

  return (
    <div className="user-list-container">
      <div className="list-header">
        <h2 className="list-heading">Edit Order Details</h2>
      </div>
      
      <div className="order-edit-card">
        <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', margin: '0 0 20px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          Order ID: #{id}
        </h3>
        
        <p><strong>Customer:</strong> <span>{order.user?.name || 'N/A'}</span></p>
        <p><strong>Item Name:</strong> <span>{order.item_name || 'N/A'}</span></p>
        <p><strong>Quantity:</strong> <span>{order.item_qty}</span></p>
        <p><strong>Total Price:</strong> <span style={{color: 'var(--success)'}}>₹{order.total_price}</span></p>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Order Status</label>
          <select 
            className="order-status-select"
            value={order.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default OrdersEdit;