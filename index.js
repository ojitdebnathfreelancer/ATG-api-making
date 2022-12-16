const express = require("express");
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('ATG Server Running')
});



const uri = "mongodb+srv://atguser:2y0jYpQ0Ris8WWFV@cluster0.r7d25w3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const atg = async () => {
    try {
        const usersData = client.db('atg').collection('users');
        const postsData = client.db('atg').collection('posts');
        const likesData = client.db('atg').collection('likes');
        const commentsData = client.db('atg').collection('comments');

        // user CRU oparation api start 

        app.post('/userregister', async (req, res) => {
            // const user = {"username":"ojit3", "email":"ojit@gmail.com", "password":"1234567"};
            const user = req.body;

            const existUsername = await usersData.findOne({ username: user.username });
            if (existUsername) {
                return res.send({ message: "This username available" })
            }

            const result = await usersData.insertOne(user);
            res.send(result);
        });
        // user add to db 

        app.get('/userlogin', async (req, res) => {
            // const user = {"username":"ojit4", "password":"12345678"};
            const user = req.body;
            const query = { username: user.username, password: user.password };

            const existUser = await usersData.findOne(query);
            if (!existUser) {
                return res.send({ message: 'This user not found' });
            }

            res.send(existUser);
        });
        // login user and check from db 

        app.patch('/forgetpassword', async (req, res) => {
            // const user = { "email":"ojit@gmail.com", "updatePassword": "123456789" };
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: {
                    password: user.updatePassword
                },
            };
            const result = await usersData.updateOne(filter, updateDoc);
            res.send(result);
        });
        // user password update 



        // user post systme api start 

        app.post('/post', async (req, res) => {
            // const post = {
            //     "title": "Example post title",
            //     "discription": "Example post discription",
            //     "postImg": "Example post img URL",
            // }

            const post = req.body;

            const result = await postsData.insertOne(post);
            res.send(result);
        });
        // user post

        app.get('/allposts', async (req, res) => {
            const posts = await postsData.find({}).toArray();
            res.send(posts);
        });
        // get all posts from db 

        app.patch('/postupdate', async (req, res) => {

            // const post ={
            //     "postId":"639c347b439b98c9b2bc28b3",
            //     "title":"Example title update"
            // };

            const post = req.body;

            const filter = { _id: ObjectId(post.postId) };
            const updateDoc = {
                $set: {
                    title: post.title
                },
            };

            const result = await postsData.updateOne(filter, updateDoc);
            res.send(result);
        });
        // user will update his post 

        app.delete('/postdelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postsData.deleteOne(query);
            res.send(result);
        });
        // delete user post 

        app.post('/postlike', async (req, res) => {
            // const like = {
            //     "username":"ojit4",
            //     "email":"ojit@gmail.com",
            //     "postLikeId": "639c3b48b42a635d3cf9d654"
            // };
            const like = req.body;
            const result = await likesData.insertOne(like);
            res.send(result);
        });
        // like on post 


        app.post('/postcomment', async (req, res) => {
            // const comment = {
            //     "username":"ojit4",
            //     "email":"ojit@gmail.com",
            //     "commentText": "Awesome",
            //     "postCommentId":"639c3b48b42a635d3cf9d654"
            // };
            const comment = req.body;
            const result = await commentsData.insertOne(comment);
            res.send(result);
        });
        // like on post 
    }
    finally {

    }

};
atg().catch(error => console.log(error));



app.listen(port, () => {
    console.log('server running', port);
})