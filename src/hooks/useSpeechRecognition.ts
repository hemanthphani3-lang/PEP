import { useState, useEffect, useRef, useCallback } from 'react';

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
}

export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'native' | 'whisper' | 'unsupported'>('idle');
  const [progress, setProgress] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Worker for Whisper fallback
  useEffect(() => {
    // Create the worker
    workerRef.current = new Worker(new URL('../workers/whisper.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event) => {
      const { status, text: resultText, data, error: err } = event.data;

      if (status === 'progress') {
        if (data?.progress !== undefined) {
          setProgress(data.progress);
        }
      } else if (status === 'ready') {
        setProgress(100);
      } else if (status === 'complete') {
        setIsTranscribing(false);
        setText(resultText);
        setMode('whisper');
      } else if (status === 'error') {
        setIsTranscribing(false);
        setError(err || 'Whisper transcription failed');
      }
    };

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
      if (workerRef.current) workerRef.current.terminate();
      if (recognitionRef.current) recognitionRef.current.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setText('');
    setIsRecording(true);
    setRecordingSeconds(0);
    setProgress(0);
    audioChunksRef.current = [];

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

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
    } catch (err) {
      console.error('Mic access denied:', err);
      setError('Microphone access denied.');
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (recognitionRef.current && mode !== 'unsupported') {
      try {
        setMode('native');
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Native speech already started or failed', err);
      }
    } else {
      setMode('unsupported');
    }
  }, [mode]);

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

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // If we didn't get any text from Native Speech (or it failed), use Whisper Fallback
      setTimeout(() => {
        if (!text && audioChunksRef.current.length > 0 && workerRef.current) {
          setMode('whisper');
          setIsTranscribing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert Blob to Float32Array for Whisper
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000 // Whisper requires 16kHz
          });
          
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const arrayBuffer = reader.result as ArrayBuffer;
              const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
              const offlineContext = new OfflineAudioContext(1, audioBuffer.length, 16000);
              const source = offlineContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(offlineContext.destination);
              source.start();
              const renderedBuffer = await offlineContext.startRendering();
              const float32Array = renderedBuffer.getChannelData(0);
              
              workerRef.current!.postMessage({ audio: float32Array });
            } catch (err) {
              console.error('Audio decoding error:', err);
              setError('Failed to process audio for fallback transcription.');
              setIsTranscribing(false);
            }
          };
          reader.readAsArrayBuffer(audioBlob);
        }
      }, 500); // Give native API half a second to fire final onresult
    }
  }, [text]);

  const reset = () => {
    setText('');
    setError(null);
    setMode('idle');
    setProgress(0);
    setIsTranscribing(false);
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
    progress
  };
}
