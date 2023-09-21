ARG NODE_VERSION=18.18
ARG NGINX_VERSION=1

# Stage 1 - the build process
FROM node:${NODE_VERSION}-alpine AS react-build

ARG APP_ENV
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_RELEASE
ARG SENTRY_AUTH_TOKEN

ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --production=false

COPY . ./
RUN NODE_OPTIONS='--max-old-space-size=4096' APP_ENV=${APP_ENV} SENTRY_ORG=${SENTRY_ORG} SENTRY_PROJECT=${SENTRY_PROJECT} SENTRY_RELEASE=${SENTRY_RELEASE} SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} yarn build

# Stage 2 - the production environment
FROM nginx:${NGINX_VERSION}-alpine AS app
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 8080
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
