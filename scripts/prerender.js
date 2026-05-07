import fs from 'fs';
import path from 'path';

// Static HTML content for crawlers and scrapers
// This runs after npm run build
// Injects real content into dist/index.html

const distPath = path.resolve('dist/index.html');

if (!fs.existsSync(distPath)) {
  console.log('Run npm run build first');
  process.exit(1);
}

let html = fs.readFileSync(distPath, 'utf-8');

// Inject static content inside root div
// Crawlers see this before JS loads
const staticContent = `
<div id="root">
  <!-- Static content for crawlers — React replaces this on load -->
  <header>
    <h1>Gold Rate Today India — Live 24K 22K Price | Assetory</h1>
  </header>
  <main>
    <section>
      <h2>Today's Gold Rate in India</h2>
      <p>Live 24K gold price per 10 grams updated every 25 minutes from MCX and IBJA. Check today's gold rate, silver price per kg, copper rate and free gold calculator with making charges.</p>
    </section>
    <section>
      <h2>Gold Rate Calculator India</h2>
      <p>Calculate gold jewellery price with making charges and GST for 24K, 22K and 18K gold.</p>
    </section>
    <section>
      <h2>Silver Rate Today India</h2>
      <p>Live silver price per kilogram updated in real-time from international spot markets.</p>
    </section>
    <section>
      <h2>Gold Market News India</h2>
      <p>Latest gold and silver market news from India — MCX gold rate, IBJA updates and commodity market analysis.</p>
    </section>
  </main>
</div>`;

html = html.replace(
  '<div id="root"></div>',
  staticContent
);

fs.writeFileSync(distPath, html);
console.log('✅ Static content injected into dist/index.html');
console.log('✅ Crawlers can now read your content');
console.log('✅ Deploy dist/ folder to Vercel');
