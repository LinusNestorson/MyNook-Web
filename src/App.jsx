import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ColorTracker from './components/ColorTracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="colors" element={<ColorTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
