import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api"; // Ensure this path is correct
import "../../css/OrdersEdit.css"; 

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

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="user-list-container">
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
        Editing Order ID: {id}
      </h2>
      
      <div className="order-edit-card">
        <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
        <p><strong>Item Name:</strong> {order.item_name || 'N/A'}</p>
        <p><strong>Quantity:</strong> {order.item_qty}</p>
        <p><strong>Total Price:</strong> <span style={{color: '#28a745', fontWeight: 'bold'}}>₹{order.total_price}</span></p>

        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <label><strong>Order Status:</strong></label>
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