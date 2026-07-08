import { useState, useEffect, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/services/gemini';
import { isSarvamConfigured, transcribeAudioWithSarvam } from '@/services/sarvam';
import { convertWebmToWavBase64 } from '@/utils/audioUtils';


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
    setError(null);
    setAudioDataUrl(null);
    audioChunksRef.current = [];
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
        const bcp47Map: Record<string, string> = {
          en: 'en-US',
          hi: 'hi-IN',
          te: 'te-IN',
          ta: 'ta-IN'
        };
        recognitionRef.current.lang = bcp47Map[preferredLang] || 'en-US';
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
      
      // We always want to capture the audio Blob to save it for playback, regardless of which speech engine runs.
      setTimeout(async () => {
        if (audioChunksRef.current.length === 0) return;
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        const dataReader = new FileReader();
        dataReader.onload = () => {
          setAudioDataUrl(dataReader.result as string);
        };
        dataReader.readAsDataURL(audioBlob);

        // Use Native Speech API (Chrome's Google Cloud STT) as PRIMARY for best Indian language accuracy.
        // Fall back to Sarvam AI or Gemini if Native speech completely failed to capture text.
        if (!text) {
          setMode('whisper'); // keeping state name for compatibility with UI
          setIsTranscribing(true);
          
          try {
            // Convert WebM Blob to WAV Base64 string for Sarvam
            const wavBase64Url = await convertWebmToWavBase64(audioBlob);
            
            // We use the original base64DataUrl for Gemini if Sarvam fails (as Gemini supports WebM natively)
            const reader = new FileReader();
            reader.onload = async () => {
              try {
                const base64DataUrl = reader.result as string;
                let transcription = "";
                
                if (isSarvamConfigured()) {
                  console.log("Transcribing fallback with Sarvam AI STT...");
                  // Pass the WAV data instead of WebM
                  transcription = await transcribeAudioWithSarvam(wavBase64Url, 'audio/wav', preferredLang);
                }
                
                // If Sarvam is not configured or failed to return text, fallback to Gemini
                if (!transcription || transcription === "Audio transcription could not be recognized.") {
                  console.log("Transcribing fallback with Gemini Speech-to-Text...");
                  transcription = await transcribeAudio(base64DataUrl, mimeType, preferredLang);
                }

                if (transcription && transcription !== "Audio transcription could not be recognized.") {
                  setText(transcription);
                } else {
                  setError('Could not recognize speech from audio.');
                }
                setIsTranscribing(false);
                setMode('idle');
              } catch (err) {
                console.error('Audio transcription fallback error:', err);
                setError('Failed to process audio for fallback transcription.');
                setIsTranscribing(false);
                setMode('idle');
              }
            };
            reader.readAsDataURL(audioBlob);
          } catch (err) {
            console.error("Failed to convert audio to WAV", err);
            setIsTranscribing(false);
            setMode('idle');
          }
        }
      }, 500); // Give native API half a second to fire final onresult
    }
  }, [text, progress]);

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
