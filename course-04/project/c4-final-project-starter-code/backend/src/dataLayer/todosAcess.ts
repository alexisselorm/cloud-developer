import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly TodosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    
    logger.info('Fetching todos')

    const result = await this.docClient.scan({
      TableName: this.TodosTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

 
  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Creating todo ', todo.todoId)
    await this.docClient.put({
      TableName: this.TodosTable,
      Item: todo
    }).promise()
    logger.info('Successfully created todo ', todo.todoId)
    return todo
  }

 
  async deleteTodo(userId, todoId): Promise<any> {
    logger.info('Deleting todo ', userId, todoId)
    await this.docClient.delete({
        TableName: this.TodosTable,
        Key : {
          userId,
          todoId
        }
    }).promise()
  }

 
  async getTodosForUser(userId): Promise<TodoItem[]> {
    logger.info('Getting todo for the user', userId)
    let result = await this.docClient.query({
        TableName: this.TodosTable,
        IndexName: this.TodosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  
  async getTodo(userId, todoId): Promise<TodoItem> {
    let result = await this.docClient.get({
        TableName: this.TodosTable,
        Key : {
            userId,
            todoId
        }
    }).promise()

    const item = result.Item
    return item as TodoItem
  }

 
  async updateTodo(userId, todoId, updatedTodo): Promise<any> {
    logger.info('Update todo item ', userId, todoId);
    await this.docClient.update({
      TableName: this.TodosTable,
      Key: {
          todoId,
          userId
      },
      UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
      ExpressionAttributeValues: {
          ':n': updatedTodo.name,
          ':due': updatedTodo.dueDate,
          ':d': updatedTodo.done
      },
      ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
      }
    }).promise()
  }

 
  async updateImageURl(todoId, userId, imageUrl): Promise<any> {
    logger.info('Update todo image ');
    await this.docClient.update({
      TableName: this.TodosTable,
      Key: {
          todoId,
          userId
      },
      UpdateExpression: 'set #attachmentUrl = :n',
      ExpressionAttributeValues: {
          ':n': imageUrl,
      },
      ExpressionAttributeNames: {
          '#attachmentUrl': 'attachmentUrl'
      }
    }).promise()
  }
}