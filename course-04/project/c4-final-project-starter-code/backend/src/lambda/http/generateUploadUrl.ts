import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import {createLogger} from '../../utils/logger'

const logger = createLogger('generateUploadUrl') 

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('generate url event: ', JSON.stringify(event))
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const uploadUrl = await createAttachmentPresignedUrl(todoId,userId)

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
      },
        body: JSON.stringify({
          success: true,
          message: 'Upload successful',
          uploadUrl
        }
        )
      }
    
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
