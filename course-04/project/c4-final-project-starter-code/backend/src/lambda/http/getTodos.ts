import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import {createLogger} from '../../utils/logger'

const logger = createLogger('getTodos')

// TODO: Get all TODO items for a current user
export const handler :APIGatewayProxyHandler=
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('get todos event: ', JSON.stringify(event))
    
    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)

    return {statusCode:200,
    body: JSON.stringify({items:todos}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }
  }
