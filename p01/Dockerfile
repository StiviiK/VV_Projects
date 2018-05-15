FROM node

# Add source
WORKDIR /var/app
ADD . .

# Build the app
RUN npm i && \
    npm run build && \
    rm -rf ./src tsconfig.json package-lock.json

# Expose ports
EXPOSE 3000
EXPOSE 3443

# Run the app
ENTRYPOINT PRODUCTION=1 node .