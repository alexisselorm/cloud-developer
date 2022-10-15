import * as createError from 'http-errors'
import { AttachmentUtil } from '../helpers/attachmentUtil';
import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtil();
const todoAccess = new TodosAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  try {
    const itemId = uuid.v4()

    logger.info('Creating New TODO')

    return await todoAccess.createTodo({
      todoId: itemId,
      userId: userId,
      createdAt: new Date().toISOString(),
      done: false,
      ... CreateTodoRequest

    })
  } catch (err) {
    createError('Unable to create todo')
  }

  
  
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<any> {

  if( !(todoAccess.getTodo(userId, todoId)) ) {
    return false;
  }
  logger.info('Deleting Todo ', userId, todoId)
  await todoAccess.deleteTodo(userId, todoId)
  return true;
}


export async function getTodosForUser(
  userId: string
): Promise<TodoItem[]> {
  logger.info('Get todos for user', userId)
  return await todoAccess.getTodosForUser(userId);
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest,
): Promise<any> {

  if( !(todoAccess.getTodo(userId, todoId)) ) {
    return false;
  }

  logger.info('Updating Todo ', userId, todoId);

  await todoAccess.updateTodo(userId, todoId, updateTodoRequest)
  return true;  
}

export async function createAttachmentPresignedUrl(
  todoId : string,
  userId : string
): Promise<any>{
  let generatedPreSignedUrl = await attachmentUtils.generatePreSignedUrl(todoId, userId);
  // let imageUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/images/${todoId}`;
  // await todoAccess.updateImageURl(todoId, userId, imageUrl);
  return generatedPreSignedUrl;
}