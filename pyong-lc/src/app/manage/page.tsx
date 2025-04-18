'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  role: string;
  iat?: number;
  exp?: number;
}

export default function ManagePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 自动鉴权
    fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // 🔐 关键：带上 cookie
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.replace('/login'); // 🚫 未登录跳转
        }
      })
      .catch(() => {
        router.replace('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'GET',
      credentials: 'include',
    });
    router.push('/login');
  };

  if (loading) return null; // ⏳ 避免闪屏或错误状态闪现

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

      <button
        onClick={handleLogout}
        style={{
          marginTop: '32px',
          padding: '10px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#FAD4E0',
          color: '#3A3A3A',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        退出登录
      </button>
    </div>
  );
}
