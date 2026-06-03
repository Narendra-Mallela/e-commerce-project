import React from "react";

export default function StatusMessage({ title, message }) {
  return (
    <div className="status-message">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
