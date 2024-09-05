# Frontend Dockerfile - React Native development environment
FROM node:16

# Install dependencies needed for Android/iOS build tools (if needed)
RUN apt-get update && apt-get install -y \
  openjdk-11-jdk \
  gradle \
  && apt-get clean

# Set working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN npm install

# Copy project files
COPY . .

# Expose any necessary ports (if using for development server)
EXPOSE 8081

# Command to start development server (Metro Bundler for React Native)
CMD ["expo", "start"]
