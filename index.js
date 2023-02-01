#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import { Configuration,OpenAIApi } from 'openai';
import edgeCase from './edgeCase.js';
import  sqlite3  from 'sqlite3';
import dotenv from 'dotenv';
import {db} from './database.js';
import { getPrompts,storePrompt,storeUser} from './database.js';
import { debug } from './debug.js';


dotenv.config();

// add the user model to the database



db.serialize(() => {
//    db.run('CREATE TABLE IF NOT EXISTS prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, prompt TEXT, user TEXT)');
// update to create a table for the user
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT)');
db.run('CREATE TABLE IF NOT EXISTS prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, prompt TEXT)');
db.run('CREATE TABLE IF NOT EXISTS user_prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, prompt_id INTEGER)');



});


const configuration  = new Configuration({
    organization:process.env.OPENAI_ORG,
    apiKey:process.env.OPENAI_API_KEY
});
let USER = 'test';
const openai = new OpenAIApi(configuration);
// create a sleep function
const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
let questions;
async function welcome(){
    // create a spinner
    const spinner = createSpinner();
    // start the spinner
    spinner.start();
    // print a welcome message
    console.log(gradient.instagram.multiline(figlet.textSync('Welcome to the CLI')));
    // wait for 2 seconds
    await sleep();
    // stop the spinner
    spinner.stop();
    // print a message
    console.log('Welcome to the CLI');
}


export default async function askQuestions(){
    storeUser(USER);
    const answers = await inquirer.prompt(
        {
            type: 'input',
            name: 'question',
            message:"What do you need today Sir?",
            default(){
                return '';
            },

})
// check if the question is exit lowercase or uppercase 
await edgeCase(answers);
console.log(chalk.blue('Thinking...'));
// get the last entry in the database db is the database
let getLastPrompt =   await getPrompts();
const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: getLastPrompt + answers.question,
    max_tokens: 100,
    n: 1,
    stop: "",
    temperature: 0.5,
    
  });
// console.log(completion.data.choices[0].text); with chalk 
console.log(chalk.green(completion.data.choices[0].text));
// save the prompts to the database
await storePrompt(completion.data.choices[0].text,USER);
// once the question is answered, ask the next question
await askQuestions();
};

await askQuestions();