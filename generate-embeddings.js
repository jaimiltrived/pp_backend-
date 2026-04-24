const { Product } = require('./config/db');
const EmbeddingService = require('./utils/EmbeddingService');

async function generateEmbeddings() {
  try {
    console.log('Starting embedding generation for products...');

    const embeddingService = await EmbeddingService.getInstance();

    const products = await Product.findAll();

    for (const product of products) {
      const textToEmbed = `${product.name} ${product.description || ''} ${product.category || ''}`;
      const embedding = await embeddingService.getEmbedding(textToEmbed);
      
      // Convert Float32Array to Buffer for storage in BLOB column
      product.embedding = Buffer.from(embedding.buffer);
      await product.save();
      console.log(`Generated embedding for product: ${product.name}`);
    }

    console.log('All product embeddings generated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error generating product embeddings:', error);
    process.exit(1);
  }
}

generateEmbeddings();
