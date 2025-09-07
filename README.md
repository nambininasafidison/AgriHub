# AgriCommerceHub

An e-commerce platform for agricultural products in Madagascar.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Databases**:
  - PostgreSQL with Drizzle ORM (users, orders, promotions)
  - MongoDB with Mongoose (products, cart, analytics)
- **Authentication**: JWT-based authentication
- **Deployment**: Docker, Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- pnpm (recommended)

### Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/nambininasafidison/agricom.git
cd agricom
\`\`\`

2. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

3. Start the development databases:

\`\`\`bash
docker-compose -f docker-compose.dev.yml up -d
\`\`\`

4. Set up environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

5. Initialize the databases:

\`\`\`bash
pnpm run init-db
\`\`\`

6. Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Structure

### t (Relational Data)

- Users and authentication
- Orders and transactions
- Shipping addresses
- Promotions and coupons

### MongoDB (Product Data)

- Products and product details
- Cart items
- Analytics and activity logs
- Reviews

## Development

### Running Tests

\`\`\`bash
pnpm test
\`\`\`

### Building for Production

\`\`\`bash
pnpm build
\`\`\`

### Running in Production

\`\`\`bash
docker-compose up -d
\`\`\`

## Deployment

The application can be deployed to Vercel or any other platform that supports Next.js.

For containerized deployment, use the provided Docker configuration.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
