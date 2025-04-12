export interface User {
    id: string;
    email: string;
    name: string;
    photoUrl?: string;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
} 