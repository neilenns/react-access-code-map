# General flow from https://www.howtogeek.com/devops/how-to-dockerise-a-react-app/.
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Set the REACT_APP_SERVER_URL value at build time, since React
# apps have environment variables compiled in at build time. This
# means the only way to change the server URL is to rebuild the image.
# Solution from https://stackoverflow.com/a/52194018.
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL

# Copy the app source code to the working directory
COPY . ./
RUN npm run build

# From https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
FROM nginx:alpine

# This is key, it's the location that nginx expects to find the source files
# for the website
WORKDIR /usr/share/nginx/html

# Delete any default static HTML files that come with the image
RUN rm -rf ./*
COPY --from=build /app/build/ .
ENTRYPOINT ["nginx", "-g", "daemon off;"]