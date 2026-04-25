"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2, Users, FileText, Loader2, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          // If not authorized, maybe redirect or show error
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          posts: prev.posts.filter((p: any) => p._id !== id)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-destructive/10 text-destructive rounded-2xl">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage posts and users across the platform.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "posts" ? "bg-primary text-white shadow-lg" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
        >
          <FileText size={20} /> Posts ({data.posts.length})
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "users" ? "bg-primary text-white shadow-lg" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
        >
          <Users size={20} /> Users ({data.users.length})
        </button>
      </div>

      <div className="glass-card rounded-3xl border overflow-hidden">
        {activeTab === "posts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/50 text-muted-foreground text-sm">
                <tr>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Author</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.posts.map((post: any) => (
                  <tr key={post._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{post.author?.name || "Unknown"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${post.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-500"}`}>
                        {post.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/50 text-muted-foreground text-sm">
                <tr>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="p-4">
                      {u.isAdmin ? (
                        <span className="px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary">ADMIN</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-bold rounded-md bg-secondary text-secondary-foreground">USER</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
