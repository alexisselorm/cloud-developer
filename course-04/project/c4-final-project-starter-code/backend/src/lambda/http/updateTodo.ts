import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import {createLogger} from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('update todo event: ', JSON.stringify(event))

   try {
	 const todoId = event.pathParameters.todoId
	    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
	    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
	    const userId = getUserId(event)
	    await updateTodo(userId, todoId, updatedTodo)
	
	
	    return{ statusCode:200,
	            headers: {
	              'Access-Control-Allow-Origin': '*',
	              'Access-Control-Allow-Credentials': true
	            },
	            body:'success'
	    }
} catch (error) {
	logger.error(error)
}
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
