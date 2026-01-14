FROM python:3.14-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    cmake \
    git \
    bison \
    flex \
    libprotobuf-dev \
    protobuf-compiler \
    libnl-route-3-dev \
    libtool \
    make \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Build and install nsjail
RUN git clone https://github.com/google/nsjail.git /tmp/nsjail && \
    cd /tmp/nsjail && \
    make && \
    cp nsjail /usr/bin/ && \
    rm -rf /tmp/nsjail

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src/ .
COPY nsjail.cfg /app/nsjail.cfg

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
