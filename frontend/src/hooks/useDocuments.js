import { useEffect, useState } from "react";
import api from "../api/client";

// Normalise backend shape { id, name } → { doc_id, name } that components expect
function normalise(raw) {
  return (raw || []).map((d) => ({
    doc_id: d.id ?? d.doc_id,
    name: d.name ?? d.filename ?? "Unnamed",
  }));
}

export default function useDocuments() {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await api.get("/documents");
      setDocs(normalise(res.data));
    } catch (err) {
      console.error("fetchDocs failed:", err);
      setDocs([]);
    }
  };

  const uploadDoc = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/ingest", formData);
      await fetchDocs();
    } catch (err) {
      console.error("uploadDoc failed:", err);
      throw err;
    }
  };

  const deleteDoc = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((d) => d.doc_id !== id));
    } catch (err) {
      console.error("deleteDoc failed:", err);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchDocs);
  }, []);

  return { docs, uploadDoc, deleteDoc };
}
