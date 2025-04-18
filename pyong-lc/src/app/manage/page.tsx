'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUploadPanel from '../components/PhotoUploadPanel';
import CsvEditor from '../components/CsvEditor';
import PhotoEditor from '../components/PhotoEditor';

interface User {
  role: string;
  iat?: number;
  exp?: number;
}

type Section = null | 'upload' | 'services' | 'products' | 'photos';

export default function ManagePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>(null);

  useEffect(() => {
    fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.replace('/login');
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'GET', credentials: 'include' });
    router.push('/login');
  };

  if (loading) return null;

  if (activeSection === 'upload') {
    return (
      <div style={{ padding: 48, backgroundColor: '#FFF8F3', minHeight: '100vh' }}>
        <PhotoUploadPanel onBack={() => setActiveSection(null)} />
      </div>
    );
  }

  if (activeSection === 'products') {
    return (
      <div style={{ padding: 48, backgroundColor: '#FFF8F3', minHeight: '100vh' }}>
        <CsvEditor csvUrl="/text/products.csv" />
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={() => setActiveSection(null)} style={btnStyle}>
            返回主页
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'services') {
    return (
      <div style={{ padding: 48, backgroundColor: '#FFF8F3', minHeight: '100vh' }}>
        <CsvEditor csvUrl="/text/services.csv" />
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={() => setActiveSection(null)} style={btnStyle}>
            返回主页
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'photos') {
    return (
      <div style={{ padding: 48, backgroundColor: '#FFF8F3', minHeight: '100vh' }}>
        <PhotoEditor />
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={() => setActiveSection(null)} style={btnStyle}>
            返回主页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#FFF8F3',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', color: '#3A3A3A' }}>
        欢迎回来，{user?.role === 'admin' ? '管理员' : '用户'}
      </h1>
      <p style={{ color: '#5A5A5A' }}>您已成功登录系统。</p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '32px',
        padding: '24px',
        backgroundColor: '#FFF',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
      }}>
        <button onClick={() => setActiveSection('upload')} style={btnStyle}>upload photo</button>
        <button onClick={() => setActiveSection('services')} style={btnStyle}>update services</button>
        <button onClick={() => setActiveSection('products')} style={btnStyle}>update products</button>
        <button onClick={() => setActiveSection('photos')} style={btnStyle}>edit photos</button>
      </div>

      <button onClick={handleLogout} style={{ ...btnStyle, marginTop: '32px' }}>
        退出登录
      </button>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  marginBottom: '16px',
  padding: '10px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#FAD4E0',
  color: '#3A3A3A',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  width: 200,
};
