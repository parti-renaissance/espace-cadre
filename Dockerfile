ARG NODE_VERSION=14
ARG NGINX_VERSION=1.19

# Stage 1 - the build process
#FROM node:${NODE_VERSION}-alpine AS react-build
FROM node:${NODE_VERSION} AS react-build
WORKDIR /app

COPY . ./
RUN yarn install --production=true
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
