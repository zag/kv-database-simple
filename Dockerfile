FROM node:12-alpine AS builder
WORKDIR /app
COPY . ./
# COPY *.json ./
# COPY index.ts ./
# COPY src/ ./src/
RUN yarn && yarn build

FROM node:12-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install --only=prod
COPY --from=builder /app/build ./build
