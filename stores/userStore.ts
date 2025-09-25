// stores/userStore.ts
import { BROWSER_SECRET } from '@/constant/apiUrl';
import { User, UserRole } from '@/constant/types';
import { EditorPermission, Permission } from '@/constant/permissions';
import { decrypt, encrypt } from '@/utils/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Cookies from "js-cookie";

const SECRET = BROWSER_SECRET;

// Function to get permissions based on role
const getPermissionsByRole = (role: UserRole): string[] => {
  switch (role) {
    case UserRole.ADMIN:
      // Admin gets all permissions
      return Object.values(Permission);
    case UserRole.EDITOR:
      // Editor gets predefined permissions from EditorPermission array
      return EditorPermission;
    default:
      return [];
  }
};


interface UserState {
  user: User | null;
  userPermissions: string[];
  setPermissions: (permissions: string[]) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      userPermissions: [],
      setUser: (user) => {
        // When setting user, automatically set permissions based on role
        const permissions = user.role ? getPermissionsByRole(user.role) : [];
        set({ user, userPermissions: permissions });
      },
      setPermissions: (permissions) => set({ userPermissions: permissions }),
      clearUser: () => set({ user: null, userPermissions: [] }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const stored = Cookies.get(name);
          if (!stored) return null;
          const decrypted = await decrypt(stored, SECRET);
          return JSON.parse(decrypted);
        },
        setItem: async (name, value) => {
          const stringValue = JSON.stringify(value);
          const encrypted = await encrypt(stringValue, SECRET);
          Cookies.set(name, encrypted);
        },
        removeItem: async (name) => Cookies.remove(name),
      })),
    }
  )
);