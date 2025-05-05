#! /bin/bash

# Variables

# Database
HIPDA_DB=''
DB_IMG=''
DB_PASS=''
BACKUP_DIR=''
DB_IMG_NAME=''
DB_USER=''

# UI
HIPDA_UI=''
HIPDA_UI_REPO=''
HOST_URL=''
UI_IMG_NAME=''

# Backend
HIPDA_REPO=''
HIPDA_BACKEND=''
HIPDA_NET=''
BACKEND_IMG_NAME=''

# Functions
Check_and_Validate() {
    local REPO_DIR="$1"
    local IMAGE_NAME="$2"
    # Check if there are updates in the repositories
    cd "$REPO_DIR"

    # Fetch latest commits from origin
    git fetch

    # Check if local is behind remote
    if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]; then
        echo "Update found. Pulling and rebuilding image..."
        git pull
        docker stop IMAGE_NAME
        docker rm IMAGE_NAME
        docker build -t $IMAGE_NAME .
    else
        echo "No updates for the $IMAGE_NAME. Skipping build."
    fi
}

# Check UI Repo for updates
Check_and_Validate $HIPDA_UI_REPO $UI_IMG_NAME 

# Check Backend Repo for updates
Check_and_Validate $HIPDA_REPO $BACKEND_IMG_NAME

# DB hipda-msql container
if [ "$(docker ps -aq -f name=^$HIPDA_DB$)" ]; then
    if [ "$(docker ps -q -f name=^$HIPDA_DB$)" ]; then
        echo "Container '$HIPDA_DB' is already running."
    else
        echo "Starting existing container '$HIPDA_DB'..."
        docker start $HIPDA_DB
    fi
else
    echo "Running new container '$HIPDA_DB'..."
    # Start Backend
    docker run -d --name $HIPDA_DB --network $HIPDA_NET -e MYSQL_ROOT_PASSWORD=$DB_PASS -e MYSQL_DATABASE=hipda -p 3306:3306 $DB_IMG

    # Log into the Database, create the user and grant privileges
    docker exec -it hipda-msql mysql -u root -p$DB_PASS -e "CREATE USER '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS'; GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"

    # Fill Database with the last available backup

fi

# Backend hipda-test container
if [ "$(docker ps -aq -f name=^$HIPDA_BACKEND$)" ]; then
    if [ "$(docker ps -q -f name=^$HIPDA_BACKEND$)" ]; then
        echo "Container '$HIPDA_BACKEND' is already running."
    else
        echo "Starting existing container '$HIPDA_BACKEND'..."
        docker start $HIPDA_BACKEND
    fi
else
    echo "Running new container '$HIPDA_BACKEND'..."
    # Start Backend
    docker run -d --name $HIPDA_BACKEND --network $HIPDA_NET -p 4000:4000 $HIPDA_BACKEND
fi

# Frontend hipda-ui container
if [ "$(docker ps -aq -f name=^$HIPDA_UI$)" ]; then
    if [ "$(docker ps -q -f name=^$HIPDA_UI$)" ]; then
        echo "Container '$HIPDA_UI' is already running."
    else
        echo "Starting existing container '$HIPDA_UI'..."
        docker start $HIPDA_UI
    fi
else
    echo "Running new container '$HIPDA_UI'..."
    # Start Backend
    docker run -d --name $HIPDA_UI --network $HIPDA_NET -p 3000:3000 $HIPDA_UI
fi

# Start Application
sleep 5
open "$HOST_URL"