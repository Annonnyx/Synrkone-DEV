"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Server,
  Plus,
  Users,
  HardDrive,
  FolderOpen,
  Settings,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Upload,
  Download,
} from "lucide-react";

interface Box {
  id: string;
  name: string;
  path: string;
  maxSizeMb: number;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  files: Array<{
    id: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
    location: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function BoxesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Vérifier les permissions (DEV+)
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const userRole = session?.user?.role;
      if (!["DEV", "ADMIN", "OWNER"].includes(userRole || "")) {
        router.push("/dashboard");
        return;
      }
      loadBoxes();
    }
  }, [status, session, router]);

  const loadBoxes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/boxes");
      if (res.ok) {
        const data = await res.json();
        // L'API retourne soit un array (admin) soit un objet (dev)
        setBoxes(Array.isArray(data) ? data : (data ? [data] : []));
      }
    } catch (err) {
      console.error("Erreur chargement boxes:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBox = async (name: string) => {
    try {
      const res = await fetch("/api/boxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        loadBoxes();
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la création de la box");
      }
    } catch (err) {
      console.error("Erreur création box:", err);
      alert("Erreur lors de la création de la box");
    }
  };

  const deleteBox = async (boxId: string) => {
    if (!confirm("Supprimer cette box et tous ses fichiers ?")) return;
    
    try {
      const res = await fetch("/api/boxes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: boxId }),
      });

      if (res.ok) {
        loadBoxes();
        setSelectedBox(null);
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur suppression box:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const getUsedSpace = (box: Box) => {
    return box.files.reduce((total, file) => total + file.sizeBytes, 0);
  };

  const getStoragePercentage = (box: Box) => {
    const used = getUsedSpace(box);
    const max = box.maxSizeMb * 1024 * 1024;
    return (used / max) * 100;
  };

  const canManageBox = (box: Box) => {
    const userRole = session?.user?.role;
    return userRole === "OWNER" || box.userId === session?.user?.id;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="card p-12 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-violet-400 animate-spin" />
          <p className="mt-4 text-sm text-white/60">Chargement des boxes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Boxes Personnelles</h1>
          <p className="mt-1 text-sm text-white/50">
            Stockage personnel pour vos fichiers de développement.
          </p>
        </div>
        {["DEV", "ADMIN", "OWNER"].includes(session?.user?.role || "") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-violet rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Créer ma box
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Total boxes", value: boxes.length.toString(), icon: Server, color: "text-violet-400" },
          { 
            label: "Espace total utilisé", 
            value: `${(boxes.reduce((total, box) => total + getUsedSpace(box), 0) / (1024 * 1024)).toFixed(1)} Mo`, 
            icon: HardDrive, 
            color: "text-cyan-400" 
          },
          { 
            label: "Fichiers totaux", 
            value: boxes.reduce((total, box) => total + box.files.length, 0).toString(), 
            icon: FileText, 
            color: "text-emerald-400" 
          },
          { 
            label: "Espace disponible", 
            value: `${(boxes.reduce((total, box) => total + box.maxSizeMb, 0) - (boxes.reduce((total, box) => total + getUsedSpace(box), 0) / (1024 * 1024))).toFixed(0)} Mo`, 
            icon: Shield, 
            color: "text-amber-400" 
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <FolderOpen className="h-4 w-4 text-white/40" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Boxes Grid */}
      {boxes.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderOpen className="mx-auto h-16 w-16 text-white/20" />
          <h3 className="mt-4 text-lg font-semibold text-white">Aucune box</h3>
          <p className="mt-2 text-sm text-white/60">
            Créez votre box personnelle pour stocker vos fichiers de développement.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 btn-violet rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Créer ma box
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {boxes.map((box) => {
            const usedSpace = getUsedSpace(box);
            const storagePercentage = getStoragePercentage(box);
            const canManage = canManageBox(box);
            
            return (
              <div key={box.id} className="card p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{box.name}</h3>
                      <p className="text-xs text-white/60">Box de {box.user.name}</p>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBox(box)}
                        className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      {session?.user?.role === "OWNER" && (
                        <button
                          onClick={() => deleteBox(box.id)}
                          className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Storage usage */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Stockage utilisé</span>
                    <span className="text-xs text-white">
                      {formatSize(usedSpace)} / {box.maxSizeMb} Mo
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        storagePercentage > 90 ? "bg-red-500" : storagePercentage > 70 ? "bg-amber-500" : "bg-gradient-to-r from-violet-600 to-violet-400"
                      }`}
                      style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Files count */}
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-3 w-3 text-white/40" />
                  <span className="text-xs text-white/60">
                    {box.files.length} fichier{box.files.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBox(box)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <FolderOpen className="h-3 w-3" />
                    Explorer
                  </button>
                  {canManage && (
                    <button
                      onClick={() => setSelectedBox(box)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Upload className="h-3 w-3" />
                      Gérer les fichiers
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Box Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Créer ma box</h3>
            <p className="text-sm text-white/60 mb-6">
              Votre box personnelle vous donnera accès à {session?.user?.role === "DEV" ? "500 Mo" : "1 Go"} 
              de stockage pour vos fichiers de développement.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Nom de la box
                </label>
                <input
                  type="text"
                  id="boxName"
                  placeholder="Ma Box Personnelle"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/60/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById("boxName") as HTMLInputElement;
                    createBox(input.value || `Box de ${session?.user?.name}`);
                  }}
                  className="flex-1 btn-violet rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Box Details Modal */}
      {selectedBox && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedBox.name}</h3>
              <button
                onClick={() => setSelectedBox(null)}
                className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Informations</h4>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Propriétaire:</span>
                      <span className="ml-2 text-white">{selectedBox.user.name}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Email:</span>
                      <span className="ml-2 text-white">{selectedBox.user.email}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Créée le:</span>
                      <span className="ml-2 text-white">{new Date(selectedBox.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Modifiée le:</span>
                      <span className="ml-2 text-white">{new Date(selectedBox.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Stockage</h4>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">Espace utilisé</span>
                    <span className="text-sm text-white">
                      {formatSize(getUsedSpace(selectedBox))} / {selectedBox.maxSizeMb} Mo
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        getStoragePercentage(selectedBox) > 90 ? "bg-red-500" : getStoragePercentage(selectedBox) > 70 ? "bg-amber-500" : "bg-gradient-to-r from-violet-600 to-violet-400"
                      }`}
                      style={{ width: `${Math.min(getStoragePercentage(selectedBox), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Fichiers ({selectedBox.files.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedBox.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-white/40" />
                        <div>
                          <p className="text-sm text-white">{file.name}</p>
                          <p className="text-xs text-white/60">{formatSize(file.sizeBytes)}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {selectedBox.files.length === 0 && (
                    <p className="text-sm text-white/40 text-center py-4">Aucun fichier dans cette box</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
