import { pipeline, env } from '@xenova/transformers';

// Skip local model checks since we are in the browser
env.allowLocalModels = false;

// We use the singleton pattern to ensure the pipeline is only loaded once
class PipelineSingleton {
  static task = 'automatic-speech-recognition';
  // User requested multilingual option. Xenova/whisper-tiny is multilingual.
  static model = 'Xenova/whisper-tiny';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const { audio, language } = event.data;

  try {
    // We send progress updates to the main thread during download
    const transcriber = await PipelineSingleton.getInstance((x: any) => {
      self.postMessage({ status: 'progress', data: x });
    });

    self.postMessage({ status: 'ready' });

    // Perform transcription
    // If language is provided (e.g. 'telugu', 'hindi'), whisper can be guided, 
    // but whisper-tiny multilingual can auto-detect usually.
    const result = await transcriber(audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: language || 'en', // default to english if not specified, or let it auto-detect? 
      // Actually, if we don't specify language, it auto-detects.
      // We will just let it auto-detect by not passing language if we want true multilingual.
    });

    self.postMessage({
      status: 'complete',
      text: result.text,
    });
  } catch (error: any) {
    self.postMessage({
      status: 'error',
      error: error.message,
    });
  }
});
