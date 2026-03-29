#!/bin/bash

echo "Regenerating Tailwind CSS..."
npx tailwindcss -i ./src/index.css -o ./src/output.css

echo "Creating a CSS reference file..."
echo "@import './output.css';" > ./src/tailwind.css

echo "Updating the import in index.js..."