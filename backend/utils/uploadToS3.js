const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Client');

async function uploadToS3(fileBuffer, fileName, mimeType) {
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = uploadToS3;