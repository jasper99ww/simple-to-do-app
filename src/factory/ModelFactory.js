import { ListService } from '../service/ListService.js';
import { TodoService } from '../service/TodoService.js';
import { TodoModel } from '../model/TodoModel.js';

export default class ModelFactory {
    static createListService(lists) {
        return new ListService(lists);
    }

    static createTodoService(lists) {
        return new TodoService(lists);
    }

    static createTodoModel() {
        const lists = new Map();

        const listService = ModelFactory.createListService(lists);
        const todoService = ModelFactory.createTodoService(lists);

        return new TodoModel(listService, todoService, lists);
    }
}