const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
  static instance = null;
  
  constructor() {
    this.pipe = null;
  }

  async init() {
    if (!this.pipe) {
      console.log('Loading embedding model...');
      this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('Embedding model loaded.');
    }
  }

  async getEmbedding(text) {
    if (!this.pipe) {
      await this.init();
    }
    const output = await this.pipe(text, { pooling: 'mean', normalize: true });
    return output.data; // Returns a Float32Array
  }

  static async getInstance() {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
      await EmbeddingService.instance.init();
    }
    return EmbeddingService.instance;
  }
}

module.exports = EmbeddingService;
