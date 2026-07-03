import React from "react";
import SafeImage from "./SafeImage";

export default function CartItem({ item }) {

   return (
    <div className="cart-item">
      <SafeImage
        src={item.image}
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
