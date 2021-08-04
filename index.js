const express = require('express');
const app = express();
const pool = require('./db');
app.use(express.json());
//ROUTES//

//GET ALL TODO
app.get("/todos", async(req, res) =>{
    try{
        const allTodos = await pool.query("SELECT * FROM TODO");
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message)
    }
});
// GET ONE TODO
app.get("/todos/:id", async(req, res) =>{
    const { id } = req.params;
    try{
        
        const todo = await pool.query(
       "SELECT * FROM TODO WHERE todo_id = $1",
        [id]
    );
    res.json(todo.rows[0]);
    }catch (err) {
        console.error(err.message)
    }
});
// CREATE A TODO
app.post("/todos", async(req, res) =>{
    try{
       const { description } = req.body;
       const newTodo = await pool.query(
           "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message) 
    }
});

// UPDATE A TODO
app.put("/todos/:id", async(req, res) => {
    try{
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
            [description, id]
        );
        res.json(updateTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})
// DELETE A TODO
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
       "DELETE FROM todo WHERE todo_id = $1",
        [id]
    );
    res.json("Todo deleted successfully!")
    } catch (err) {
        console.error(err.message);
    }
}) 

app.listen(5000, () => {
    console.log("server is listening to 5000.")
});
