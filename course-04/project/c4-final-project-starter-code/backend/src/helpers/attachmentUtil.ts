import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export class AttachmentUtil {

    constructor(
        private readonly bucket_name = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
        ) {
    }
  
    async generatePreSignedUrl(todoId, userId): Promise<String> {
        console.log('Generating Image presigned URL for ', todoId, userId)
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucket_name,
            Key: `images/${todoId}`,
            Expires: parseInt(this.urlExpiration)
        })
    }

  }