# VideoAI Frontend

This is the frontend for the VideoAI application, a luxury video creation platform powered by AI.

## Setup and Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Setup Tailwind CSS:
   ```
   npm run setup:tailwind
   ```

3. Start the development server:
   ```
   npm start
   ```

## Troubleshooting Tailwind CSS Issues

If you're experiencing issues with Tailwind CSS styles not being applied, try the following steps:

1. Rebuild the Tailwind CSS file:
   ```
   npm run build:css
   ```

2. Make sure your Tailwind configuration is correct:
   ```
   npx tailwindcss init -p
   ```

3. Check that the content paths in `tailwind.config.js` are correctly pointing to your source files.

4. Ensure that your `src/index.css` file contains the Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. Restart your development server:
   ```
   npm start
   ```

## Project Structure

- `src/components/UI`: Reusable UI components
- `src/components/Layout`: Layout components
- `src/components/Wizard`: Wizard steps for video creation
- `src/pages`: Main page components

## Technologies Used

- React
- React Router
- React Query
- Tailwind CSS
- Formik & Yup for form validation
- Axios for API requests