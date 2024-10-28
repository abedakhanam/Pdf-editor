// src/components/PdfEditor.tsx
"use client";

import React, { useState } from "react";
import PdfViewer from "./PdfViewer";

const PdfEditor = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {fileUrl && <PdfViewer fileUrl={fileUrl} />}
    </div>
  );
};

export default PdfEditor;

// "use client";

// import React, { useRef, useState } from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// import { Document, Page } from "react-pdf"; // Updated import for react-pdf
// import Draggable from "react-draggable";
// import Toolbar from "./Toolbar";

// const PdfEditor = () => {
//   const [pdfFile, setPdfFile] = useState<string | null>(null);
//   const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
//   const [fieldPositions, setFieldPositions] = useState<any[]>([]);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // Load PDF
//   const loadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const arrayBuffer = await file.arrayBuffer();
//       const loadedDoc = await PDFDocument.load(arrayBuffer);
//       setPdfDoc(loadedDoc);
//       setPdfFile(URL.createObjectURL(file));
//     }
//   };

//   // Save PDF
//   const savePdf = async () => {
//     if (pdfDoc) {
//       fieldPositions.forEach((field) => {
//         if (field.type === "text") {
//           const page = pdfDoc.getPage(field.page);
//           page.drawText(field.value, {
//             x: field.x,
//             y: field.y,
//             size: 12,
//             color: rgb(0, 0, 0),
//           });
//         }
//       });
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "modified.pdf";
//       link.click();
//     }
//   };

//   const addField = (type: string) => {
//     setFieldPositions([
//       ...fieldPositions,
//       { type, x: 50, y: 50, page: 0, value: type },
//     ]);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={loadPdf}
//         className="mb-4"
//       />
//       <Toolbar addField={addField} savePdf={savePdf} />

//       {pdfFile && (
//         <div style={{ position: "relative" }}>
//           <Document file={pdfFile}>
//             <Page pageNumber={1} />
//           </Document>
//           {fieldPositions.map((field, index) => (
//             <Draggable
//               key={index}
//               position={{ x: field.x, y: field.y }}
//               onStop={(e, data) => {
//                 const updatedFields = [...fieldPositions];
//                 updatedFields[index].x = data.x;
//                 updatedFields[index].y = data.y;
//                 setFieldPositions(updatedFields);
//               }}
//             >
//               <div className="absolute bg-yellow-200 p-2 cursor-move">
//                 {field.type === "text" && (
//                   <input type="text" defaultValue="Text" />
//                 )}
//                 {field.type === "signature" && <button>Sign</button>}
//               </div>
//             </Draggable>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PdfEditor;

// // src/components/PdfEditor.tsx
// "use client";

// import React, { useRef, useState } from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// // import { Worker, Viewer } from '@react-pdf-viewer/core';
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import Draggable from "react-draggable";
// import Toolbar from "./Toolbar";
// import dynamic from "next/dynamic";

// const Viewer = dynamic(
//   () => import("@react-pdf-viewer/core").then((mod) => mod.Viewer),
//   { ssr: false }
// );
// const Worker = dynamic(
//   () => import("@react-pdf-viewer/core").then((mod) => mod.Worker),
//   { ssr: false }
// );

// const PdfEditor = () => {
//   const [pdfFile, setPdfFile] = useState<string | null>(null);
//   const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
//   const [fieldPositions, setFieldPositions] = useState<any[]>([]);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // Load PDF
//   const loadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const arrayBuffer = await file.arrayBuffer();
//       const loadedDoc = await PDFDocument.load(arrayBuffer);
//       setPdfDoc(loadedDoc);
//       setPdfFile(URL.createObjectURL(file));
//     }
//   };

//   // Save PDF
//   const savePdf = async () => {
//     if (pdfDoc) {
//       fieldPositions.forEach((field) => {
//         if (field.type === "text") {
//           const page = pdfDoc.getPage(field.page);
//           page.drawText(field.value, {
//             x: field.x,
//             y: field.y,
//             size: 12,
//             color: rgb(0, 0, 0),
//           });
//         }
//       });
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "modified.pdf";
//       link.click();
//     }
//   };

//   const addField = (type: string) => {
//     setFieldPositions([
//       ...fieldPositions,
//       { type, x: 50, y: 50, page: 0, value: type },
//     ]);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={loadPdf}
//         className="mb-4"
//       />
//       <Toolbar addField={addField} savePdf={savePdf} />

//       {pdfFile && (
//         <div style={{ position: "relative" }}>
//           <Worker
//             workerUrl={`https://unpkg.com/pdfjs-dist@${
//               process.env.REACT_APP_PDFJS_VERSION || "2.6.347"
//             }/build/pdf.worker.min.js`}
//           >
//             <Viewer fileUrl={pdfFile} />
//           </Worker>
//           {fieldPositions.map((field, index) => (
//             <Draggable
//               key={index}
//               position={{ x: field.x, y: field.y }}
//               onStop={(e, data) => {
//                 const updatedFields = [...fieldPositions];
//                 updatedFields[index].x = data.x;
//                 updatedFields[index].y = data.y;
//                 setFieldPositions(updatedFields);
//               }}
//             >
//               <div className="absolute bg-yellow-200 p-2 cursor-move">
//                 {field.type === "text" && (
//                   <input type="text" defaultValue="Text" />
//                 )}
//                 {field.type === "signature" && <button>Sign</button>}
//               </div>
//             </Draggable>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PdfEditor;
