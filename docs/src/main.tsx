import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(<App />);
const meta = document.createElement('meta');
meta.name = 'description';
meta.content = 'BladeNode Documentation - Comprehensive guides and troubleshooting for Sentry Node setup, rewards, and network participation.';
document.head.appendChild(meta);

// Add page title
document.title = "Documentation | BlazeNode";
