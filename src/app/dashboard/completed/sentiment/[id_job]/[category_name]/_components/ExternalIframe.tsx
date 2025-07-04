"use client"
import React, { useState, useEffect } from 'react';

interface ExternalIframeProps {
  src: string;
  width?: string | number;
  height?: string | number;
  title?: string;
  className?: string;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  sandbox?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ExternalIframe: React.FC<ExternalIframeProps> = ({
  src,
  width = '100%',
  height = '400px',
  title = 'External Content',
  className = '',
  allowFullScreen = false,
  loading = 'lazy',
  sandbox,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);

  // Validar URL
  useEffect(() => {
    try {
      const url = new URL(src);
      setIsValidUrl(url.protocol === 'https:' || url.protocol === 'http:');
    } catch {
      setIsValidUrl(false);
      setHasError(true);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Configuración de sandbox por defecto (más segura)
  const defaultSandbox = sandbox || [
    'allow-scripts',
    'allow-same-origin',
    'allow-forms',
    'allow-popups',
    'allow-presentation',
    'allow-top-navigation-by-user-activation'
  ].join(' ');

  if (!isValidUrl) {
    return (
      <div className={`iframe-error ${className}`} style={{ width, height }}>
        <div className="error-content">
          <p>URL inválida: {src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`iframe-container ${className}`} style={{ position: 'relative', width, height }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          Cargando contenido externo...
        </div>
      )}

      <iframe
        src={src}
        width="100%"
        height="100%"
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        allow="fullscreen"
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default ExternalIframe;