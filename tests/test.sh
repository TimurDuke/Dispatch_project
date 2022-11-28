#!/bin/bash

echo $0
REL_PATH=`dirname $0`

cd ${REL_PATH} || exit
CURRENT_DIR=`pwd`

echo ${CURRENT_DIR}
cd ${CURRENT_DIR} || exit

echo '##################'
echo "# Running tests! #"
echo '##################'

echo '# API'

cd ../api || exit

echo '# Running fixtures'
NODE_ENV=test npm run seed

echo '# Running API server in test mode'
pm2 start "NODE_ENV=test npm run dev" --name="api-test"

echo '# Running frontend in test mode'

cd ../front || exit
pm2 start "npm run start-test" --name="frontend-test"

while ! nc -z localhost 3010; do
    sleep 0.1
done

echo "# Running tests"
cd ../tests || exit
echo "$@"
npx codeceptjs run --steps "$@"
EXIT_CODE=$?

echo '# Killing test processes'
pm2 kill

exit ${EXIT_CODE}
