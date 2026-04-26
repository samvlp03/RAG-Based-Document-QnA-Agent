import { useEffect, useState, useCallback } from "react";
import api from "../api/client";

function normalise(raw) {
  return (raw || []).map((d) => ({
    doc_id: d.id ?? d.doc_id,
    name: d.name ?? d.filename ?? "Unnamed",
  }));
}

export default function useDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await api.get("/documents");
      setDocs(normalise(res.data));
    } catch (err) {
      console.error("fetchDocs:", err);
      setDocs([]);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const uploadDoc = useCallback(
    async (file) => {
      setLoading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await api.post("/ingest", form);
        await fetchDocs();
        return res.data;
      } catch (err) {
        console.error("uploadDoc:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDocs],
  );

  const deleteDoc = useCallback(async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((d) => d.doc_id !== id));
    } catch (err) {
      console.error("deleteDoc:", err);
    }
  }, []);

  return { docs, loading, uploadDoc, deleteDoc };
}
