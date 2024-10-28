// src/components/SignatureField.tsx
import React, { forwardRef } from "react";

const SignatureField = forwardRef(({ onSign }: { onSign: (sign: string) => void }, ref) => {
  const handleSign = () => {
    // Create a canvas for the signature
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 100;

    // Customize signature appearance
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Background for signature
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Signature", 20, 50); // Placeholder text
    }

    const signedData = canvas.toDataURL("image/png");
    onSign(signedData); // Pass data URL back to parent component
  };

  return (
    <div
      ref={ref}
      onClick={handleSign}
      style={{
        cursor: "pointer",
        border: "1px solid #000",
        padding: "10px",
        backgroundColor: "blue",
        textAlign: "center",
      }}
    >
      Click to sign
    </div>
  );
});

export default SignatureField;