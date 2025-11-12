'use client';

export default function DebugVRPage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <h1>🥽 VERA Quest VR - Loading...</h1>
      <p>If you see this page, the route is working.</p>
      <p>VERAQuestVR component loading below...</p>
      
      <div style={{
        padding: '20px',
        background: 'rgba(102, 102, 255, 0.2)',
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        <p>Check browser console for errors (F12)</p>
        <p>The XR component may need WebXR support</p>
      </div>
    </div>
  );
}
