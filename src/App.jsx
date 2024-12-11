import { createSignal, onMount, createEffect, Show, ErrorBoundary } from 'solid-js';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import HomePage from './components/HomePage';
import * as Sentry from '@sentry/browser';

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
    <ErrorBoundary
      fallback={(err, reset) => {
        console.error('ErrorBoundary caught an error:', err);
        Sentry.captureException(err);
        return (
          <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
              <p class="mb-4 text-red-600">An unexpected error occurred.</p>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                onClick={reset}
              >
                Retry
              </button>
            </div>
          </div>
        );
      }}
    >
      <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
        <Show when={currentPage() === 'homePage'} fallback={<Login />}>
          <HomePage />
        </Show>
      </div>
    </ErrorBoundary>
  );
}

export default App;