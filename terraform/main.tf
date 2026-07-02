provider "aws" {
  region = var.aws_region
}

# Intentional Vulnerability for TigerGate Learning
# IaC: Terraform Security Group allowing 0.0.0.0/0 on SSH (port 22)
resource "aws_security_group" "vulnerable_sg" {
  name        = "vulnerable_ssh_sg"
  description = "Allow SSH traffic from anywhere"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Intentional Vulnerability for TigerGate Learning
# IaC: Public S3 bucket with public read access enabled
resource "aws_s3_bucket" "vulnerable_bucket" {
  bucket = "tigergate-educational-vulnerable-bucket"
}

resource "aws_s3_bucket_public_access_block" "vulnerable_bucket_access" {
  bucket = aws_s3_bucket.vulnerable_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "vulnerable_bucket_acl" {
  depends_on = [
    aws_s3_bucket_public_access_block.vulnerable_bucket_access
  ]
  bucket = aws_s3_bucket.vulnerable_bucket.id
  acl    = "public-read"
}
