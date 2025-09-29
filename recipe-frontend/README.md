# Recipe Collection App

A modern React application for browsing and viewing recipe collections. Built with TypeScript, React Router, and Vite for a fast and responsive user experience.

## 🍳 Features

- **Recipe Cards**: Browse recipes in a clean grid layout with images, titles, and key information
- **Recipe Details**: Click any recipe to view detailed information in a tabbed interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Fast Loading**: Built with Vite for optimal development and build performance
- **Type Safety**: Full TypeScript support for better development experience

## 📁 Project Structure

```
src/
├── components/
│   ├── RecipeCard.tsx       # Individual recipe card component
│   ├── RecipeList.tsx       # Main recipe listing page
│   ├── RecipeDetail.tsx     # Detailed recipe view with tabs
│   └── *.css               # Component-specific styles
├── types/
│   └── Recipe.ts           # TypeScript type definitions
├── App.tsx                 # Main application component with routing
└── main.tsx               # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Ensure the recipe data file is in the correct location:
   - The app expects recipe data at `public/data/recipe_example_data.json`
   - Make sure this file exists and contains valid recipe data

### Running the Application

#### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

#### Build for Production

Create a production build:

```bash
npm run build
```

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 🎯 Usage

1. **Browse Recipes**: The home page displays all available recipes as interactive cards
2. **View Details**: Click any recipe card to navigate to the detailed view
3. **Explore Information**: Use the tabs in the detail view to see:
   - **Overview**: General information, tags, and external links
   - **Nutrition**: Calorie and macronutrient information
   - **Details**: Technical details like prep time, cuisine, and category
4. **Navigate Back**: Use the back button to return to the recipe list

## 🛠 Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router for client-side navigation
- **Styling**: CSS modules with responsive design
- **Data**: JSON-based recipe data loading

## 📊 Data Format

The application expects recipe data in the following JSON structure:

```json
{
  "meals": [
    {
      "recipe": {
        "id": "string",
        "name": "string",
        "image": "string",
        "headline": "string",
        "prepTime": "string",
        "nutrition": {
          "calories": "number",
          "carbohydrate": "number",
          "protein": "number"
        }
      }
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
