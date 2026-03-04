#!/usr/bin/env bash
set -euo pipefail

# Usage:
# ./scripts/deploy-ec2.sh --key-name mykey --region us-east-1 --instance-type t3.small --domain example.com --ssh-user ubuntu

print_usage(){
  echo "Usage: $0 --key-name KEY --region REGION --domain DOMAIN --ssh-user SSH_USER [--instance-type t3.small]"; exit 1
}

# parse args
KEY_NAME=""
REGION="us-east-1"
INSTANCE_TYPE="t3.small"
DOMAIN=""
SSH_USER="ubuntu"
while [[ $# -gt 0 ]]; do
  case $1 in
    --key-name) KEY_NAME="$2"; shift 2;;
    --region) REGION="$2"; shift 2;;
    --instance-type) INSTANCE_TYPE="$2"; shift 2;;
    --domain) DOMAIN="$2"; shift 2;;
    --ssh-user) SSH_USER="$2"; shift 2;;
    *) echo "Unknown arg $1"; print_usage;;
  esac
done
if [[ -z "$KEY_NAME" || -z "$DOMAIN" ]]; then print_usage; fi

# 1) Create security group
SG_NAME="s4tech-crm-sg"
SG_ID=$(aws ec2 describe-security-groups --region "$REGION" --filters "Name=group-name,Values=$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "")
if [[ -z "$SG_ID" || "$SG_ID" == "None" ]]; then
  SG_ID=$(aws ec2 create-security-group --region "$REGION" --group-name "$SG_NAME" --description "S4Tech CRM SG" --query 'GroupId' --output text)
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" --protocol tcp --port 22 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0
fi

# 2) Launch instance
AMI_ID=$(aws ec2 describe-images --region "$REGION" --owners amazon --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*" --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' --output text)
INSTANCE_ID=$(aws ec2 run-instances --region "$REGION" --image-id "$AMI_ID" --instance-type "$INSTANCE_TYPE" --key-name "$KEY_NAME" --security-group-ids "$SG_ID" --query 'Instances[0].InstanceId' --output text)
echo "Launched instance $INSTANCE_ID, waiting for status ok..."
aws ec2 wait instance-status-ok --region "$REGION" --instance-ids "$INSTANCE_ID"
PUBLIC_IP=$(aws ec2 describe-instances --region "$REGION" --instance-ids "$INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "Instance public IP: $PUBLIC_IP"

# 3) Prepare package to upload
TMPDIR=$(mktemp -d)
PROJECT_ARCHIVE=s4tech-deploy.tar.gz
# include docker-compose.traefik.prod.yml and secrets if present
cp -r . $TMPDIR/project
cd $TMPDIR/project
# remove node_modules and other heavy items
rm -rf node_modules client/node_modules server/node_modules .git
# create archive
tar -czf /tmp/${PROJECT_ARCHIVE} .

# 4) Upload to instance
echo "Uploading project archive..."
scp -o StrictHostKeyChecking=no /tmp/${PROJECT_ARCHIVE} ${SSH_USER}@${PUBLIC_IP}:/home/${SSH_USER}/

# 5) Install Docker & Docker Compose, extract, and run
ssh -o StrictHostKeyChecking=no ${SSH_USER}@${PUBLIC_IP} bash -s <<EOF
  set -e
  sudo apt-get update
  sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \\$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io
  sudo usermod -aG docker \$USER || true
  # install docker compose plugin if not present
  if ! command -v docker-compose &> /dev/null; then
    sudo apt-get install -y docker-compose-plugin
  fi
  mkdir -p deploy && sudo tar -xzf /home/${SSH_USER}/${PROJECT_ARCHIVE} -C deploy
  cd deploy
  # create secrets dir if provided locally
  if [ -d ~/secrets ]; then
    sudo mkdir -p /home/${SSH_USER}/deploy/secrets
    cp -r ~/secrets/* /home/${SSH_USER}/deploy/secrets/ || true
  fi
  # start compose
  sudo docker compose -f docker-compose.traefik.prod.yml -f docker-compose.prod.secrets.yml up -d --build
EOF

echo "Deployment complete. Visit: https://${DOMAIN} (give DNS A record pointing to $PUBLIC_IP)"
