import { useState, useEffect, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/services/gemini';
import { isSarvamConfigured, transcribeAudioWithSarvam } from '@/services/sarvam';
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

        if (audioChunksRef.current.length === 0) {
          console.warn("No audio data collected.");
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
            const reader = new FileReader();
            reader.onload = async () => {
              try {
                const base64DataUrl = reader.result as string;
                let transcription = "";
                
                if (isSarvamConfigured()) {
                  console.log("Transcribing with Sarvam AI STT...");
                  transcription = await transcribeAudioWithSarvam(base64DataUrl, mimeType, preferredLang);
                }
                
                if (!transcription || transcription === "Audio transcription could not be recognized.") {
                  console.log("Transcribing with Gemini Speech-to-Text...");
                  transcription = await transcribeAudio(base64DataUrl, mimeType, preferredLang);
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
            };
            reader.readAsDataURL(audioBlob);
          } catch (err) {
            console.error("Critical error in fallback logic", err);
            setIsTranscribing(false);
            setMode('idle');
          }
        }
      };

      // Start recording - call without timeslice to prevent native time-slice recording bugs on mobile Safari
      mediaRecorder.start();
    } catch (err) {
      console.error('Mic access denied:', err);
      setError('Microphone access denied.');
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
