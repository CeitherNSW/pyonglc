'use client';

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { PhoneFilled } from '@ant-design/icons';
import GoogleMap from './components/map';
import CsvTable from './components/csvtable';
import ServiceDemo from './components/ServiceDemo';
import { useRouter } from 'next/navigation';


const { Header, Content, Footer } = Layout;


export default function Home() {
  const [activeTab, setActiveTab] = useState<'map' | 'services' | 'products' | 'demo'>('map');
  const clinicLocation = { lat: -33.92411, lng: 151.188122 };
  const router = useRouter();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/img/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <img src="/img/logo.png" alt="Logo" style={{ height: 40 }} />
        <Menu theme="light" mode="horizontal" selectedKeys={[]}>
        <Menu.Item key="1" onClick={() => setActiveTab('map')}>
          Home
        </Menu.Item>
        <Menu.Item key="2" onClick={() => router.push('/login')}>
          Manager Login
        </Menu.Item>
  </Menu>
      </Header>

      <Content>
        <div
          style={{
            padding: 24,
            minHeight: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              padding: '20px 40px',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#3A3A3A', marginBottom: '10px' }}>
              Pyong Laser & Clinics
            </h1>
            <p style={{ fontSize: '20px', color: '#5A5A5A' }}>
              <PhoneFilled />: 12345678
            </p>

            <nav style={{ marginTop: '20px', width: '100%' }}>
              <ul
                style={{
                  listStyleType: 'none',
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  backgroundColor: 'rgba(255, 248, 243, 0.8)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {[
                  { label: 'Find Us', key: 'map' },
                  { label: 'Services', key: 'services' },
                  { label: 'Products', key: 'products' },
                  { label: 'Service Demo', key: 'demo' },
                ].map(({ label, key }) => (
                  <li key={key}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(key as any);
                      }}
                      style={{
                        color: activeTab === key ? '#3A3A3A' : '#5A5A5A',
                        backgroundColor: activeTab === key ? '#B3D8F5' : 'transparent',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== key) e.currentTarget.style.backgroundColor = '#EDEDED';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== key) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ width: '100%', marginTop: '24px' }}>
              {activeTab === 'map' && (
                <GoogleMap
                  center={clinicLocation}
                  zoom={19}
                  style={{
                    width: '100%',
                    height: '600px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                />
              )}
              {activeTab === 'services' && <CsvTable csvUrl="/text/services.csv" />}
              {activeTab === 'products' && <CsvTable csvUrl="/text/products.csv" />}
              {activeTab === 'demo' && <ServiceDemo />}
            </div>
          </div>

          <div id="aboutus" style={{ marginTop: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#3A3A3A' }}>
              Your health and beauty are our priority.
            </h2>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              We are committed to providing you with the best care and treatment.
            </p>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Visit us today and experience the difference.
            </p>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              Your satisfaction is our guarantee.
            </p>
            <p style={{ fontSize: '18px', color: '#5A5A5A' }}>
              We look forward to serving you.
            </p>
          </div>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.6)', color: '#3A3A3A' }}>
        Pyong Laser & Clinics ©2023 Created by Ceither
      </Footer>
    </Layout>
  );
}
