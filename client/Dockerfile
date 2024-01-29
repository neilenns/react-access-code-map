# General flow from https://www.howtogeek.com/devops/how-to-dockerise-a-react-app/.
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Copy the app source code to the working directory
COPY . ./
RUN npm run build

# From https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
FROM nginx:alpine

LABEL org.opencontainers.image.source=https://github.com/neilenns/react-access-code-map
LABEL org.opencontainers.image.description="Website for the Access Code Map project."
LABEL org.opencontainers.image.licenses=MIT

# Install curl for the healthcheck
RUN apk --no-cache add curl

# This is key, it's the location that nginx expects to find the source files
# for the website
WORKDIR /usr/share/nginx/html

# Create the folder where the docker-entrypoint.sh file will live
RUN mkdir -p /usr/src/app

# Delete any default static HTML files that come with the image
RUN rm -rf ./*

# Copy the app
COPY --from=build /app/dist/ .
COPY --from=build /app/docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]