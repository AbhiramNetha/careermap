import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dock from './Dock';
import { VscHome, VscCompass, VscAccount, VscPlayCircle } from 'react-icons/vsc';

export default function DockNav() {
    const navigate = useNavigate();

    const items = [
        { 
            icon: <VscHome size={22} />, 
            label: 'Home', 
            onClick: () => navigate('/') 
        },
        { 
            icon: <VscCompass size={22} />, 
            label: 'Careers', 
            onClick: () => navigate('/careers') 
        },
        { 
            icon: <VscPlayCircle size={22} />, 
            label: 'Take Quiz', 
            onClick: () => navigate('/quiz') 
        },
        { 
            icon: <VscAccount size={22} />, 
            label: 'Profile', 
            onClick: () => navigate('/profile') 
        },
    ];

    return (
        <Dock 
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={75}
        />
    );
}
