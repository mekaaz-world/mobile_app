import { useState } from 'react';

type UserRole = 'patient' | 'family' | null;

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const setRole = (role: UserRole) => {
    setUserRole(role);
    // In a real app, store this in AsyncStorage
  };

  return { userRole, setRole };
}