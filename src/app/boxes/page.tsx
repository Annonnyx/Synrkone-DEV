"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  HardDrive,
  Users,
  Trash2,
  RefreshCw,
  FolderOpen,
  File,
  Shield,
  Crown,
} from "lucide-react";

interface BoxFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: string;
  createdAt: string;
}

interface BoxUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface BoxData {
  id: string;
  name: string;
  maxSizeMb: number;
  path: string;
  userId: string;
  createdAt: string;
  user: BoxUser;
  files: BoxFile[];
}

export default function BoxesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBox, setSelectedBox] = useState<BoxData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadBoxes();
  }, [status, router]);

  const loadBoxes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/boxes");
      if (res.ok) {
        const data = await res.json();
        setBoxes(data);
      } else if (res.status === 403) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Erreur chargement boxes:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadBoxFiles = async (boxId: string) => {
    try {
      const res = await fetch(`/api/files?location=BOX&boxId=${boxId}`);
      if (res.ok) {
        const files = await res.json();
        setSelectedBox((prev) => (prev ? { ...prev, files } : null));
      }
    } catch (err) {
      console.error("Erreur chargement fichiers:", err);
    }
  };

  const deleteBox = async (id: string) => {
    if (!confirm("Supprimer cette box et tous ses fichiers ? Cette action est irréversible.")) return;
    try {
      const res = await fetch("/api/boxes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        loadBoxes();
        if (selectedBox?.id === id) setSelectedBox(null);
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const formatSize = (bytes: string | number) => {
    const b = Number(bytes);
    if (b < 1024) return `${b} o`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} Ko`;
    return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const totalStorage = boxes.reduce((acc, box) => {
    return acc + box.files?.reduce((facc, f) => facc + Number(f.sizeBytes), 0) || 0;
  }, 0);

  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl font-semibold text-white">Boxes</h1>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400 border border-amber-500/20">
                Admin
              </span>
            </div>
            <p className="text-white/50">
              Gestion des boxes personnelles de tous les développeurs.
            </p>
          </div>
          <button
            onClick={loadBoxes}
            disabled={loading}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <HardDrive className="h-5 w-5 text-violet-400" />
              <span className="text-sm text-white/60">Stockage total</span>
            </div>
            <p className="font-display text-2xl font-bold text-white">{formatSize(totalStorage)}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-cyan-400" />
              <span className="text-sm text-white/60">Boxes actives</span>
            </div>
            <p className="font-display text-2xl font-bold text-white">{boxes.length}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-white/60">Quota moyen</span>
            </div>
            <p className="font-display text-2xl font-bold text-white">
              {boxes.length > 0 ? (boxes[0].maxSizeMb * boxes.length) / boxes.length : 0} Mo
            </p>
          </div>
        </div>

        {/* Boxes grid */}
        {loading ? (
          <div className="card p-12 text-center">
            <RefreshCw className="mx-auto h-8 w-8 text-violet-400 animate-spin" />
            <p className="mt-4 text-sm text-white/60">Chargement...</p>
          </div>
        ) : boxes.length === 0 ? (
          <div className="card p-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-sm text-white/60">Aucune box pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boxes.map((box) => {
              const usedSize = box.files?.reduce((acc, f) => acc + Number(f.sizeBytes), 0) || 0;
              const usedPercent = (usedSize / (box.maxSizeMb * 1024 * 1024)) * 100;

              return (
                <div
                  key={box.id}
                  className="card p-5 cursor-pointer transition-all hover:border-violet-500/30"
                  onClick={() => {
                    setSelectedBox(box);
                    loadBoxFiles(box.id);
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{box.name}</p>
                      <p className="text-xs text-white/40 truncate">{box.user.email ?? "Sans email"}</p>
                    </div>
                    {session?.user?.role === "OWNER" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBox(box.id);
                        }}
                        className="rounded-lg border border-red-500/20 p-2 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        title="Supprimer la box"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">{formatSize(usedSize)} utilisés</span>
                      <span className={`${usedPercent > 90 ? "text-red-400" : "text-white/60"}`}>
                        {usedPercent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          usedPercent > 90 ? "bg-red-500" : "bg-violet-500"
                        }`}
                        style={{ width: `${Math.min(usedPercent, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/30">
                      {box.files?.length ?? 0} fichiers · Quota {box.maxSizeMb} Mo
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Box detail modal */}
        {selectedBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedBox(null)}
            />
            <div className="relative card p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{selectedBox.name}</h3>
                  <p className="text-sm text-white/50">
                    {selectedBox.user.name ?? selectedBox.user.email ?? "Utilisateur inconnu"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBox(null)}
                  className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5 hover:text-white transition-all"
                >
                  Fermer
                </button>
              </div>

              {selectedBox.files?.length === 0 ? (
                <div className="py-8 text-center">
                  <FolderOpen className="mx-auto h-12 w-12 text-white/20" />
                  <p className="mt-4 text-sm text-white/60">Cette box est vide.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedBox.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <File className="h-4 w-4 text-violet-400" />
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-white/40">
                            {formatSize(file.sizeBytes)} · {new Date(file.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`/api/files/${file.id}/download`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 hover:text-white transition-all"
                      >
                        Télécharger
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
