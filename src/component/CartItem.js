import React from "react";

export default function CartItem({ item }) {

   return (
    <div className="cart-item">
      <img
        src={`http://127.0.0.1:8000/storage/${item.image}`}
        alt={item.item_name}
        className="item-img"
      />

      <div className="item-details">
        <h4>{item.item_name}</h4>
        <p>{item.item_description}</p>
        <p>Price: ₹{item.price}</p>
        <p>Qty: {item.qty}</p>
      </div>
    </div>
  );
}
