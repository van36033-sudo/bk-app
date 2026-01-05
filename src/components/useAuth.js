import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(currentSession);
        setIsReady(true);
      }
    };

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isReady };
};
