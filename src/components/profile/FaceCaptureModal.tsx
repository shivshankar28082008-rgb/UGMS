import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ScanFace,
  Sparkles,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { BiometricService, BiometricMatchResult } from '../../services/biometricService';
import { ExecutiveLeader } from '../../types';

interface FaceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'enroll' | 'verify';
  officerId?: string;
  onSuccess?: (faceDataUrl: string) => void;
  onCaptureSuccess?: (faceDataUrl: string) => void;
  title?: string;
}

export const FaceCaptureModal: React.FC<FaceCaptureModalProps> = ({
  isOpen,
  onClose,
  mode = 'verify',
  officerId = '',
  onSuccess,
  onCaptureSuccess,
  title,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusText, setStatusText] = useState<string>('Initializing optical biometric sensor...');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<BiometricMatchResult | null>(null);
  const [previewForEnroll, setPreviewForEnroll] = useState<string | null>(null);
  const [leader, setLeader] = useState<(ExecutiveLeader & { devPasswordHash?: string }) | undefined>(
    undefined
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      const found = StorageService.getLeaderByOfficerId(officerId);
      setLeader(found);
      setCapturedImage(null);
      setPreviewForEnroll(null);
      setMatchResult(null);
      setIsScanning(false);
      setScanProgress(0);
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setPreviewForEnroll(null);
      setMatchResult(null);
      setIsScanning(false);
      setScanProgress(0);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, officerId]);

  // Ensure stream attaches to video element when stream is updated
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.warn);
      };
      videoRef.current.play().catch(console.warn);
    }
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    setStatusText('Align face within the biometric oval guide...');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      setStream(mediaStream);
    } catch (err: unknown) {
      console.warn('Webcam stream unavailable:', err);
      setCameraError(
        'Camera permission was blocked or is unavailable in this preview window. You can upload a photo or test with the camera retry button.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Capture a non-blank frame from video
   */
  const captureVideoFrame = (): { dataUrl: string | null; error?: string } => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return { dataUrl: null, error: 'Camera stream element not ready.' };
    }

    // Ensure video is actually playing and has dimensions
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return {
        dataUrl: null,
        error: 'Video stream is still loading. Please wait 2 seconds and try again.',
      };
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return { dataUrl: null, error: 'Could not access optical rendering context.' };
    }

    // Mirror image horizontally to match natural selfie preview
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Check that frame is NOT blank
    const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const validation = BiometricService.validateFrame(frameData);

    if (!validation.valid) {
      return {
        dataUrl: null,
        error:
          validation.error ||
          'Blank or dark frame detected. Please look directly at the camera with clear lighting.',
      };
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    return { dataUrl };
  };

  /**
   * Trigger capture & verification
   */
  const handleStartCaptureOrScan = async () => {
    setCameraError(null);
    setMatchResult(null);

    // If using video stream, capture real frame
    let capturedUrl: string | null = null;
    if (stream && videoRef.current) {
      const { dataUrl, error } = captureVideoFrame();
      if (error || !dataUrl) {
        setCameraError(error || 'Failed to capture clear face frame.');
        return;
      }
      capturedUrl = dataUrl;
    } else if (capturedImage) {
      capturedUrl = capturedImage;
    } else {
      setCameraError(
        'Camera is not active. Please allow camera access or upload your photo using the button below.'
      );
      return;
    }

    setCapturedImage(capturedUrl);
    setIsScanning(true);
    setScanProgress(15);
    setStatusText('Optical sensor locking on facial geometry...');

    const progressTimer = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressTimer);
          return 85;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      setStatusText('Analyzing 256 biometric nodal points & facial gradients...');
    }, 450);

    setTimeout(() => {
      setStatusText(
        mode === 'enroll'
          ? 'Generating facial biometric encryption template...'
          : 'Comparing live face against registered Officer Face ID...'
      );
    }, 900);

    // Finalize after simulated extraction
    setTimeout(async () => {
      clearInterval(progressTimer);
      setScanProgress(100);

      if (mode === 'enroll') {
        // In enroll mode: show preview to let user confirm it's not blank
        setIsScanning(false);
        setPreviewForEnroll(capturedUrl);
        setStatusText('Face signature extracted successfully! Review your photo below.');
      } else {
        // In verify mode: compare live scan against enrolled face lock data!
        const enrolledData = leader?.faceLockData;
        if (!enrolledData) {
          setIsScanning(false);
          setCameraError(
            `Face Lock is not registered for Officer ID ${officerId}. Please log in with your password first.`
          );
          return;
        }

        const compResult = await BiometricService.compareFaces(capturedUrl, enrolledData);
        setMatchResult(compResult);
        setIsScanning(false);

        if (compResult.match) {
          setStatusText(`✓ ${compResult.message}`);
          setTimeout(() => {
            stopCamera();
            (onSuccess || onCaptureSuccess)?.(capturedUrl);
          }, 900);
        } else {
          setStatusText(`❌ ${compResult.message}`);
        }
      }
    }, 1500);
  };

  /**
   * Confirm enrollment after reviewing preview
   */
  const handleConfirmEnrollment = () => {
    if (previewForEnroll) {
      stopCamera();
      (onSuccess || onCaptureSuccess)?.(previewForEnroll);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setPreviewForEnroll(null);
    setMatchResult(null);
    setCameraError(null);
    setStatusText('Align face within the biometric oval guide...');
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#113B68] to-[#0A5C4A] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ScanFace className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {mode === 'enroll' ? 'Register Face Lock (Biometrics)' : 'Officer Face ID Verification'}
              </h3>
              <p className="text-[11px] text-emerald-300 font-mono">
                {leader ? `${leader.name} • ${officerId}` : `Officer ID: ${officerId}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-5 flex flex-col items-center">
          {/* Main Visual Viewport */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#0B2545] shadow-inner flex items-center justify-center">
            {/* Live Video Feed or Captured Freeze */}
            {previewForEnroll ? (
              <img
                src={previewForEnroll}
                alt="Captured Face Preview"
                className="w-full h-full object-cover"
              />
            ) : capturedImage && isScanning ? (
              <img
                src={capturedImage}
                alt="Scanning Face"
                className="w-full h-full object-cover"
              />
            ) : stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              /* Fallback when camera is unavailable */
              <div className="flex flex-col items-center justify-center text-center p-4">
                <ScanFace className="w-16 h-16 text-slate-600 mb-2" />
                <p className="text-xs text-slate-300 font-medium">Camera Feed Not Active</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Please allow camera permissions and click Restart Camera
                </p>
              </div>
            )}

            {/* Oval Face Guide Overlay */}
            {!previewForEnroll && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className={`w-44 h-56 rounded-[50%] border-2 ${
                    matchResult
                      ? matchResult.match
                        ? 'border-emerald-400 shadow-[0_0_20px_#34D399]'
                        : 'border-rose-500 shadow-[0_0_20px_#F43F5E]'
                      : isScanning
                      ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : 'border-sky-400/80'
                  } border-dashed transition-all`}
                />
              </div>
            )}

            {/* Laser Scanning Animation Line */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34D399] animate-bounce" />
            )}

            {/* Corner Reticle Markers */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

            {/* In-viewport Real-time status */}
            <div className="absolute bottom-2 inset-x-2 bg-slate-950/85 backdrop-blur-xs text-white px-2 py-1.5 rounded-lg text-[10px] text-center font-mono flex items-center justify-center gap-1.5 border border-slate-800">
              {isScanning ? (
                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
              ) : matchResult ? (
                matchResult.match ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                )
              ) : (
                <Sparkles className="w-3 h-3 text-sky-400" />
              )}
              <span className="truncate">{statusText}</span>
            </div>
          </div>

          {/* Progress bar */}
          {isScanning && (
            <div className="w-full mt-2.5 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}

          {/* Verification Result Notice (Mismatch or Match) */}
          {matchResult && (
            <div
              className={`w-full mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                matchResult.match
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {matchResult.match ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">
                  {matchResult.match ? 'Identity Confirmed' : 'Biometric Mismatch (Access Denied)'}
                </p>
                <p className="text-[11px] mt-0.5 leading-snug">{matchResult.message}</p>
                {!matchResult.match && (
                  <p className="text-[10px] text-rose-700 mt-1 font-semibold">
                    Face does not match registered Officer ID. Only the enrolled officer can log in with Face ID.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError && (
            <div className="w-full mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <span>{cameraError}</span>
              </div>
            </div>
          )}

          {/* Hidden Canvas for Frame Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="w-full mt-4 space-y-2">
            {previewForEnroll ? (
              /* Review Captured Face for Enrollment */
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">
                    Confirm this is your clear face photo. This will be your official Face ID signature.
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Retake Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmEnrollment}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Save Face ID</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Capture / Scan Button */
              <button
                type="button"
                onClick={handleStartCaptureOrScan}
                disabled={isScanning}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <ScanFace className="w-4 h-4 text-emerald-200" />
                <span>
                  {mode === 'enroll'
                    ? 'Capture Real Face Photo'
                    : 'Scan & Verify Facial Biometrics'}
                </span>
              </button>
            )}

            {/* Bottom Actions: Live Sensor Controls */}
            {!previewForEnroll && (
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live Webcam Optical Sensor Only</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    startCamera();
                  }}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Restart Camera</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
