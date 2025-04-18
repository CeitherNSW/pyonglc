'use client';

import React, { useEffect, useState } from 'react';

interface MatchedImage {
  name: string;
  beforeUrl: string;
  afterUrl: string;
}

export default function ServiceDemo() {
  const [matchedImages, setMatchedImages] = useState<MatchedImage[]>([]);
    console.log('ServiceDemo component rendered');
  useEffect(() => {
    fetch('/api/matched-images')
      .then((res) => res.json())
      .then((data) => {
        setMatchedImages(data);
      })
      .catch((err) => {
        console.error('Failed to fetch matched images:', err);
      });
  }, []);

  if (matchedImages.length === 0) return null;

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', color: '#3A3A3A' }}>
        Service Results
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '24px' }}>
        {matchedImages.map(({ name, beforeUrl, afterUrl }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <img
                  src={beforeUrl}
                  alt={`Before ${name}`}
                  style={{ width: '300px', borderRadius: '8px' }}
                />
                <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#5A5A5A' }}>Before</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={afterUrl}
                  alt={`After ${name}`}
                  style={{ width: '300px', borderRadius: '8px' }}
                />
                <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#5A5A5A' }}>After</p>
              </div>
            </div>
            <p style={{ marginTop: '12px', fontSize: '18px', fontWeight: 'bold', color: '#3A3A3A' }}>
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
