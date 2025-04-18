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
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /anime-api main.go

# Stage 2: Create the final minimal image
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /anime-api .

# Expose the port the API runs on
EXPOSE 8082

# Command to run the executable
CMD ["/app/anime-api"] 