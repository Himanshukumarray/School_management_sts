import React from "react";

const Unauthorized: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
    </div>
  );
};

export default Unauthorized;
