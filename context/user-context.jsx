"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener sesión inicial:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Obtener datos del usuario desde la base de datos
          const { data: userData, error: userError } = await supabase
            .from('usuario')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error al obtener datos del usuario:', userError);
            setUser({ id: session.user.id, email: session.user.email, role: null });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: userData.rol,
              name: userData.nombre || session.user.email,
              ...userData
            });
          }
        }
      } catch (error) {
        console.error('Error en getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Obtener datos del usuario desde la base de datos
          const { data: userData, error: userError } = await supabase
            .from('usuario')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error al obtener datos del usuario:', userError);
            setUser({ id: session.user.id, email: session.user.email, role: null });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: userData.rol,
              name: userData.nombre || session.user.email,
              ...userData
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
      } else {
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
}