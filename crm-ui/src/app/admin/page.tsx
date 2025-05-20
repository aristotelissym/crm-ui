'use client';


import React from 'react';
import { useState } from 'react';


export default function AdminPage() {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderContent = () => {
        switch (currentView) {
            case 'import-users':
                return (
                    <div>
                        <h2>Import Users</h2>
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '3rem', 
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            margin: '2rem 0'
                        }}>
                            <svg 
                                style={{ width: '48px', height: '48px', margin: '1rem' }}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                />
                            </svg>
                            <p style={{ color: '#666', marginBottom: '1rem' }}>Upload Users</p>
                            <input 
                                type="file" 
                                id="fileInput" 
                                accept=".csv" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // Handle the file here
                                        console.log('Selected file:', file);
                                    }
                                }}
                            />
                            <button
                                onClick={() => document.getElementById('fileInput')?.click()}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Choose CSV File
                            </button>
                        </div>
                    </div>
                );
            case 'backup-list':
                return (
                    <><div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem'
                        }}>
                            <h2>Backup List</h2>
                            <button
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => console.log('Backup initiated')}
                            >
                                Backup Now
                            </button>
                        </div>
                        <p>Backup list functionality goes here.</p>
                    </div><table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #eee' }}>Number</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #eee' }}>Title</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #eee' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #eee' }}>Restore</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>1</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Daily Backup</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>2024-01-20</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                        <button
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#0070f3',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => console.log('Restore initiated')}
                                        >
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table></>
                );
            default:
                return (
                    <div>
                        <h1>Admin Panel</h1>
                        <p>Welcome to the admin dashboard.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '220px', background: '#f4f4f4', padding: '2rem 1rem' }}>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}>
                            <button 
                                onClick={() => setCurrentView('import-users')}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#333' }}
                            >
                                Import Users
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => setCurrentView('backup-list')}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#333' }}
                            >
                                Backup List
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '2rem' }}>
                {renderContent()}
            </main>
        </div>
    );
}