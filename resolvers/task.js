const {users, tasks} = require('../constants');

module.exports = {
    Query: {
        tasks: () => tasks,
        task: (_, { id }) => tasks.find(task => task.id === id)
    },
    Mutation: { 
        createTask: (_, { input }) => {
            const idTask = tasks.length + 1;
            const task = { ...input, id: idTask };
            tasks.push(task);
            return task;
        }
    },
    Task: {
        user: ({ userId }) => users.find(user => user.id === userId)        
    }
}