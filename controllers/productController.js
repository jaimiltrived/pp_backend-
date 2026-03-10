const { Product } = require('../config/db');
const EmbeddingService = require('../utils/EmbeddingService');
const { cosineSimilarity } = require('../utils/cosineSimilarity');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // Smart CRUD: Automatically generate embedding for local semantic search
    const embeddingService = await EmbeddingService.getInstance();
    const textToEmbed = `${product.name} ${product.description || ''} ${product.category || ''}`;
    const embedding = await embeddingService.getEmbedding(textToEmbed);
    product.embedding = Buffer.from(embedding.buffer);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product', details: error.message });
  }
};

exports.aiSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const embeddingService = await EmbeddingService.getInstance();
    const queryEmbedding = await embeddingService.getEmbedding(query);

    const products = await Product.findAll();

    const scoredProducts = products
      .filter(product => product.embedding)
      .map(product => {
        try {
          const embeddingBuffer = Buffer.from(product.embedding);
          const productEmbedding = new Float32Array(
            embeddingBuffer.buffer,
            embeddingBuffer.byteOffset,
            embeddingBuffer.length / Float32Array.BYTES_PER_ELEMENT
          );
          const score = cosineSimilarity(queryEmbedding, productEmbedding);
          return { ...product.toJSON(), score };
        } catch (e) {
          console.error(`Error processing embedding for product ${product.id}:`, e);
          return null;
        }
      })
      .filter(p => p !== null);

    scoredProducts.sort((a, b) => b.score - a.score);

    res.json(scoredProducts.slice(0, 10)); // Return top 10 results

  } catch (error) {
    console.error('AI Search error stack:', error.stack);
    res.status(500).json({ error: 'AI search failed', details: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;

    if (search) {
      console.log(`Performing smart list search for: "${search}"`);
      const embeddingService = await EmbeddingService.getInstance();
      const queryEmbedding = await embeddingService.getEmbedding(search);

      const products = await Product.findAll();

      const scoredProducts = products
        .filter(product => product.embedding)
        .map(product => {
          try {
            const embeddingBuffer = Buffer.from(product.embedding);
            const productEmbedding = new Float32Array(
              embeddingBuffer.buffer,
              embeddingBuffer.byteOffset,
              embeddingBuffer.length / Float32Array.BYTES_PER_ELEMENT
            );
            const score = cosineSimilarity(queryEmbedding, productEmbedding);
            return { ...product.toJSON(), score };
          } catch (e) {
            return null;
          }
        })
        .filter(p => p !== null);

      scoredProducts.sort((a, b) => b.score - a.score);
      return res.json(scoredProducts.slice(0, 20));
    }

    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('getAllProducts smart error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Smart Read: Find similar products
    let similarProducts = [];
    if (product.embedding) {
      const embeddingBuffer = Buffer.from(product.embedding);
      const productEmbedding = new Float32Array(
        embeddingBuffer.buffer,
        embeddingBuffer.byteOffset,
        embeddingBuffer.length / Float32Array.BYTES_PER_ELEMENT
      );

      const allProducts = await Product.findAll();
      similarProducts = allProducts
        .filter(p => p.id !== product.id && p.embedding)
        .map(p => {
          try {
            const otherBuffer = Buffer.from(p.embedding);
            const otherEmbedding = new Float32Array(
              otherBuffer.buffer,
              otherBuffer.byteOffset,
              otherBuffer.length / Float32Array.BYTES_PER_ELEMENT
            );
            const score = cosineSimilarity(productEmbedding, otherEmbedding);
            return { ...p.toJSON(), score };
          } catch (e) {
            return null;
          }
        })
        .filter(p => p !== null && p.score > 0.4) // Only show relevant ones
        .sort((a, b) => b.score - a.score)
        .slice(0, 4); // Top 4 similar
    }

    res.json({
      ...product.toJSON(),
      similarProducts
    });
  } catch (error) {
    console.error('getProductById smart error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Update fields
    await product.update(req.body);

    // Smart CRUD: If relevant fields changed, update the embedding for semantic search
    if (req.body.name || req.body.description || req.body.category) {
      console.log('Regenerating embedding for updated product...');
      const embeddingService = await EmbeddingService.getInstance();
      const textToEmbed = `${product.name} ${product.description || ''} ${product.category || ''}`;
      const embedding = await embeddingService.getEmbedding(textToEmbed);
      product.embedding = Buffer.from(embedding.buffer);
      await product.save();
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
