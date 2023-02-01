import askQuestions from './index.js';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { getPrompts } from './database.js';
// Description: This file contains the edge case function that checks if the user wants to exit or clear the console
export default async function edgeCase(answers) {
    if (answers.question.trim().toLowerCase() === 'exit') {
        console.log(gradient.instagram.multiline(figlet.textSync('Goodbye')));
        process.exit();
    }
    // check if the question is clear lowercase or uppercase
    if (answers.question.toLowerCase() === 'clear') {
        // clear the console
       
        await askQuestions();
    }
    if(answers.question.toLowerCase() === 'help'){
        // console.log('\x1Bc');
         await getPrompts()
        await askQuestions();
    }
    // if the question is a space bar enter or nothing
    if (answers.question.trim() === '') {
        // print a message
        console.log('Please enter a valid question');
        // ask the questions again
        await askQuestions();
    }
}