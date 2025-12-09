import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Clock, BarChart3, TrendingUp, Zap } from "lucide-react";
import { signInWithRedirect } from "firebase/auth";
import { auth } from "../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export default function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ Track auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsPending(false);
    });
  }, []);

  // ✅ Safe Google Login
  const handleGoogleLogin = async () => {
    if (loading) return; // prevent double popup
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code !== "auth/cancelled-popup-request") {
        alert(err.message || "Google login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto redirect after login
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Loading screen while checking auth
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin">
          <Clock className="w-10 h-10 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl mb-6">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            TimeFlow
          </h1>
          <p className="text-slate-600 text-lg">
            Master your time with AI-powered analytics
          </p>
        </div>

        {/* Feature Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Visual Analytics</h3>
                <p className="text-sm text-slate-600">Beautiful charts and insights</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Track Progress</h3>
                <p className="text-sm text-slate-600">Monitor your daily activities</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">24-Hour Limit</h3>
                <p className="text-sm text-slate-600">Stay within your daily budget</p>
              </div>
            </div>
          </div>

          {/* ✅ Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-600">
          Secure authentication powered by Firebase Google Auth
        </p>
      </div>
    </div>
  );
}
