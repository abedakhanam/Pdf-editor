// src/components/PdfEditor.tsx

"use client";

import React, { useState, useRef } from "react";
import PdfViewer from "./PdfViewer";
import { PDFDocument, rgb } from "pdf-lib";
import Draggable from "react-draggable";
import Toolbar from "./Toolbar";

const PdfEditor = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [fieldPositions, setFieldPositions] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load PDF
  const loadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const loadedDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(loadedDoc);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  // Add a Field
  const addField = (type: string) => {
    setFieldPositions([
      ...fieldPositions,
      { type, x: 50, y: 50, page: 0, value: type === "text" ? "Text" : "Sign" },
    ]);
  };

  // Save PDF with Fields
  const savePdf = async () => {
    if (pdfDoc) {
      const pages = pdfDoc.getPages();

      fieldPositions.forEach((field) => {
        const page = pages[field.page];
        if (field.type === "text") {
          page.drawText(field.value, {
            x: field.x,
            y: field.y,
            size: 12,
            color: rgb(0, 0, 0),
          });
        } else if (field.type === "signature") {
          page.drawText("Sign Here", {
            x: field.x,
            y: field.y,
            size: 12,
            color: rgb(0, 0, 1), // Blue text for signatures
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "modified.pdf";
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
      <input type="file" onChange={loadPdf} className="mb-4" />

      <Toolbar addField={addField} savePdf={savePdf} />

      {fileUrl && (
        <div className="relative overflow-auto max-h-screen border rounded-md">
          <PdfViewer fileUrl={fileUrl} />
          {fieldPositions.map((field, index) => (
            <Draggable
              key={index}
              position={{ x: field.x, y: field.y }}
              onStop={(e, data) => {
                const updatedFields = [...fieldPositions];
                updatedFields[index].x = data.x;
                updatedFields[index].y = data.y;
                setFieldPositions(updatedFields);
              }}
            >
              <div className="absolute bg-yellow-200 p-2 cursor-move">
                {field.type === "text" && (
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="p-1"
                    onChange={(e) => {
                      const updatedFields = [...fieldPositions];
                      updatedFields[index].value = e.target.value;
                      setFieldPositions(updatedFields);
                    }}
                  />
                )}
                {field.type === "signature" && (
                  <div className="p-1 bg-gray-200 rounded">
                    <button disabled className="text-gray-500">Sign</button>
                  </div>
                )}
              </div>
            </Draggable>
          ))}
        </div>
      )}
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

