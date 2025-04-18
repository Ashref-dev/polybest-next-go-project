# Stage 1: Build the Go binary
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go module file
COPY go.mod ./

# Download dependencies (will use go.mod)
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /movies-api main.go

# Stage 2: Create the final minimal image
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /movies-api .

# Expose the port the API runs on
EXPOSE 8083

# Command to run the executable
CMD ["/app/movies-api"] 