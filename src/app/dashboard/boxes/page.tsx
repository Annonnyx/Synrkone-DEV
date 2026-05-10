"use client";

import { useState, useEffect, useCallback } from "react";
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
  Shield,
  XCircle,
  FileText,
  Upload,
  Download,
  User,
  Lock,
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
    uploaderId: string;
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
  const [creatingForUser, setCreatingForUser] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [targetUserName, setTargetUserName] = useState("");
  const [allUsers, setAllUsers] = useState<Array<{id: string, name: string, email: string}>>([]);

  const loadBoxes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/boxes");
      if (res.ok) {
        const data = await res.json();
        // L'API retourne soit un array (admin/dev avec box) soit [] (dev sans box)
        // Si c'est un objet d'erreur, on ignore et on laisse boxes = []
        if (Array.isArray(data)) {
          setBoxes(data);
        } else if (data && data.error) {
          console.error("Erreur API boxes:", data.error);
          setBoxes([]);
        } else if (data) {
          setBoxes([data]);
        } else {
          setBoxes([]);
        }
      } else {
        console.error("Erreur HTTP boxes:", res.status);
        setBoxes([]);
      }
    } catch (err) {
      console.error("Erreur chargement boxes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllUsers = useCallback(async () => {
    if (!["ADMIN", "OWNER"].includes(session?.user?.role || "")) return;

    try {
      // Charger tous les utilisateurs sans box
      const res = await fetch("/api/users?withoutBox=true");
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
    }
  }, [session?.user?.role]);

  // Vérifier les permissions (DEV+) et charger les boxes
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    const userRole = session?.user?.role;
    if (!["DEV", "ADMIN", "OWNER"].includes(userRole || "")) {
      router.push("/dashboard");
      return;
    }
    // Defer the fetch (which calls setState) so it doesn't run synchronously
    // inside the effect body — satisfies react-hooks/set-state-in-effect.
    void Promise.resolve().then(loadBoxes);
  }, [status, session, router, loadBoxes]);

  // Charger les utilisateurs quand le modal s'ouvre pour les admins
  useEffect(() => {
    if (!showCreateModal) return;
    if (!["ADMIN", "OWNER"].includes(session?.user?.role || "")) return;
    void Promise.resolve().then(loadAllUsers);
  }, [showCreateModal, session, loadAllUsers]);

  const createBox = async (name: string) => {
    try {
      const body: { name: string; userId?: string } = { name };

      // Si admin crée pour un autre utilisateur
      if (creatingForUser && targetUserId) {
        body.userId = targetUserId;
      }

      const res = await fetch("/api/boxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setCreatingForUser(false);
        setTargetUserId("");
        setTargetUserName("");
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedBox) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("location", "BOX");
      formData.append("boxId", selectedBox.id);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        loadBoxes();
        // Recharger les détails de la box
        const updatedBoxes = await fetch("/api/boxes");
        if (updatedBoxes.ok) {
          const data = await updatedBoxes.json();
          const boxes = Array.isArray(data) ? data : (data ? [data] : []);
          const updatedBox = boxes.find(b => b.id === selectedBox?.id);
          if (updatedBox) setSelectedBox(updatedBox);
        }
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      console.error("Erreur upload fichier:", err);
      alert("Erreur lors de l'upload");
    } finally {
      setUploadingFile(false);
    }
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const res = await fetch(`/api/files/${fileId}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors du téléchargement");
      }
    } catch (err) {
      console.error("Erreur téléchargement fichier:", err);
      alert("Erreur lors du téléchargement");
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm("Supprimer ce fichier ?")) return;

    try {
      const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fileId }),
      });

      if (res.ok) {
        loadBoxes();
        // Recharger les détails de la box
        const updatedBoxes = await fetch("/api/boxes");
        if (updatedBoxes.ok) {
          const data = await updatedBoxes.json();
          const boxes = Array.isArray(data) ? data : (data ? [data] : []);
          const updatedBox = boxes.find(b => b.id === selectedBox?.id);
          if (updatedBox) setSelectedBox(updatedBox);
        }
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur suppression fichier:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const updateBoxSize = async (boxId: string, newSizeMb: number) => {
    try {
      const res = await fetch("/api/boxes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: boxId, maxSizeMb: newSizeMb }),
      });

      if (res.ok) {
        loadBoxes();
        // Recharger les détails de la box
        const updatedBoxes = await fetch("/api/boxes");
        if (updatedBoxes.ok) {
          const data = await updatedBoxes.json();
          const boxes = Array.isArray(data) ? data : (data ? [data] : []);
          const updatedBox = boxes.find(b => b.id === selectedBox?.id);
          if (updatedBox) setSelectedBox(updatedBox);
        }
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la mise à jour de la taille");
      }
    } catch (err) {
      console.error("Erreur mise à jour taille:", err);
      alert("Erreur lors de la mise à jour de la taille");
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
    return userRole === "OWNER" || userRole === "ADMIN" || box.userId === session?.user?.id;
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
          <h1 className="text-3xl font-semibold text-white">
            {["ADMIN", "OWNER"].includes(session?.user?.role || "") ? "Gestion des Boxes" : "Ma Box"}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {["ADMIN", "OWNER"].includes(session?.user?.role || "") 
              ? "Gérez toutes les boxes du système et créez-en pour les utilisateurs."
              : "Stockage personnel pour vos fichiers de développement."
            }
          </p>
        </div>
        <div className="flex gap-2">
          {["ADMIN", "OWNER"].includes(session?.user?.role || "") && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-violet rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Créer une box
            </button>
          )}
          {["DEV"].includes(session?.user?.role || "") && boxes.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-violet rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Créer ma box
            </button>
          )}
        </div>
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
            <h3 className="text-lg font-semibold text-white mb-4">
              {creatingForUser ? "Créer une box pour un utilisateur" : "Créer ma box"}
            </h3>
            <p className="text-sm text-white/60 mb-6">
              {creatingForUser 
                ? "Créez une box personnelle pour un utilisateur du système."
                : `Votre box personnelle vous donnera accès à ${session?.user?.role === "DEV" ? "500 Mo" : "1 Go"} 
                   de stockage pour vos fichiers de développement.`
              }
            </p>
            <div className="space-y-4">
              {/* Admin option to create for other users */}
              {["ADMIN", "OWNER"].includes(session?.user?.role || "") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white">
                    Créer pour
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCreatingForUser(false);
                        setTargetUserId("");
                        setTargetUserName("");
                      }}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        !creatingForUser
                          ? "bg-violet-500/20 border border-violet-500/50 text-violet-400"
                          : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                      }`}
                    >
                      Moi-même
                    </button>
                    <button
                      onClick={() => setCreatingForUser(true)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        creatingForUser
                          ? "bg-violet-500/20 border border-violet-500/50 text-violet-400"
                          : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                      }`}
                    >
                      Un utilisateur
                    </button>
                  </div>
                </div>
              )}

              {/* User selection for admins */}
              {creatingForUser && ["ADMIN", "OWNER"].includes(session?.user?.role || "") && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white">
                    Sélectionner l&apos;utilisateur
                  </label>
                  <select
                    value={targetUserId}
                    onChange={(e) => {
                      const user = allUsers.find(u => u.id === e.target.value);
                      setTargetUserId(e.target.value);
                      setTargetUserName(user?.name || "");
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Choisir un utilisateur...</option>
                    {allUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Nom de la box
                </label>
                <input
                  type="text"
                  id="boxName"
                  placeholder={creatingForUser ? `Box de ${targetUserName || "l'utilisateur"}` : "Ma Box Personnelle"}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/60/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreatingForUser(false);
                    setTargetUserId("");
                    setTargetUserName("");
                  }}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById("boxName") as HTMLInputElement;
                    const boxName = input.value || (creatingForUser 
                      ? `Box de ${targetUserName || "l'utilisateur"}`
                      : `Box de ${session?.user?.name}`
                    );
                    createBox(boxName);
                  }}
                  disabled={creatingForUser && !targetUserId}
                  className="flex-1 btn-violet rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="card max-w-4xl w-full mx-4 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-white">{selectedBox.name}</h3>
                {selectedBox.userId === session?.user?.id && (
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    Ma box
                  </span>
                )}
                {selectedBox.userId !== session?.user?.id && ["ADMIN", "OWNER"].includes(session?.user?.role || "") && (
                  <span className="px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedBox(null)}
                className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations
                </h4>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Propriétaire:</span>
                    <span className="text-white font-medium">{selectedBox.user.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Email:</span>
                    <span className="text-white font-medium text-xs">{selectedBox.user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Créée le:</span>
                    <span className="text-white font-medium">{new Date(selectedBox.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Modifiée le:</span>
                    <span className="text-white font-medium">{new Date(selectedBox.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Stockage */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Stockage
                </h4>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">Espace utilisé</span>
                    <span className="text-sm text-white font-medium">
                      {formatSize(getUsedSpace(selectedBox))} / {selectedBox.maxSizeMb} Mo
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all ${
                        getStoragePercentage(selectedBox) > 90 ? "bg-red-500" : getStoragePercentage(selectedBox) > 70 ? "bg-amber-500" : "bg-gradient-to-r from-violet-600 to-violet-400"
                      }`}
                      style={{ width: `${Math.min(getStoragePercentage(selectedBox), 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/60">
                    {getStoragePercentage(selectedBox).toFixed(1)}% utilisé
                  </div>
                </div>
              </div>

              {/* Admin/Owner Controls */}
              {canManageBox(selectedBox) && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {["ADMIN", "OWNER"].includes(session?.user?.role || "") ? "Contrôles Admin" : "Gestion"}
                  </h4>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
                    {/* Size Management */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Taille de la box (Mo)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={selectedBox.maxSizeMb}
                          placeholder="Taille en Mo"
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                            const newSize = parseInt(input.value);
                            if (newSize && newSize !== selectedBox.maxSizeMb) {
                              updateBoxSize(selectedBox.id, newSize);
                            }
                          }}
                          className="btn-violet rounded-lg px-3 py-2 text-sm font-semibold text-white"
                        >
                          Mettre à jour
                        </button>
                      </div>
                    </div>

                    {/* Owner Actions */}
                    {selectedBox.userId === session?.user?.id && (
                      <div className="pt-3 border-t border-white/10">
                        <h5 className="text-xs font-medium text-white mb-2">Actions propriétaire</h5>
                        <div className="space-y-2">
                          <button className="w-full flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all">
                            <Users className="h-4 w-4" />
                            Partager la box
                          </button>
                          <button className="w-full flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                            <Trash2 className="h-4 w-4" />
                            Supprimer ma box
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {selectedBox.userId !== session?.user?.id && ["ADMIN", "OWNER"].includes(session?.user?.role || "") && (
                      <div className="pt-3 border-t border-white/10">
                        <h5 className="text-xs font-medium text-white mb-2">Actions admin</h5>
                        <div className="space-y-2">
                          <button className="w-full flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-all">
                            <Lock className="h-4 w-4" />
                            Révoquer l&apos;accès
                          </button>
                          <button 
                            onClick={() => deleteBox(selectedBox.id)}
                            className="w-full flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer cette box
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-white">Fichiers ({selectedBox.files.length})</h4>
                  <label className="btn-violet rounded-lg px-3 py-1.5 text-xs font-semibold text-white cursor-pointer hover:bg-violet-600 transition-colors">
                    <Upload className="mr-1.5 h-3 w-3" />
                    Uploader un fichier
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                    />
                  </label>
                </div>

                {uploadingFile && (
                  <div className="mb-4 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent"></div>
                      <span className="text-sm text-violet-300">Upload en cours...</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {(Array.isArray(selectedBox.files) ? selectedBox.files : []).map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-white/40" />
                        <div>
                          <p className="text-sm text-white">{file.name}</p>
                          <p className="text-xs text-white/60">{formatSize(file.sizeBytes)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadFile(file.id, file.name)}
                          className="rounded p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Télécharger"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                        {(canManageBox(selectedBox) || file.uploaderId === session?.user?.id) && (
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="rounded p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
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
