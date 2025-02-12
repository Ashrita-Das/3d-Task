import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import * as THREE from 'three';

import {
  faPause,
  faPlay,
  faVolumeMute,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  OrbitControls,
  Stars,
  Trail,
  useProgress,
} from '@react-three/drei';
import {
  Canvas,
  useFrame,
} from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
} from '@react-three/postprocessing';
import { Fluid } from '@whatisjery/react-fluid-distortion';

import sampleVideo from './assets/ADC_Home_page_video.mp4';
import getLayer from './getLayer';
import ResponsiveText from './Text';

const bgSprites = getLayer({
  numSprites: 4,
  radius: 6,
  z: -10.5,
  size: 16,
  opacity: 0.2,
  path: "./rad-grad.png",
});

function ShootingStar() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2;
    ref.current.position.set(Math.sin(t) * 4, Math.atan(t) * Math.cos(t / 2) * 2, Math.cos(t) * 4);
  });
  return (
    <Trail width={2} length={2} color={new THREE.Color(2, 1, 10)} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

function Loader({ onFinished }) {
  const { progress } = useProgress();
  const [fakeProgress, setFakeProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFakeProgress((prev) => Math.min(prev + Math.random() * 5 + 5, progress, 100));
    }, 75);

    if (fakeProgress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onFinished, 300);
      }, 300);
    }

    return () => clearInterval(interval);
  }, [progress, fakeProgress, onFinished]);

  return (
    <div className={`loader-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="loader-capsule">{Math.floor(fakeProgress)}%</div>
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [showVideo]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="app-container">
      {!loaded && <Loader onFinished={() => setLoaded(true)} />}

      {loaded && (
        <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
          <color attach="background" args={["black"]} />
          <ambientLight intensity={1} />
          <ShootingStar />
          <Stars saturation={false} count={600} speed={0.5} />
          <OrbitControls />
          <EffectComposer>
            <Fluid />
            <Bloom mipmapBlur luminanceThreshold={1} />
          </EffectComposer>

          <AnimatePresence>
            {!showVideo && (
              <motion.group
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              >
                <ResponsiveText />
              </motion.group>
            )}
          </AnimatePresence>
        </Canvas>
      )}

      {loaded && !showVideo && (
        <motion.button
          className="button-container"
          onClick={() => setShowVideo(true)}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          Enter the experience
        </motion.button>
      )}

      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="video-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <video
              ref={videoRef}
              src={sampleVideo}
              autoPlay
              loop
              muted={isMuted}
              className="video-player"
            />

      <button className="mute-button" onClick={toggleMute}>
        <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} size="lg" />
      </button>

      <button className="play-pause-button" onClick={togglePlay}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="2x" />
      </button> 
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
