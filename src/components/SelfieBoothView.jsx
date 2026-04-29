import React, { useRef, useState, useEffect } from 'react';
import { Camera, Download, RefreshCw } from 'lucide-react';

export default function SelfieBoothView({ userState, setUserState, dict }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  };

  const takeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Draw video feed
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw "I Voted" Badge AR Overlay
    const text = `I Voted! ${userState.country ? '(' + userState.country + ')' : ''}`;
    
    // Draw badge background
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'; // Red
    ctx.beginPath();
    ctx.roundRect(20, canvas.height - 80, 250, 50, 10);
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(text, 40, canvas.height - 45);

    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  };

  const retakeSelfie = () => {
    setPhoto(null);
  };

  const downloadPhoto = () => {
    if (!photo) return;
    const link = document.createElement('a');
    link.href = photo;
    link.download = 'ivoted-selfie.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-content selfie-booth">
      <h2 className="page-title">{dict?.selfieTitle || 'AR Selfie Booth'}</h2>
      <p className="page-subtitle">{dict?.selfieSubtitle || "Snap a picture with your digital 'I Voted' badge to share on social media."}</p>

      {hasPermission === false && (
        <div className="permission-error">
          <p>Please allow camera access to use the Selfie Booth.</p>
          <button onClick={startCamera} className="analyze-btn">{dict?.retryBtn || 'Retry'}</button>
        </div>
      )}

      <div className="camera-container">
        {photo ? (
          <div className="photo-preview slide-up">
            <img src={photo} alt="Selfie" />
            <div className="photo-actions">
              <button className="analyze-btn retry" onClick={retakeSelfie}>
                <RefreshCw size={18} /> {dict?.retakeBtn || 'Retake'}
              </button>
              <button className="analyze-btn" onClick={downloadPhoto}>
                <Download size={18} /> {dict?.downloadBtn || 'Download'}
              </button>
            </div>
          </div>
        ) : (
          <div className="video-feed slide-up">
            <video ref={videoRef} autoPlay playsInline muted></video>
            <div className="ar-overlay-preview">
              <div className="ar-badge">I Voted! {userState.country && `(${userState.country})`}</div>
            </div>
            <button className="snap-btn" onClick={takeSelfie}>
              <Camera size={32} />
            </button>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
}
