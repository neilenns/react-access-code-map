FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Label the image so it uploads to the project repo from the command line
LABEL org.opencontainers.image.source=https://github.com/neilenns/clearancelab
LABEL org.opencontainers.image.description="Devcontainer image for clearancelab project"

# Install MongoDB command line tools - though mongo-database-tools not available on arm64
ARG MONGO_TOOLS_VERSION=6.0
RUN . /etc/os-release \
	&& curl -sSL "https://www.mongodb.org/static/pgp/server-${MONGO_TOOLS_VERSION}.asc" | gpg --dearmor > /usr/share/keyrings/mongodb-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] http://repo.mongodb.org/apt/debian ${VERSION_CODENAME}/mongodb-org/${MONGO_TOOLS_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_TOOLS_VERSION}.list \
	&& apt-get update && export DEBIAN_FRONTEND=noninteractive \
	&& apt-get install -y mongodb-mongosh \
	&& if [ "$(dpkg --print-architecture)" = "amd64" ]; then apt-get install -y mongodb-database-tools; fi \
	&& apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10.10.0