# -----------------------------------------------------------------------------
# Stage 1: Builder — install deps, compile Vite + React
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Build-time env for Vite (embedded in bundle)
ARG VITE_API_URL
ARG VITE_AUTH_BEARER_TOKEN
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_BEARER_TOKEN=$VITE_AUTH_BEARER_TOKEN

COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Runner — nginx serves static assets only
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
