# Mood Dashboard App

## Overview

The Mood Dashboard App is a real-time web application designed for capturing and visualizing participant mood feedback during live events. Built as a full-stack application using React and Express, it provides an easy-to-use interface for participants to submit their moods via QR codes and displays comprehensive analytics on a live dashboard. The application is optimized for small-scale events with under 100 participants and focuses on real-time data visualization with features like pie charts, mood feeds, heatmaps, and trend analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing Vite as the build tool for fast development and optimized production builds. The architecture follows a component-based design pattern with:

- **UI Framework**: React with shadcn/ui components for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture  
The server-side application uses Express.js with TypeScript, implementing a RESTful API design:

- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints for mood submission, retrieval, and statistics
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot reloading with Vite integration in development mode

### Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL hosted on Neon serverless platform
- **ORM**: Drizzle ORM for schema definition and query building
- **Schema**: Single table design for mood submissions with optional user identification
- **Connection**: Connection pooling with WebSocket support for serverless environments

### Authentication and Authorization
The current implementation includes placeholder authentication infrastructure but focuses on anonymous mood submissions:

- **User System**: Basic user schema exists for future authentication needs
- **Privacy**: Anonymous submissions supported with optional name/email collection
- **Consent**: Built-in privacy consent tracking for submitted moods

### Real-time Features
The application implements near real-time updates through polling mechanisms:

- **Auto-refresh**: Dashboard components refresh every 5 seconds
- **Live Updates**: Mood feed and statistics update automatically
- **Visual Feedback**: Animated components and floating emojis for engagement

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Drizzle Kit**: Database migration and schema management tools

### Frontend Libraries
- **Radix UI**: Accessible component primitives for form controls and interactions
- **Chart.js**: Dynamic chart generation for mood visualization (loaded via CDN)
- **QRCode.js**: QR code generation for participant access (loaded via CDN)
- **TanStack Query**: Server state management and caching
- **Date-fns**: Date formatting and manipulation utilities

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **Replit Integration**: Development environment plugins for runtime error handling
- **ESBuild**: Production bundling for server-side code
- **TypeScript**: Type checking and compilation across the entire stack

### Styling and UI
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **shadcn/ui**: Pre-built accessible React components
- **Lucide React**: Icon library for consistent iconography
- **CSS Variables**: Dynamic theming system for customizable appearance

### Utility Libraries
- **Zod**: Schema validation for forms and API endpoints
- **Class Variance Authority**: Component variant management
- **CLSX/Tailwind Merge**: Conditional CSS class handling
- **Nanoid**: Unique ID generation for development features