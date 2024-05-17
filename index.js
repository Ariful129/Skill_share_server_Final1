const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const body_parser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000;
// const allowedOrigin = ['https://auth-private-all.web.app/']
// middleware
// app.use(cors({
  // origin: 'https://auth-private-all.web.app/',
  // credentials: true
// }))
app.use(cors());

app.use(express.json());

// app.use(cors());
// app.use(express.json());






//Bkash
app.use(body_parser.json())
const mongoose = require('mongoose')
app.use(express.json())
console.log("fineee ");
app.use('/api', require('./routes'))
console.log("noooo");
const db = async()=>{
    try {
        await mongoose.connect(process.env.db_url)
        console.log('db connect')
    } catch (error) {
        
    }
}
db()

//End Bkash


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8or9pd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();
//->..................................................//

//const userCollection = client.db("skilldB").collection("users");
const applicationsCollection = client.db("skilldB").collection("applications");
const courseCollection = client.db("skilldB").collection("allcourse");





// app.post('/users', async (req, res) => {
//     const user = req.body;
//     //const query = { email: user.email }
//     //const existingUser = await userCollection.findOne(query);
//     // if (existingUser) {
//     //   return res.send({ message: 'user already exists', insertedId: null })
//     // }
//     const result = await userCollection.insertOne(user);
//     res.send(result);
//   });
// app.get('/users', async (req, res) => {
//     const result =await userCollection.find().toArray();
//     res.send(result);
// })
//Application
app.post('/apply', async (req, res) => {
  const apply = req.body;

  //  const query = { email: apply.email }
  //   const existingUser = await applicationsCollection.findOne(query);
  //   if (existingUser) {
  //     return res.send({ message: 'One Course already exists', insertedId: null })
  //   }

  const result = await applicationsCollection.insertOne(apply);
  res.send(result);
});

 app.get('/apply', async (req, res) => {
  console.log(req.query.email);
  let query = {};
  if (req.query?.email) {
      query = { email: req.query.email }
  }
  const result = await applicationsCollection.find(query).toArray();
  res.send(result);
})
app.get('/applyadmin', async (req, res) => {
  const result =await applicationsCollection.find().toArray();
  res.send(result);
})
app.patch('/applyadmin/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedBooking = req.body;
  console.log(updatedBooking);
  const updateDoc = {
      $set: {
          status: updatedBooking.status
      },
  };
  const result = await applicationsCollection.updateOne(filter, updateDoc);
  res.send(result);
})
app.get('/applyadmin/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await applicationsCollection.findOne(query);
  res.send(result);
})
//Application End
//Course start
app.post('/courses', async (req, res) => {
  const course = req.body;

    const query = { ID:course.ID}
    const existingUser = await courseCollection.findOne(query);
    if (existingUser) {
      return res.send({ message: 'Already one course exists', insertedId: null })
    }

  const result = await courseCollection.insertOne(course);
  res.send(result);
});
app.get('/courses/:course_id',async(req,res)=>{
  const course_id=req.params.course_id;
  console.log("hello",course_id);
  if(!ObjectId.isValid(course_id)){
    console.log('wrong');
  }
  const query={ course_id: course_id}
  const result=await courseCollection.findOne(query)
  res.send(result)
})

app.put('/courses/:id',async(req,res)=>{
  const id=req.params.id;
  console.log("id asce",id);
  const filter={_id:new ObjectId(id)}
  const options = { upsert: true };
  const course=req.body;
  // console.log("email set hoice?",course);
  const newCourse={
    $set:{
      students:course.students
      
    }
  }
  console.log("my new course:",newCourse);
  const result=await courseCollection.updateOne(filter,newCourse,options)
  console.log("result hoice", result);
  res.send(result)
})
// app.get('/courses', async (req, res) => {
//     const result =await courseCollection.find().toArray();
//     res.send(result);
// })
app.get('/courses', async (req, res) => {
  console.log(req.query.email);
  let query = {};
  if (req.query?.email) {
      query = { email: req.query.email }
  }
  const result = await courseCollection.find(query).toArray();
  res.send(result);
})
// app.post('/')


//Course End



//->...................................................//
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Skill Share is running')
})

app.listen(port, () => {
    console.log(`Skill Share Server is running on port ${port}`)
})