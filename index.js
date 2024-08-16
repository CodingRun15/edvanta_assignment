const prompts = require("./prompts.json");
const users = require("./users.json");

const promptSchema = {
  prompt: { type: String, required: true },
  label: { type: String, required: true },
  visibility: { type: String, enum: ["public", "private", "custom"], required: true },
  actor: {
    username: { type: String, required: true },
  },
  description: { type: String },
  sharedAccess: { type: Array, default: [] },  // Define the sharedAccess array
};

class Prompts {
  constructor() {
    this.schema = promptSchema;
    this.prompts = prompts;
    this.users = users;
  }

  create(newPrompt) {
    const user = this.users.find(
      (user) => user.username === newPrompt.actor.username
    );
    if (user) {
      this.prompts.push(newPrompt);
      return "Prompt added";
    }
    return "User not found";
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
    return this.prompts.filter((prompt) => prompt.visibility !== "private");
  }

  share(id, username) {
    const user = this.users.find((user) => user.username === username);
    if (!user) {
      return "User not found";
    }

    const prompt = this.prompts.find((prompt) => prompt._id.$oid === id);
    if (!prompt) {
      return "Prompt not found";
    }

    if (prompt.sharedAccess.includes(username)) {
      return "User already has access to the prompt";
    }

    prompt.sharedAccess.push(username);
    return { message: "Prompt shared", prompt };
  }

  deleteAll() {
    this.prompts = [];
    return "All prompts deleted";
  }
}

let prompt = new Prompts();
let result = prompt.share("johndoe", "stephen hawkins");
console.log(result);


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
