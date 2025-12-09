import { useAuth } from "@getmocha/users-service/react";
import { LogOut, Clock } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TimeFlow
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.google_user_data.picture && (
                  <img
                    src={user.google_user_data.picture}
                    alt={user.google_user_data.name || "User"}
                    className="w-8 h-8 rounded-full border-2 border-indigo-100"
                  />
                )}
                <span className="text-sm font-medium text-slate-700">
                  {user.google_user_data.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
