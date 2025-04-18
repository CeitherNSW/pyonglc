'use client';

import React, { useEffect, useState } from 'react';

interface PhotoPair {
  name: string;
  beforeUrl: string;
  afterUrl: string;
}

export default function PhotoEditor() {
  const [photos, setPhotos] = useState<PhotoPair[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/matched-images')
      .then(res => res.json())
      .then(data => setPhotos(data || []));
  }, []);

  const toggleSelect = (name: string) => {
    const newSet = new Set(selected);
    newSet.has(name) ? newSet.delete(name) : newSet.add(name);
    setSelected(newSet);
  };

  const handleDelete = async () => {
    if (selected.size === 0) {
      alert('请选择要删除的照片');
      return;
    }

    const confirmed = confirm(`确定删除 ${selected.size} 组照片？`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: Array.from(selected) }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('删除成功');
        setPhotos((prev) => prev.filter(p => !selected.has(p.name)));
        setSelected(new Set());
      } else {
        alert(result.error || '删除失败');
      }
    } catch (err) {
      alert('请求错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, background: '#FFF8F3', minHeight: '100vh' }}>
      <h2 style={{ fontSize: 28, color: '#3A3A3A', marginBottom: 24 }}>编辑照片</h2>

      {photos.length === 0 ? (
        <p style={{ color: '#5A5A5A' }}>暂无已上传照片</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {photos.map(({ name, beforeUrl, afterUrl }) => (
            <div
              key={name}
              style={{
                border: selected.has(name)
                  ? '2px solid #F7A7A7'
                  : '2px solid transparent',
                borderRadius: 8,
                backgroundColor: '#fff',
                padding: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                {[beforeUrl, afterUrl].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={i === 0 ? 'before' : 'after'}
                    style={{
                      width: '300px',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: 4,
                      flex: '1 1 auto',
                    }}
                  />
                ))}
              </div>
              <p style={{ textAlign: 'center', margin: '8px 0' }}>{name}</p>
              <div style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selected.has(name)}
                  onChange={() => toggleSelect(name)}
                />{' '}
                选择
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: '10px 24px',
            backgroundColor: '#F7A7A7',
            color: '#3A3A3A',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {loading ? '正在删除…' : '保存修改（删除选中）'}
        </button>
      </div>
    </div>
  );
}
