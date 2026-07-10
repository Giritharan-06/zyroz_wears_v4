import Navbar from '@/components/Navbar';
import AnimeCustomizer from '@/components/AnimeCustomizer';

export default function CustomizePage() {
  return (
    <main style={{ backgroundColor: '#050505', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Studio Workspace container, taking remaining height below Navbar */}
      <div style={{ flex: 1, marginTop: '70px', display: 'flex', position: 'relative' }}>
        <AnimeCustomizer />
      </div>
    </main>
  );
}
