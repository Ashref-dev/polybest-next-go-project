import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import SeriesPage from './pages/SeriesPage';
import AnimePage from './pages/AnimePage';
import MoviesPage from './pages/MoviesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4 justify-center">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/series" className="hover:text-gray-300">Series</Link></li>
            <li><Link to="/anime" className="hover:text-gray-300">Anime</Link></li>
            <li><Link to="/movies" className="hover:text-gray-300">Movies</Link></li>
          </ul>
        </nav>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/movies" element={<MoviesPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-700 text-white p-4 text-center mt-8">
          Web Services Project - 2024
        </footer>
      </div>
    </Router>
  );
}

export default App;
