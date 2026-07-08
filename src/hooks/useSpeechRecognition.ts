import { useState, useEffect, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/services/gemini';
import { isSarvamConfigured, transcribeAudioWithSarvam, translateTextWithSarvam } from '@/services/sarvam';
import { convertWebmToWavBase64, initAudioContext } from '@/utils/audioUtils';

export interface UseSpeechRecognitionResult {
  text: string;
  isRecording: boolean;
  isTranscribing: boolean;
  recordingSeconds: number;
  startRecording: () => void;
  stopRecording: () => void;
  reset: () => void;
  error: string | null;
  mode: 'idle' | 'native' | 'whisper' | 'unsupported';
  progress: number;
  audioDataUrl: string | null;
}

export function useSpeechRecognition(preferredLang: string = 'en'): UseSpeechRecognitionResult {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'native' | 'whisper' | 'unsupported'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track latest text value asynchronously to prevent stale closure bugs
  const textRef = useRef('');
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText((prev) => (prev ? prev + ' ' + finalTranscript : finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.warn('Web Speech API Error:', event.error);
        if (event.error !== 'no-speech') {
          setMode('unsupported'); 
        }
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    // 1. Check for microphone browser support and secure context constraints
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isSecure) {
        setError('Microphone blocked: Secure context (HTTPS) is required on mobile browsers to record audio.');
      } else {
        setError('Microphone recording is not supported on this browser.');
      }
      setIsRecording(false);
      return;
    }

    // Initialize AudioContext immediately on user gesture to avoid Safari constraints
    initAudioContext();
    
    setError(null);
    setAudioDataUrl(null);
    audioChunksRef.current = [];
    setText('');
    setIsRecording(true);
    setRecordingSeconds(0);
    setProgress(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Clean up tracks
        stream.getTracks().forEach((track) => track.stop());

        // Defer execution by 150ms to allow mobile browsers to finish executing 
        // the asynchronous 'ondataavailable' macro-tasks and populate the chunks array.
        setTimeout(async () => {
          if (audioChunksRef.current.length === 0) {
            console.warn("No audio data collected.");
            setError("No audio data captured. Please make sure microphone is working.");
            setIsTranscribing(false);
            setMode('idle');
            return;
          }

          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          // Load the recording to data URL for local playback player
          const dataReader = new FileReader();
          dataReader.onload = () => {
            setAudioDataUrl(dataReader.result as string);
          };
          dataReader.readAsDataURL(audioBlob);

          // Run transcription if no real-time native speech was caught (primary on mobile)
          if (!textRef.current) {
            setMode('whisper');
            setIsTranscribing(true);
            
            try {
              let base64DataUrl = "";
              let activeMimeType = mimeType;

              try {
                console.log("Attempting client-side transcoding to standard WAV...");
                base64DataUrl = await convertWebmToWavBase64(audioBlob);
                activeMimeType = "audio/wav";
                console.log("WAV Transcoding successful!");
              } catch (transcodeErr) {
                console.warn("Client-side WAV transcode failed, falling back to raw container:", transcodeErr);
                // Fallback: read raw base64
                base64DataUrl = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(audioBlob);
                });
              }
              
              let transcription = "";
              
              if (isSarvamConfigured()) {
                console.log("Transcribing with Sarvam AI STT...");
                // 1. Get native transcription (e.g. Telugu script)
                const nativeText = await transcribeAudioWithSarvam(base64DataUrl, activeMimeType, preferredLang);
                
                if (nativeText && nativeText !== "Audio transcription could not be recognized.") {
                  console.log("Translating native transcription to English using Sarvam...");
                  const sourceLang = preferredLang === "en" ? "te" : preferredLang;
                  transcription = await translateTextWithSarvam(nativeText, sourceLang, "en");
                }
              }
              
              // Fallback directly to Gemini which translates the audio into English (UK)
              if (!transcription || transcription === "Audio transcription could not be recognized.") {
                console.log("Routing to Gemini for direct English (UK) translation...");
                transcription = await transcribeAudio(base64DataUrl, activeMimeType, preferredLang);
              }

              if (transcription && transcription !== "Audio transcription could not be recognized.") {
                setText(transcription);
              } else {
                setError('Could not recognize speech from audio.');
              }
            } catch (err) {
              console.error('Audio transcription fallback error:', err);
              setError('Failed to process audio for fallback transcription.');
            } finally {
              setIsTranscribing(false);
              setMode('idle');
            }
          }
        }, 150);
      };

      // Start recording - call without timeslice to prevent native time-slice recording bugs on mobile Safari
      mediaRecorder.start();
    } catch (err: any) {
      console.error('Mic access denied:', err);
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isSecure) {
        setError('Microphone blocked: Secure context (HTTPS) is required on mobile browsers.');
      } else {
        setError(`Microphone access error: ${err.message || err}`);
      }
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (recognitionRef.current && mode !== 'unsupported') {
      try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) {
          setMode('native');
          const bcp47Map: Record<string, string> = {
            en: 'en-US',
            hi: 'hi-IN',
            te: 'te-IN',
            ta: 'ta-IN'
          };
          recognitionRef.current.lang = bcp47Map[preferredLang] || 'en-US';
          recognitionRef.current.start();
        } else {
          setMode('whisper'); // Force fallback mode (Sarvam/Gemini) on mobile to avoid mic conflict
        }
      } catch (err) {
        console.warn('Native speech already started or failed', err);
      }
    } else {
      setMode('unsupported');
    }
  }, [mode, preferredLang]);

  const stopRecording = useCallback(() => {
    // Resume AudioContext on user stop gesture to satisfy Safari's gesture lock for decodeAudioData
    initAudioContext();

    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Stop Native Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    // Stop MediaRecorder (triggers the onstop event listener above)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = () => {
    setText('');
    setError(null);
    setMode('idle');
    setProgress(0);
    setIsTranscribing(false);
    setAudioDataUrl(null);
  };

  return {
    text,
    isRecording,
    isTranscribing,
    recordingSeconds,
    startRecording,
    stopRecording,
    reset,
    error,
    mode,
    progress,
    audioDataUrl
  };
}
