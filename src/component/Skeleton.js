// src/component/SkeletonCard.js
import React from "react";
import "../css/Skeleton.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image pulse"></div>
      <div className="skeleton-info">
        <div className="skeleton-text skeleton-title pulse"></div>
        <div className="skeleton-text skeleton-subtitle pulse"></div>
        <div className="skeleton-text skeleton-badge pulse"></div>
      </div>
    </div>
  );
}