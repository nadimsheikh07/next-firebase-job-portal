import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/guards/AuthGuard";

export default function AdminDashboardLayout({ children }) {
    return (
        <AuthProvider>
            <AuthGuard>
                {children}
            </AuthGuard>
        </AuthProvider>
    );
}
