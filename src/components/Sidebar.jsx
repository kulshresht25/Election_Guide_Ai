import React from 'react';
import {
  MessageSquare,
  Clock,
  HelpCircle,
  CheckSquare,
  Sun,
  Moon,
  Vote,
  Activity,
  Layers,
  Search,
  Camera,
  Gamepad2,
  Users
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'chat', icon: MessageSquare },
  { id: 'dashboard', icon: Activity },
  { id: 'profile', icon: Layers },
  { id: 'factchecker', icon: Search },
  { id: 'timeline', icon: Clock },
  { id: 'faq', icon: HelpCircle },
  { id: 'selfie', icon: Camera },
  { id: 'minigame', icon: Gamepad2 },
  { id: 'debate', icon: Users },
];

/**
 * Sidebar Navigation Component
 * Memoized to prevent re-renders when parent props haven't changed
 */
function SidebarContent({
  activePage,
  onPageChange,
  darkMode,
  onToggleDark,
  isOpen,
  onClose,
  language,
  onLanguageChange,
  dictionary
}) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        id="sidebar-menu"
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Main Navigation"
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Vote size={22} />
            </div>
            <div className="sidebar-logo-text">
              <h1>ElectionGuide</h1>
              <p>AI Assistant</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            aria-current={activePage === item.id ? 'page' : undefined}
            onClick={() => {
              onPageChange(item.id);
              onClose();
            }}
          >
            <item.icon size={20} aria-hidden="true" />
            <span>{dictionary ? dictionary[item.id] : item.id}</span>
          </button>
        ))}
        </nav>

        <div className="sidebar-footer">
          <div className="language-select-wrapper">
            <select 
              className="language-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              aria-label="Select Language"
            >
              <option value="en-US">English</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
            </select>
          </div>
          <div 
            className="theme-switch-wrapper" 
            onClick={onToggleDark}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleDark(); } }}
          >
            <span>{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            <div className={`theme-switch ${darkMode ? 'dark' : ''}`} aria-hidden="true"></div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default React.memo(SidebarContent);
