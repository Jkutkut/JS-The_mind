# -------------------------------------------------------------------------------
FROM node:lts as base
# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# App run as 'node' user
WORKDIR /home/node/app
COPY --chown=node:node . /home/node/app/

# -------------------------------------------------------------------------------
FROM base as development
WORKDIR /home/node/app
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN npm install
USER node
# EXPOSE 3000
CMD ["npm", "start"]

# -------------------------------------------------------------------------------
FROM base as production
WORKDIR /home/node/app
COPY --chown=node:node --from=development /home/node/app/node_modules /home/node/app/node_modules
RUN npm run build

# -------------------------------------------------------------------------------
FROM nginx:stable-alpine as deploy
WORKDIR /home/node/app
COPY --chown=node:node --from=production /home/node/app/build /usr/share/nginx/html/
