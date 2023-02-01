import  sqlite3  from "sqlite3";
import {debug} from "./debug.js";


export const db = new sqlite3.Database('db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the prompts database.');
});
// create export function to get the prompts from the database
export function getPrompts() {
     return new Promise((resolve, reject) => {
    db.each(`SELECT * FROM prompts ORDER BY id DESC LIMIT 1`, (err, row) => {
      if (err) {
        reject(err);
      }
      prompt = row.prompt;
      resolve(prompt);
    });
  });
  }
  export const storeUser = (user) => {
    console.log(user);
  
    // check if the user exists in the database
    db.get('SELECT * FROM users WHERE user = ?', user, (err, row) => {
      if (err) {
        throw new Error(`Error retrieving user: ${err}`);
      }
  
      // if the user is not found in the database
      if (!row) {
        console.log('User not found in the database');
        db.run('INSERT INTO users (user) VALUES (?)', user);
      }
    });
  };

  export function storePrompt(promptData, user, callback) {
    const prompt = promptData;
   // save the prompt to the database
    db.run('INSERT INTO prompts (prompt) VALUES (?)', prompt, (err) => {
      if(err){
        debug(err);
      }
      // get the id of the prompt
      db.get('SELECT * FROM prompts WHERE prompt = ?', prompt, (err, row) => {
        if (err) {
          throw new Error(`Error retrieving prompt: ${err}`);
        }
        // get the id of the user
        db.get('SELECT * FROM users WHERE user = ?', user, (err, row) => {
          if (err) {
            throw new Error(`Error retrieving user: ${err}`);
          }
          // save the user prompt to the database
          db.run('INSERT INTO user_prompts (user_id, prompt_id) VALUES (?, ?)', row.id, row.id);
        });
      }
      );
    });
    
  }
