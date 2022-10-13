import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger =createLogger('createTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('create todo event: ', JSON.stringify(event))
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    if(!newTodo.name){
      return {statusCode: 400,
      body:JSON.stringify({
        error: 'Todo name is required',
      })
    }
    }
    const userId = getUserId(event)
    const newItem = await createTodo(newTodo,userId)


    return {
      statusCode:201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body:JSON.stringify({
        "item": newItem,
        message:"Todo created"}),
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
