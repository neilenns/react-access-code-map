# Use a Node.js base image with a specific version
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install app dependencies
RUN pnpm ci

# Copy the TypeScript source code to the working directory
COPY . ./

# Build the TypeScript app
RUN npm run build

# Use a lightweight base image
FROM node:18-alpine

LABEL org.opencontainers.image.source=https://github.com/neilenns/react-access-code-map
LABEL org.opencontainers.image.description="Backend server for the Access Code Map project."
LABEL org.opencontainers.image.licenses=MIT

# Install curl for the healthcheck
RUN apk --no-cache add curl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the built distribution files from the previous build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN pnpm ci --only=production

# Expose the port on which your Express.js app listens
EXPOSE 3001

# Pull the version from the github build environment
ARG VERSION
ENV VERSION=${VERSION:-dev}
RUN echo $VERSION

# Set the entrypoint file
CMD ["node", "dist/index.js"]