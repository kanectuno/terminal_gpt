import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()




// create export function to get the prompts from the database
export async function getPrompts(user) {
 // get the user id
    const userExists = await prisma.user.findFirst({
        where: {
            name: user
        }
    });
    // return the prompts one last  entry
    const userId = userExists.id;
    const prompts = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            posts: true

        },
    });
    return prompts.posts[prompts.posts.length - 1];
    }

  export const storeUser = async  (user) => {
  // check if the user exists by name
    const userExists = await prisma.user.findFirst({
        where: {
            name: user

        }
    })
    if(!userExists){
        await prisma.user.create({
            data: {
                name: user,
            }
        })

    }
   //
  };
  export async function storePrompt(promptData, user) {
    const prompt = promptData;
   // create a new prompt and add userid
    const userExists = await prisma.user.findFirst({
        where: {
            name: user
        }
    });
    // get the user id
    const userId = userExists.id;
    if(userExists){
        const newPrompt = await prisma.prompt.create({
            data: {
                title: prompt,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

    }


    
  }