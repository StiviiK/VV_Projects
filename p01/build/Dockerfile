FROM node

# Add source
WORKDIR /var/app
ADD . .

# Get node-prune (https://github.com/tj/node-prune)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash

# Build the app
RUN npm i && \
    npm run build && \
    rm -rf ./src tsconfig.json package-lock.json

# Run node-prune
RUN ./bin/node-prune

# Expose ports
EXPOSE 3000
EXPOSE 3443

# Run the app
ENTRYPOINT MONGO_DB_URL=${MONGO_DB_URL} PRODUCTION=1 node .