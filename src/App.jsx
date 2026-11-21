import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import BackgroundSparkles from './components/BackgroundSparkles';
import CountdownStage from './components/CountdownStage';
import PinStage from './components/PinStage';
import ScannerModal from './components/ScannerModal';
import VendingMachineStage from './components/VendingMachineStage';
import TwoThreadsStage from './components/TwoThreadsStage';
import SiblingLetterAndFireworksStage from './components/SiblingLetterAndFireworksStage';
import { sounds } from './utils/audio';

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCuttingRibbon, setIsCuttingRibbon] = useState(false);
  const [isRibbonCut, setIsRibbonCut] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [lanternTrigger, setLanternTrigger] = useState(0);
  const [emojiFountainTrigger, setEmojiFountainTrigger] = useState(0);

  const siblingStageRef = useRef(null);

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
    if (newState) sounds.playTap();
  };

  const handleGoBack = () => {
    sounds.playTap();
    if (currentStage === 5) {
      if (siblingStageRef.current && typeof siblingStageRef.current.handleBack === 'function') {
        const handledInternally = siblingStageRef.current.handleBack();
        if (handledInternally) return;
      }
      setCurrentStage(4);
    } else if (currentStage === 4) {
      setCurrentStage(3);
    } else if (currentStage === 3) {
      setCurrentStage(2);
    }
  };

  // Called when user clicks the cute girl
  const handleRequestScanner = () => {
    if (isRibbonCut) return;
    sounds.playTap();
    setIsScannerOpen(true);
  };

  // Called when 15-second Shagun payment finishes or is clicked
  const handleScannerComplete = () => {
    setIsScannerOpen(false);
    // Start the ribbon cutting animation!
    setIsCuttingRibbon(true);
  };

  // Called when scissor cut animation completes
  const handleRibbonCutComplete = () => {
    setIsCuttingRibbon(false);
    setIsRibbonCut(true);
    sounds.playSuccess();
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.5 } });
  };

  // Called when user enters correct PIN (3011)
  const handlePinSuccess = () => {
    sounds.playSuccess();
    sounds.playRomanticChime();
    setCurrentStage(3); // Transition directly to Sibling Memory Vault & Video Vending Machine!
  };

  const handleLaunchLanterns = () => {
    sounds.playRomanticChime();
    setLanternTrigger((prev) => prev + 1);
    confetti({ particleCount: 60, spread: 75, origin: { y: 0.8 } });
  };

  const handleRestart = () => {
    sounds.playTap();
    setIsScannerOpen(false);
    setIsCuttingRibbon(false);
    setIsRibbonCut(false);
    setSecondsRemaining(10);
    setCurrentStage(1);
  };

  return (
    <>
      {/* Background Ambience, Floating Sparkles, Lanterns & Cursor Trail */}
      <BackgroundSparkles
        lanternTrigger={lanternTrigger}
        emojiFountainTrigger={emojiFountainTrigger}
        currentStage={currentStage}
      />

      {/* Floating Top Controls */}
      <div className={`floating-controls ${currentStage >= 4 ? 'floating-controls-dark' : ''}`}>
        {[3, 4, 5].includes(currentStage) && (
          <button
            className="control-btn back-btn"
            onClick={handleGoBack}
            title="Go Back"
          >
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        )}
        <button className="control-btn" onClick={toggleSound} title="Toggle Sound FX">
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <main className={`app-container ${currentStage === 4 ? 'wide-timeline-mode' : ''} ${currentStage === 3 ? 'vending-mode' : ''} ${currentStage === 5 ? 'full-screen-sunset-mode' : ''}`}>
        {currentStage === 1 && (
          <CountdownStage
            secondsRemaining={secondsRemaining}
            setSecondsRemaining={setSecondsRemaining}
            onNextStage={() => setCurrentStage(2)}
          />
        )}

        {currentStage === 2 && (
          <PinStage
            onPinSuccess={handlePinSuccess}
            onRequestScanner={handleRequestScanner}
            isCuttingRibbon={isCuttingRibbon}
            isRibbonCut={isRibbonCut}
            onRibbonCutComplete={handleRibbonCutComplete}
            isScannerOpen={isScannerOpen}
          />
        )}

        {currentStage === 3 && (
          <VendingMachineStage
            onProceedToCelebration={() => {
              sounds.playRomanticChime();
              setCurrentStage(4); // Advance to the Red Thread of Destiny!
            }}
          />
        )}

        {currentStage === 4 && (
          <TwoThreadsStage
            onOpenLetter={() => {
              sounds.playRomanticChime();
              setCurrentStage(5); // Advance to Sibling Letter & Sky Shoot Finale!
            }}
            onRestartExperience={handleRestart}
          />
        )}

        {currentStage === 5 && (
          <SiblingLetterAndFireworksStage
            ref={siblingStageRef}
            onRestartExperience={handleRestart}
          />
        )}
      </main>

      {/* Pop-up of QR Scanner */}
      <ScannerModal
        isOpen={isScannerOpen}
        onComplete={handleScannerComplete}
      />
    </>
  );
}
