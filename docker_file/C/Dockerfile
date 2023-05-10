FROM ubuntu:latest


RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    gdb \
    make




COPY Cfile.sh /
RUN chmod +x Cfile.sh
RUN mkdir /temp

# name image - executing_c