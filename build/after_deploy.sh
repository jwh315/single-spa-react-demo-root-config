set -e

NEW_URL="https://single-spa-react-demo.s3.amazonaws.com/${PROJECT}/${GITHUB_SHA}/cd-${PROJECT}.js"

echo "Downloading import map from S3"
aws s3 cp s3://single-spa-react-demo/importmap.json importmap.json
aws s3 cp s3://single-spa-react-demo/${PROJECT}/${GITHUB_SHA}/index.html index.html

echo "Updating import map to point to new version of"
echo $(jq --arg ARG1 "@cd/${PROJECT}" --arg ARG2 "${NEW_URL}" '.imports[$ARG1] = $ARG2' importmap.json) > importmap.json

echo "New Url = ${NEW_URL}"
cat importmap.json

ls -lah

cat index.html

echo "Uploading new import map to S3"
aws s3 cp importmap.json s3://single-spa-react-demo/importmap.json --cache-control 'public, must-revalidate, max-age=0' --acl 'public-read'
aws s3 cp index.html s3://single-spa-react-demo/index.html --acl 'public-read'
echo "Deployment successful"