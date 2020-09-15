const express = require('express');
const { ApolloServer, gql} = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const { tasks, users } = require('./constants');


// set env variables
dotEnv.config();

const app = express();

app.use(cors());

app.use(express.json());


const typeDefs = gql`
    type Query {
        tasks(id: ID!): [Task!]
        task: Task!
        users: [User!]
        user(id: ID!): User!
    }

    input createInputTask {
        name: String!
        completed: Boolean!
        userId: ID!
    }

    type Mutation {
        createTask(input: createInputTask!): Task        
    }    

    Type User {
        id: ID!
        name: String!
        email: String!        
        tasks: [Task!]
    }

    Type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`;

const resolvers = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id),
        tasks: () => tasks,
        task: (_, { id }) => tasks.find(task => task.id === id)
    },

    Mutation: {
        createTaskInput: ({ input }) => {
            const taskId = tasks.length + 1;
            const task = {...input, id: taskId };
            tasks.push(task);
            return task;
        }
    },

    Task: {
        user: ({ userId }) => users.find(user => user.id === userId)
    },

    User: {
        tasks: ({ id }) => tasks.filter(task => task.userId === id)
    }


};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers    
});

apolloServer.middleware({app, path: "/graphql"});

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
    res.send({message: "Hello Graphers"});
});

app.listen(PORT, () => {
    console.log(`PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
})


