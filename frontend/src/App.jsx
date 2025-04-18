import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SeriesPage from './pages/SeriesPage';
import AnimePage from './pages/AnimePage';
import MoviesPage from './pages/MoviesPage';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function MainNav() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Series', path: '/series' },
    { name: 'Anime', path: '/anime' },
    { name: 'Movies', path: '/movies' },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold mr-8">Content Hub</span>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  asChild
                >
                  <Link to={item.path}>{item.name}</Link>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex md:hidden">
              {/* Mobile navigation would go here */}
              <Button variant="outline" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center md:flex-row md:gap-6">
        <p className="text-sm text-muted-foreground flex-1 text-center md:text-left">
          © 2024 Content Hub. Web Services Project.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/series" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Series
          </Link>
          <Link to="/anime" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Anime
          </Link>
          <Link to="/movies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Movies
          </Link>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <MainNav />
        <main className="flex-1 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/movies" element={<MoviesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
