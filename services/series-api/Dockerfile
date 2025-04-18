# Stage 1: Build the Go binary
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go module files
COPY go.mod go.sum ./
# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
# -ldflags="-w -s" reduces the size of the binary by removing debug information
# CGO_ENABLED=0 ensures a static binary without C dependencies
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /series-api main.go

# Stage 2: Create the final minimal image
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /series-api .

# Expose the port the API runs on
EXPOSE 8081

# Command to run the executable
CMD ["/app/series-api"] 