const prompts = require("./prompts.json");
const users = require("./users.json");
const Ajv = require('ajv');
const ajv = new Ajv();
// const promptSchema = {
//   prompt: { type: "string", required: true },
//   label: { type: "string", required: true },
//   visibility: { type: "string", enum: ["public", "private", "custom"], required: true },
//   actor: {
//     username: { type: "string", required: true },
//   },
//   sharedAccess: { type: [], default: [] },  // Define the sharedAccess array
// };
const promptSchema = {
  type: "object",
  properties: {
    prompt: {
      type: "string",
    },
    label: {
      type: "string",
    },
    visibility: {
      type: "string",
      enum: ["public", "private", "custom"],
    },
    actor: {
      type: "object",
      properties: {
        username: {
          type: "string",
        }
      }
    },
    description: {
      type: "string"
    },
    sharedAccess: {
      type: "array",
      items: {
        type: "string"
      },
      default: []
    }
  },
  required: ["prompt", "label", "visibility", "actor"]
};

class Prompts {
  constructor() {
    this.schema = promptSchema;
    this.prompts = prompts;
    this.users = users;
  }

  create(newPrompt) {
    const validate = ajv.compile(this.schema);
    const valid = validate(newPrompt);
    if(!valid){
      return validate.errors;
    }
    this.prompts.push(newPrompt);
    return "Prompt added";
  }

  get(username) {
    const userPrompts = this.prompts.filter(
      (prompt) => prompt.actor.username === username
    );
    if (userPrompts.length > 0) {
      return userPrompts;
    }

    const sharedPrompts = this.prompts.filter((prompt) =>
      prompt.sharedAccess.includes(username)
    );
    if (sharedPrompts.length > 0) {
      return sharedPrompts;
    }

    return "User not found";
  }
  getAll() {
    return this.prompts.filter((prompt) => prompt.visibility === "public");
  }

  share(username) {
    const user = this.prompts.find((prompt) => prompt.actor.username === username);
    if (user) {
      return "User not found";
    }
    for(let prompt in this.prompts){
    if (prompt.sharedAccess.includes(username)) {
      return "User already has access to the prompt";
    }
    prompt.sharedAccess.push(username);
    return { message: "Prompt shared", prompt };
  }
}
  deleteAll() {
    this.prompts = [];
    return "All prompts deleted";
  }
}

let prompt = new Prompts();
let result = prompt.create({
  prompt: "Sample Prompt",
  label: "Sample Label",
  visibility: "public",
  actor: { username: "harsh" },
  description: "This is a sample prompt",
});
console.log(result);
console.log(prompt.prompts.find(prompt=>prompt.actor.username === "harsh"));


// print prompts

/**
 * Task:
 *   - Here is the json file which contains number of prompts with structure
 *
 *  @Prompts:
 *  - _id: ObjectId
 *  - prompt: <prompt>
 *  - label: <label>
 *  - visibility: [public, private, custom],
 *  - sharedAccess: [],
 *  - description: "",
 *  - type: '',
 *  - subtype: '',
 *  - actor: { username: '' }
 *
 *  @Users:
 *    - username:
 *    - email:
 *    - password:
 *    - firstName:
 *    - lastName:
 *    - email:
 *
 *  @Description:
 *    - import both JSON files prompts.json user.json
 *    - write a class Prompts which takes prompts schema as input
 *    - create methods for create, update, get, getAll, delete prompts
 *    - prompts can only be access with the username.
 *    - You can only see the prompts that are either public or their they are created by you
 *    - Implement the logic for sharedAccess where visibility is custom, and other user can see those prompts if they are in sharedAccess list
 */
