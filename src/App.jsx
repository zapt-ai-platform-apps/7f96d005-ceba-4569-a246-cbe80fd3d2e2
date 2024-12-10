import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          setUser(session.user);
          setCurrentPage('homePage');
        } else {
          setUser(null);
          setCurrentPage('login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show when={currentPage() === 'homePage'} fallback={<Login />}>
        <HomePage />
      </Show>
    </div>
  );
}

export default App;