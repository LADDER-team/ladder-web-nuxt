FROM node:10.10.0
WORKDIR /root/ladder
EXPOSE 80
COPY ["ladder", "/root/ladder"]
RUN npm install && \
    npm run build
ENTRYPOINT ["npm", "start", "--", "-p", "80", "-H", "0.0.0.0"]
