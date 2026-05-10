"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  HardDrive,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileCode,
  Plus,
} from "lucide-react";

interface BoxFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: string;
  createdAt: string;
}

interface BoxData {
  id: string;
  name: string;
  maxSizeMb: number;
  path: string;
}

export default function MyBoxPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [box, setBox] = useState<BoxData | null>(null);
  const [files, setFiles] = useState<BoxFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadBox = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/boxes");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setBox(data[0]);
          // Charger les fichiers de la box
          const filesRes = await fetch(`/api/files?location=BOX&boxId=${data[0].id}`);
          if (filesRes.ok) {
            setFiles(await filesRes.json());
          }
        }
      }
    } catch (err) {
      console.error("Erreur chargement box:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      void Promise.resolve().then(loadBox);
    }
  }, [status, router, loadBox]);

  const createBox = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/boxes", { method: "POST" });
      if (res.ok) {
        const newBox = await res.json();
        setBox(newBox);
      }
    } catch (err) {
      console.error("Erreur création box:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !box) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("location", "BOX");
      formData.append("boxId", box.id);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      if (res.ok) loadBox();
    } catch (err) {
      console.error("Erreur upload:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    try {
      const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) loadBox();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return FileImage;
    if (mimeType.startsWith("text/") || mimeType.includes("json")) return FileText;
    if (mimeType.includes("javascript") || mimeType.includes("typescript")) return FileCode;
    return File;
  };

  const formatSize = (bytes: string | number) => {
    const b = Number(bytes);
    if (b < 1024) return `${b} o`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} Ko`;
    return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const usedSize = files.reduce((acc, f) => acc + Number(f.sizeBytes), 0);
  const usedPercent = box ? (usedSize / (box.maxSizeMb * 1024 * 1024)) * 100 : 0;

  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-white">Ma Box</h1>
          <p className="mt-2 text-white/50">
            Votre espace de stockage personnel sur le VPS.
          </p>
        </div>

        {!box ? (
          <div className="card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 mb-4">
              <HardDrive className="h-8 w-8 text-violet-400" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white mb-2">
              Créer votre box
            </h2>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
              Votre espace de stockage personnel de 500 Mo pour stocker vos fichiers, configurations et documents.
            </p>
            <button
              onClick={createBox}
              disabled={creating}
              className="btn-violet rounded-xl px-6 py-3 text-sm font-semibold text-white flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              {creating ? "Création en cours..." : "Créer ma box"}
            </button>
          </div>
        ) : (
          <>
            {/* Storage bar */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">Espace utilisé</h3>
                  <p className="text-sm text-white/50">
                    {formatSize(usedSize)} sur {box.maxSizeMb} Mo
                  </p>
                </div>
                <div className="text-right">
                  <span className={`font-display text-xl font-bold ${usedPercent > 90 ? "text-red-400" : usedPercent > 70 ? "text-amber-400" : "text-violet-400"}`}>
                    {usedPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usedPercent > 90 ? "bg-red-500" : usedPercent > 70 ? "bg-amber-500" : "bg-gradient-to-r from-violet-600 to-violet-400"
                  }`}
                  style={{ width: `${Math.min(usedPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* File manager */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold text-white">Mes fichiers</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={loadBox}
                    disabled={loading}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </button>
                  <label className="btn-violet cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Envoi en cours..." : "Importer"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="mx-auto h-8 w-8 text-violet-400 animate-spin" />
                  <p className="mt-4 text-sm text-white/60">Chargement...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="py-12 text-center">
                  <FolderOpen className="mx-auto h-12 w-12 text-white/20" />
                  <p className="mt-4 text-sm text-white/60">Votre box est vide.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => {
                    const Icon = getFileIcon(file.mimeType);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/[0.03] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{file.name}</p>
                            <p className="text-xs text-white/40">
                              {formatSize(file.sizeBytes)} · {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`/api/files/${file.id}/download`}
                            className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5 hover:text-white transition-all"
                            title="Télécharger"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="rounded-lg border border-red-500/20 p-2 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
