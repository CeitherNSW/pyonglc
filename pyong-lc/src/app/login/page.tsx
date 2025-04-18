'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res: Response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/manage');
      } else {
        const data = await res.json();
        setError(data?.error || '登录失败');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('请求失败，请稍后重试');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FAD4E0' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: 16, color: '#3A3A3A' }}>管理员登录</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          style={{ display: 'block', marginBottom: 12, padding: 8, width: 240 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          style={{ display: 'block', marginBottom: 12, padding: 8, width: 240 }}
        />
        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button type="submit" style={{ width: 240, padding: '10px 24px', backgroundColor: '#B3D8F5', border: 'none', borderRadius: 6 }}>
          登录
        </button>
        <button style={{ width: 240, padding: '10px 24px', backgroundColor: '#B3D8F5', border: 'none', borderRadius: 6 }} onClick={() => router.push('/')}>Back to Home</button>
        </div>
      </form>
    </div>
  );
}
