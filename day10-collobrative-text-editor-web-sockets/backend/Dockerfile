# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app
CMD ["node", "dist/index.js"]