import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const COUNTRIES = [
  { id: 'IN', name: 'India', flag: '🇮🇳', lat: 20.5937, lng: 78.9629 },
  { id: 'US', name: 'USA', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
  { id: 'UK', name: 'UK', flag: '🇬🇧', lat: 55.3781, lng: -3.4360 },
  { id: 'CA', name: 'Canada', flag: '🇨🇦', lat: 56.1304, lng: -106.3468 },
  { id: 'AU', name: 'Australia', flag: '🇦🇺', lat: -25.2744, lng: 133.7751 },
  { id: 'DE', name: 'Germany', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
  { id: 'FR', name: 'France', flag: '🇫🇷', lat: 46.2276, lng: 2.2137 },
  { id: 'BR', name: 'Brazil', flag: '🇧🇷', lat: -14.2350, lng: -51.9253 },
  { id: 'JP', name: 'Japan', flag: '🇯🇵', lat: 36.2048, lng: 138.2529 },
  { id: 'ZA', name: 'South Africa', flag: '🇿🇦', lat: -30.5595, lng: 22.9375 }
];

export default function CountrySelectionView({ onSelectCountry, onCancel }) {
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const containerRef = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 400
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="country-selection-overlay">
      <div className="country-selection-modal" style={{ maxWidth: '900px', position: 'relative' }}>
        {onCancel && (
          <button 
            onClick={onCancel}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            ✕
          </button>
        )}
        <div className="country-selection-header">
          <h2>Select Your Region</h2>
          <p>Rotate the globe and click a country to personalize your experience.</p>
        </div>
        
        <div 
          ref={containerRef} 
          className="globe-container" 
          style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', background: '#0a0e1a' }}
        >
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            htmlElementsData={COUNTRIES}
            htmlElement={d => {
              const el = document.createElement('div');
              el.innerHTML = `<div class="globe-marker">
                <span class="globe-marker-flag">${d.flag}</span>
                <span class="globe-marker-name">${d.name}</span>
              </div>`;
              el.style.cursor = 'pointer';
              el.onclick = () => onSelectCountry(d.id);
              return el;
            }}
          />
        </div>
      </div>
    </div>
  );
}
