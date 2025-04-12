import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Interactions from "./pages/Interactions";
import Network from "./pages/Network";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const cookies = document.cookie;
    console.log('All cookies:', cookies);
    
    // Check if we're on the login page
    if (window.location.pathname === '/login') {
        return <>{children}</>;
    }
    
    // Check for token
    if (!cookies || cookies.length === 0) {
        console.log('No cookies found, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <UserProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<HomePage />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Dashboard />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/contacts"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Contacts />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/interactions"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Interactions />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/network"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Network />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/insights"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Insights />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Settings />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </UserProvider>
    </QueryClientProvider>
);

export default App;
