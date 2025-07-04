"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
          console.log('🔄 Usuario cerró sesión, limpiando estado');
          setUser(null);
          setIsSigningOut(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (isSigningOut) {
      console.log('⚠️ Logout ya en progreso, ignorando llamada adicional');
      return;
    }

    try {
      console.log('🚪 Iniciando proceso de logout...');
      setIsSigningOut(true);
      
      // Limpiar el estado del usuario inmediatamente
      setUser(null);
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error al cerrar sesión en Supabase:', error);
        // Aún así, intentar redirigir
        window.location.href = '/';
        return;
      }
      
      console.log('✅ Logout exitoso');
      
      // Usar setTimeout para asegurar que el estado se actualice antes de redirigir
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('❌ Error inesperado al cerrar sesión:', error);
      // En caso de error, forzar la redirección
      window.location.href = '/';
    } finally {
      // Resetear el estado de signing out después de un tiempo
      setTimeout(() => {
        setIsSigningOut(false);
      }, 2000);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, signOut, isSigningOut }}>
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