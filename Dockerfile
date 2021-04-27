ARG NODE_VERSION=14
ARG NGINX_VERSION=1.19

# Stage 1 - the build process
#FROM node:${NODE_VERSION}-alpine AS react-build
FROM node:${NODE_VERSION} AS react-build

ARG OAUTH_HOST
ARG OAUTH_CLIENT_ID
ARG INTERNAL_APP_ID
ARG SENTRY_DSN

WORKDIR /app
COPY . ./

ENV REACT_APP_OAUTH_HOST=${OAUTH_HOST}
ENV REACT_APP_OAUTH_CLIENT_ID=${OAUTH_CLIENT_ID}
ENV REACT_APP_INTERNAL_APP_ID=${INTERNAL_APP_ID}
ENV REACT_APP_SENTRY_DSN=${SENTRY_DSN}
ENV NODE_ENV=production

RUN yarn install --production=false
RUN yarn build

# Stage 2 - the production environment
FROM nginx:${NGINX_VERSION}-alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 8080
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
