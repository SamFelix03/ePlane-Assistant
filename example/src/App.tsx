/// <reference types="vite/client" />

declare module '*.gif' {
  const gifUrl: string;
  export default gifUrl;
}

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { UltravoxSession } from 'ultravox-client';
import orbGif from './assets/orb-animation.gif';

// Create a dark theme with futuristic colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#001d26',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Container = styled('div')`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  background: #000000;
`;

const HolographicPanel = styled(motion.div)`
  background: rgba(0, 18, 41, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 247, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 247, 0.1);
`;

const TranscriptContainer = styled(HolographicPanel)`
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 247, 0.5);
    border-radius: 10px;
  }
`;

const InputContainer = styled(HolographicPanel)`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const GlowingInput = styled('input')`
  background: rgba(0, 18, 41, 0.5);
  border: 1px solid rgba(0, 255, 247, 0.3);
  border-radius: 8px;
  color: #00fff7;
  padding: 10px 15px;
  flex: 1;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: rgba(0, 255, 247, 0.8);
    box-shadow: 0 0 15px rgba(0, 255, 247, 0.2);
  }
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(45deg, #00fff7, #7000ff);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TranscriptMessage = styled(motion.div)`
  margin: 8px 0;
  padding: 8px;
  color: rgba(0, 255, 247, 0.9);
  font-size: clamp(14px, 2.5vw, 16px);
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 255, 247, 0.3);
  max-width: 100%;
  line-height: 1.4;
`;

interface StatusIndicatorProps {
  $active?: boolean;
}

const StatusIndicator = styled(motion.div)<StatusIndicatorProps>`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 15px;
  background: ${(props: StatusIndicatorProps) => props.$active ? 'rgba(0, 255, 247, 0.2)' : 'rgba(255, 0, 0, 0.2)'};
  border-radius: 20px;
  color: ${(props: StatusIndicatorProps) => props.$active ? '#00fff7' : '#ff0000'};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props: StatusIndicatorProps) => props.$active ? '#00fff7' : '#ff0000'};
    display: inline-block;
  }
`;

interface Transcript {
  speaker: string;
  text: string;
}

const FloatingButton = styled(motion.button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #00e5ff;
  z-index: 1000;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(0, 229, 255, 0.2);
    border-color: rgba(0, 229, 255, 0.8);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
  }
`;

interface CentralOrbProps {
  'data-active'?: boolean;
}

const CentralOrb = styled(motion.button)<CentralOrbProps>`
  position: relative;
  width: min(250px, 40vw);
  height: min(250px, 40vw);
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00e5ff;
  font-size: clamp(16px, 2.5vw, 18px);
  z-index: 2;
  padding: 0;
  text-align: center;
  margin: 0;
  overflow: visible;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: url(${orbGif}) no-repeat center center;
    background-size: cover;
    opacity: ${props => props['data-active'] ? 0.95 : 0.85};
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(1.2) contrast(1.1);
    transform: scale(${props => props['data-active'] ? 1.1 : 1});
  }

  &::after {
    content: '';
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(0, 229, 255, 0.15) 0%,
      transparent 70%
    );
    opacity: ${props => props['data-active'] ? 0.6 : 0.3};
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: blur(15px);
  }

  .orb-inner {
    position: relative;
    z-index: 2;
    padding: 20px;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    background: ${props => props['data-active'] ? 
      'radial-gradient(circle at center, rgba(0, 229, 255, 0.1) 0%, transparent 70%)' : 
      'none'
    };
  }

  .orb-glow {
    position: absolute;
    inset: -40px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(0, 229, 255, 0.12) 0%,
      transparent 70%
    );
    opacity: ${props => props['data-active'] ? 0.8 : 0.4};
    filter: blur(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(${props => props['data-active'] ? 1.2 : 1});
  }

  &:hover {
    .orb-glow {
      opacity: 0.9;
      transform: scale(1.1);
    }
  }

  &[data-active="true"] {
    .orb-inner {
      background: radial-gradient(
        circle at center,
        rgba(0, 229, 255, 0.15) 0%,
        transparent 70%
      );
    }
  }
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const PopupContent = styled(HolographicPanel)`
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function App() {
  const [uvSession] = useState(() => new UltravoxSession());
  const [status, setStatus] = useState('disconnected');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [joinUrl, setJoinUrl] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    uvSession.addEventListener('status', () => {
      setStatus(uvSession.status);
    });

    uvSession.addEventListener('transcripts', () => {
      setTranscripts(uvSession.transcripts);
    });

    const initParticles = async () => {
      try {
        await loadSlim({} as any);
      } catch (error) {
        console.error('Failed to initialize particles:', error);
      }
    };
    initParticles();
  }, [uvSession]);

  const startCall = async () => {
    if (!joinUrl) return;
    uvSession.registerToolImplementation('getSecretMenu', getSecretMenu);
    uvSession.joinCall(joinUrl);
  };

  const endCall = () => {
    uvSession.leaveCall();
    setStatus('disconnected');
  };

  const handleOrbClick = () => {
    if (status !== 'disconnected') {
      endCall();
    } else {
      startCall();
    }
  };

  const getSecretMenu = (params: unknown) => {
    const result = {
      date: new Date().toISOString(),
      specialItems: [
        { name: 'Banana smoothie', price: 3.99 },
        { name: 'Butter pecan ice cream (one scoop)', price: 1.99 },
      ],
    };
    return JSON.stringify(result);
  };

  const isCallActive = status !== 'disconnected';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Particles
        options={{
          particles: {
            color: { value: '#00e5ff' },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              random: true,
              straight: false,
              outModes: "out",
            },
            number: {
              value: 20,
              density: {
                enable: true,
                area: 800,
              },
            },
            opacity: {
              value: 0.15,
              random: true,
              animation: {
                enable: true,
                speed: 0.3,
                minimumValue: 0.05,
                sync: false,
              },
            },
            size: {
              value: 2,
              random: true,
            },
          },
        }}
      />
      <Container>
        <StatusIndicator
          $active={isCallActive}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px'
          }}
        >
          {status.toUpperCase()}
        </StatusIndicator>

        <CentralOrb
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={isCallActive ? {
            scale: [1, 1.05, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          } : {
            scale: 1,
            transition: {
              duration: 0.6,
              ease: "easeInOut"
            }
          }}
          onClick={handleOrbClick}
          disabled={!joinUrl}
          data-active={isCallActive}
        >
          <div className="orb-glow" />
          <div className="orb-inner">
            <TypeAnimation
              sequence={[isCallActive ? '' : '', 1000]}
              wrapper="div"
              cursor={false}
              repeat={Infinity}
              style={{ 
                opacity: 0
              }}
            />
          </div>
        </CentralOrb>

        <FloatingButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPopupOpen(true)}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 10
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </FloatingButton>

        <AnimatePresence initial={false} mode="wait">
          {isPopupOpen && (
            <PopupOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
            >
              <PopupContent
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ margin: '20px' }}
              >
                <h3 style={{ color: '#00fff7', margin: 0 }}>Enter Join URL</h3>
                <GlowingInput
                  type="text"
                  value={joinUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinUrl(e.target.value)}
                  placeholder="Enter join URL"
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <ActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Done
                  </ActionButton>
                </div>
              </PopupContent>
            </PopupOverlay>
          )}
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}

export default App; 