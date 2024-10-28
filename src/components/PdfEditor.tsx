// src/components/PdfEditor.tsx

"use client";

import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import SignatureField from "./SignatureField";
import { PDFDocument, rgb } from "pdf-lib";
import { Worker } from "@react-pdf-viewer/core";
import { saveAs } from "file-saver";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  FIELD: "field",
};

interface FieldProps {
  id: string;
  type: string;
  x: number;
  y: number;
  content?: string | null;
}

const DraggableField: React.FC<FieldProps & {
  onMove: (id: string, deltaX: number, deltaY: number) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}> = ({ id, type, x, y, content, onMove, onUpdate, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FIELD,
    item: { id, x, y },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        onMove(id, delta.x, delta.y);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        top: y,
        left: x,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "4px",
        backgroundColor: type === "Signature" ? "blue" : "yellow",
        color: "white",
        zIndex: 10,
      }}
    >
      <button
        onClick={() => onDelete(id)}
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
      {type === "Signature" ? (
        <SignatureField onSign={(sign) => onUpdate(id, sign)} />
      ) : (
        <input
          type="text"
          value={content || ""}
          onChange={(e) => onUpdate(id, e.target.value)}
          className="bg-transparent border-b border-white text-white"
        />
      )}
    </div>
  );
};

const PdfEditor = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldProps[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setFileUrl(fileURL);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const addField = (type: string) => {
    const id = `${type}-${fields.length}`;
    const newField: FieldProps = { id, type, x: 50, y: 50, content: type === "Date" ? new Date().toLocaleDateString() : null };
    setFields((prevFields) => [...prevFields, newField]);
  };

  const moveField = (id: string, deltaX: number, deltaY: number) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, x: field.x + deltaX, y: field.y + deltaY } : field
      )
    );
  };

  const updateFieldContent = (id: string, content: string) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const deleteField = (id: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const saveDocument = async () => {
    if (!fileUrl) return;

    const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    for (const field of fields) {
      if (field.type === "Signature" && field.content) {
        const img = await pdfDoc.embedPng(field.content);
        const { width, height } = img.scale(0.5);

        page.drawImage(img, {
          x: field.x,
          y: page.getHeight() - field.y - height,
          width,
          height,
        });
      } else if (field.type === "Date" && field.content) {
        page.drawText(field.content, {
          x: field.x,
          y: page.getHeight() - field.y - 20,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes]), "edited-document.pdf");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
        <button onClick={() => addField("Signature")} className="mr-2">Add Signature</button>
        <button onClick={() => addField("Date")} className="mr-2">Add Date</button>
        <button onClick={saveDocument} className="btn btn-green">Save PDF</button>

        {fileUrl ? (
          <div className="relative overflow-auto max-h-screen border rounded-md">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
              <PdfViewer fileUrl={fileUrl} />
              {fields.map((field) => (
                <DraggableField
                  key={field.id}
                  {...field}
                  onMove={moveField}
                  onUpdate={updateFieldContent}
                  onDelete={deleteField}
                />
              ))}
            </Worker>
          </div>
        ) : (
          <p>Please upload a PDF to view it.</p>
        )}
      </div>
    </DndProvider>
  );
};

export default PdfEditor;


// src/components/PdfEditor.tsx

// "use client";

// import React, { useState, useRef } from "react";
// import PdfViewer from "./PdfViewer";
// import { PDFDocument, rgb } from "pdf-lib";
// import Draggable from "react-draggable";
// import Toolbar from "./Toolbar";

// const PdfEditor = () => {
//   const [fileUrl, setFileUrl] = useState<string | null>(null);
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
//       setFileUrl(URL.createObjectURL(file));
//     }
//   };

//   // Add a Field
//   const addField = (type: string) => {
//     setFieldPositions([
//       ...fieldPositions,
//       { type, x: 50, y: 50, page: 0, value: type === "text" ? "Text" : "Sign" },
//     ]);
//   };

//   // Save PDF with Fields
//   const savePdf = async () => {
//     if (pdfDoc) {
//       const pages = pdfDoc.getPages();

//       fieldPositions.forEach((field) => {
//         const page = pages[field.page];
//         if (field.type === "text") {
//           page.drawText(field.value, {
//             x: field.x,
//             y: field.y,
//             size: 12,
//             color: rgb(0, 0, 0),
//           });
//         } else if (field.type === "signature") {
//           page.drawText("Sign Here", {
//             x: field.x,
//             y: field.y,
//             size: 12,
//             color: rgb(0, 0, 1), // Blue text for signatures
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

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">PDF Editor</h1>
//       <input type="file" onChange={loadPdf} className="mb-4" />

//       <Toolbar addField={addField} savePdf={savePdf} />

//       {fileUrl && (
//         <div className="relative overflow-auto max-h-screen border rounded-md">
//           <PdfViewer fileUrl={fileUrl} />
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
//                   <input
//                     type="text"
//                     defaultValue={field.value}
//                     className="p-1"
//                     onChange={(e) => {
//                       const updatedFields = [...fieldPositions];
//                       updatedFields[index].value = e.target.value;
//                       setFieldPositions(updatedFields);
//                     }}
//                   />
//                 )}
//                 {field.type === "signature" && (
//                   <div className="p-1 bg-gray-200 rounded">
//                     <button disabled className="text-gray-500">Sign</button>
//                   </div>
//                 )}
//               </div>
//             </Draggable>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PdfEditor;

