####################
# DEPENDENCY STAGE #
####################

# based on docker pull node:16.18.1-alpine3.16
FROM node:16.18.1-alpine3.16 AS deps

# working directory
WORKDIR /srv

# copy package*.json files to container (/srv)
COPY package*.json ./

# perform a clean installation of all non-dev dependencies
RUN npm ci --only=production

# alternative yarn commands
# COPY package.json yarn.lock ./
# RUN yarn install --production


#################
# RELEASE STAGE #
#################
FROM alpine:3.16 AS release

# variables
ENV V 16.18.0
ENV FILE node-v$V-linux-x64-musl.tar.xz

# 1. install required packages libstdc++ & curl
# 2. use curl to download Nodejs tarball
# 3. extract tarball into /usr/local
# 4. remove npm and its dependent files
# 5. remove curl and its dependencies
RUN apk add --no-cache libstdc++ \
    && apk add --no-cache --virtual .deps curl \
    && curl -fsSLO --compressed \
    "https://unofficial-builds.nodejs.org/download/release/v$V/$FILE" \
    && tar -xJf $FILE -C /usr/local --strip-components=1 \
    && rm -f $FILE /usr/local/bin/npm /usr/local/npx \
    && rm -rf /usr/local/lib/node_modules \
    && apk del .deps

# set working directory
WORKDIR /srv

# copy node modules installed in deps stage
COPY --from=deps /srv/node_modules ./node_modules

# COPY source files to /srv
COPY . .

# expose host & port
EXPOSE 1337
ENV HOST 0.0.0.0
ENV PORT 1337

# run node application
CMD [ "node", "consumer-http-basic.js"]

