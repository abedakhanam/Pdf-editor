// src/components/PdfViewer.tsx
"use client";

import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="relative overflow-auto max-h-screen p-4 border rounded-md">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${
          process.env.REACT_APP_PDFJS_VERSION || "2.16.105"
        }/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
