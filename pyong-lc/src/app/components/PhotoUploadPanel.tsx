'use client';

import React, { useState } from 'react';
import { Upload, Button, Input } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  onBack: () => void;
}

export default function PhotoUploadPanel({ onBack }: Props) {
  const [beforeFile, setBeforeFile] = useState<UploadFile[]>([]);
  const [afterFile, setAfterFile] = useState<UploadFile[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setBeforeFile([]);
    setAfterFile([]);
    setName('');
    setStatus(null);
    setMessageText('');
  };

  const handleUpload = async () => {
    if (beforeFile.length === 0 || afterFile.length === 0 || !name.trim()) {
      setStatus('error');
      setMessageText('请上传两张图片并填写名称');
      return;
    }
    setLoading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('before', beforeFile[0].originFileObj as File);
    formData.append('after', afterFile[0].originFileObj as File);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('上传失败');

      const data = await res.json();
      setStatus('success');
      setMessageText(`上传成功！文件名：${data.savedName}`);
      handleClear();
    } catch (err) {
      setStatus('error');
      setMessageText('上传失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFF',
      padding: 32,
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      width: '90%',
      maxWidth: 1000,
    }}>
      <h2 style={{ textAlign: 'center', color: '#3A3A3A' }}>上传 Before / After 照片</h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 32,
        gap: 24,
      }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#5A5A5A' }}>Before（必填）</h4>
          <Upload
            accept="image/*"
            fileList={beforeFile}
            onChange={({ fileList }) => setBeforeFile(fileList.slice(-1))}
            beforeUpload={() => false}
            listType="picture-card"
          >
            {beforeFile.length === 0 && '点击上传'}
          </Upload>
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#5A5A5A' }}>After（必填）</h4>
          <Upload
            accept="image/*"
            fileList={afterFile}
            onChange={({ fileList }) => setAfterFile(fileList.slice(-1))}
            beforeUpload={() => false}
            listType="picture-card"
          >
            {afterFile.length === 0 && '点击上传'}
          </Upload>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Input
          value={name}
          placeholder="请输入图片名称（必填）"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {status && (
        <div style={{
          marginTop: 24,
          padding: '12px 16px',
          borderRadius: 8,
          backgroundColor: status === 'success' ? '#AEE5B1' : '#F7A7A7',
          color: '#3A3A3A',
          textAlign: 'center',
        }}>
          {messageText}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        marginTop: 32,
      }}>
        <Button onClick={handleClear}>清空</Button>
        <Button type="primary" onClick={handleUpload} loading={loading}>
          确认上传
        </Button>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>返回主页</Button>
      </div>
    </div>
  );
}
