FROM nginx:alpine
ADD public /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]
