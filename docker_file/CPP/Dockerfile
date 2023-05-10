FROM ubuntu:latest


RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    gdb \
    make




COPY cppfile.sh /
RUN chmod +x cppfile.sh
RUN mkdir /temp

# name image - executing_cpp