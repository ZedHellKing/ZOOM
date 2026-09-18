import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { MoviesPage, TVPage, AnimePage } from '@/pages/ListingPage';
import { DetailPage } from '@/pages/DetailPage';
import { WatchPage } from '@/pages/WatchPage';
import { LoginPage, SignupPage } from '@/pages/AuthPages';
import { PremiumPage } from '@/pages/PremiumPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tv" element={<TVPage />} />
              <Route path="/anime" element={<AnimePage />} />
              <Route path="/movie/:id" element={<DetailPage />} />
              <Route path="/tv/:id" element={<DetailPage />} />
              <Route path="/anime/:id" element={<DetailPage />} />
              <Route path="/watch/:type/:id" element={<WatchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
