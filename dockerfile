# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller base image for the final build
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=base /app ./

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
