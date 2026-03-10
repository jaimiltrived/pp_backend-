const { IndustryCode } = require('./config/db');

async function seed() {
  try {
    const industries = [
      { code: 'IT001', name: 'Information Technology', description: 'Software, hardware and services' },
      { code: 'AG001', name: 'Agriculture', description: 'Farming and food production' },
      { code: 'MF001', name: 'Manufacturing', description: 'Factory and production' },
      { code: 'HC001', name: 'Healthcare', description: 'Medical and health services' },
      { code: 'ED001', name: 'Education', description: 'Teaching and training' }
    ];

    for (const industry of industries) {
      await IndustryCode.findOrCreate({
        where: { code: industry.code },
        defaults: industry
      });
    }

    console.log('Industries seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding industries:', error);
    process.exit(1);
  }
}

seed();
