FROM php:7-alpine

# Copy app code from current dir to container
COPY . /code

# Set container workdir to code dir
WORKDIR /code

# Expose php webserver port 
EXPOSE 8000/tcp

# Set php to default container process 
ENTRYPOINT ["/usr/local/bin/php"]

# Env args to php 
CMD ["-S", "0.0.0.0:8000"]

# docker instructions
# 1  - Build image:
# cd /app/code/dir
# docker build -t ancienttypist -f Dockerfile . 
#
# 2 - Run container:
# docker run --name ancienttypist-01 -d -p 8000:8000 ancienttypist:latest
# For persistent data (even after removing the container), use the source directory as a volume
# docker run --name ancienttypist-01 -d -p 8000:8000 -v $PWD:/code ancienttypist:latest
#
# 3 - Access http://IP-hostdocker:8000 
#
# For remove the container
# docker container rm -f ancienttypist-01
