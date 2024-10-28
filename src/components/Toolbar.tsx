// src/components/Toolbar.tsx
"use client";
import React from "react";

interface ToolbarProps {
  addField: (type: string) => void;
  savePdf: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ addField, savePdf }) => {
  return (
    <div className="mb-4 flex gap-2">
      <button onClick={() => addField("text")} className="btn btn-blue">
        Add Text Field
      </button>
      <button onClick={() => addField("signature")} className="btn btn-blue">
        Add Signature Field
      </button>
      <button onClick={savePdf} className="btn btn-green">
        Save PDF
      </button>
    </div>
  );
};

export default Toolbar;

// src/components/Toolbar.tsx
// import React from 'react';

// interface ToolbarProps {
//   addField: (type: string) => void;
//   savePdf: () => void;
// }

// const Toolbar: React.FC<ToolbarProps> = ({ addField, savePdf }) => {
//   return (
//     <div className="mb-4 flex gap-2">
//       <button onClick={() => addField('text')} className="btn btn-blue">Add Text Field</button>
//       <button onClick={() => addField('signature')} className="btn btn-blue">Add Signature</button>
//       <button onClick={savePdf} className="btn btn-green">Save PDF</button>
//     </div>
//   );
// };

// export default Toolbar;
