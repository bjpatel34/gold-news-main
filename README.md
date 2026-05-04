# GoldPolice — Live Gold & Silver Price in India Today

GoldPolice is a comprehensive, real-time fintech terminal designed to track live Gold and Silver prices in India. It offers accurate conversions, market premiums, and automated price refresh mechanisms to ensure a seamless and reliable user experience.

## Features

- **Live Precious Metal Prices:** Real-time tracking of Gold (per 10g) and Silver (per 1kg) in INR.
- **Advanced Currency Conversion:** Live USD-to-INR conversion logic with calibrated Indian market premiums.
- **Robust API Integrations:** Powered by Gold-API.com and Metals.Dev for real-time market data, with intelligent fallbacks.
- **Automated Refresh System:** Decoupled data pipelines to refresh prices and news streams at optimal intervals without hitting rate limits.
- **High-Fidelity UI:** A responsive, premium dashboard built with shadcn/ui, Tailwind CSS, and a custom-animated 3D AI Analyst bot.
- **Resilience:** Built-in caching and mock data fallbacks to guarantee 100% UI uptime even during API disruptions.

## Technologies Used

- **Frontend Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State & Data Management:** React Query, React Router DOM
- **Data APIs:** Gold-API.com, Metals.Dev, NewsData.io
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js & npm installed

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/bjpatel34/gold-news-main.git
   ```

2. Navigate to the project directory:
   ```sh
   cd gold-news-main
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Set up Environment Variables:
   Create a `.env` file in the root directory and add the necessary API keys for Gold-API.com, Metals.Dev, and NewsData.io.

5. Start the development server:
   ```sh
   npm run dev
   ```

### Building for Production

To create a production-ready build:
```sh
npm run build
```

The compiled application will be generated in the `dist` folder.

## Project Architecture

- **`src/components/`**: Reusable UI components (buttons, dialogs, cards, etc.).
- **`src/lib/`**: Core utilities, API clients (e.g., `goldApi.ts`), and application configurations.
- **`src/pages/`**: Main application routes and page-level layouts.
- **`public/`**: Static assets including logos, icons, and 3D character models.

## License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited unless explicitly authorized.
