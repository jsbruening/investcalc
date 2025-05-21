import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { MdSavings } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';

interface InvestmentTabsProps {
 value: number;
 onChange: (value: number) => void;
}

const InvestmentTabs: React.FC<InvestmentTabsProps> = ({ value, onChange }) => {
 return (
  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
   <Tabs
    value={value}
    onChange={(_, v) => onChange(v)}
    aria-label="Investment Term Tabs"
    sx={{
     '.MuiTabs-indicator': {
      backgroundColor: 'var(--color-primary)',
      height: 4,
      borderRadius: 2,
     },
     minHeight: 0,
    }}
   >
    <Tab
     icon={<MdSavings style={{ fontSize: 22, marginRight: 8, color: '#8cc63f' }} />}
     iconPosition="start"
     label="Short Term"
     sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      color: value === 0 ? 'var(--color-primary)' : '#64748b',
      minHeight: 0,
      '&.Mui-selected': {
       color: 'var(--color-primary)',
      },
      '&:hover': {
       background: 'rgba(140,198,63,0.08)',
       color: 'var(--color-primary)',
      },
      '&.Mui-focusVisible': {
       outline: '2px solid var(--color-primary)',
       outlineOffset: '2px',
       background: 'rgba(140,198,63,0.10)',
      },
     }}
    />
    <Tab
     icon={<MdSavings style={{ fontSize: 22, marginRight: 8, color: '#4a90e2' }} />}
     iconPosition="start"
     label="Intermediate Term"
     sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      color: value === 1 ? 'var(--color-primary)' : '#64748b',
      minHeight: 0,
      '&.Mui-selected': {
       color: 'var(--color-primary)',
      },
      '&:hover': {
       background: 'rgba(140,198,63,0.08)',
       color: 'var(--color-primary)',
      },
      '&.Mui-focusVisible': {
       outline: '2px solid var(--color-primary)',
       outlineOffset: '2px',
       background: 'rgba(140,198,63,0.10)',
      },
     }}
    />
    <Tab
     icon={<MdSavings style={{ fontSize: 22, marginRight: 8, color: '#f39c12' }} />}
     iconPosition="start"
     label="Long Term"
     sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      color: value === 2 ? 'var(--color-primary)' : '#64748b',
      minHeight: 0,
      '&.Mui-selected': {
       color: 'var(--color-primary)',
      },
      '&:hover': {
       background: 'rgba(140,198,63,0.08)',
       color: 'var(--color-primary)',
      },
      '&.Mui-focusVisible': {
       outline: '2px solid var(--color-primary)',
       outlineOffset: '2px',
       background: 'rgba(140,198,63,0.10)',
      },
     }}
    />
    <Tab
     icon={<FaShieldAlt style={{ fontSize: 20, marginRight: 8, color: '#9b59b6' }} />}
     iconPosition="start"
     label="Maybe Never / Leave On"
     sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      color: value === 3 ? 'var(--color-primary)' : '#64748b',
      minHeight: 0,
      '&.Mui-selected': {
       color: 'var(--color-primary)',
      },
      '&:hover': {
       background: 'rgba(140,198,63,0.08)',
       color: 'var(--color-primary)',
      },
      '&.Mui-focusVisible': {
       outline: '2px solid var(--color-primary)',
       outlineOffset: '2px',
       background: 'rgba(140,198,63,0.10)',
      },
     }}
    />
   </Tabs>
  </Box>
 );
};

export default InvestmentTabs; 