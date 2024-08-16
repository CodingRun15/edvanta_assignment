const prompts = require("./prompts.json");
const users = require("./users.json");
const promptSchema = {
  prompt: { type: String, required: true },
  label: { type: String, required: true },
  visibility: {
    enum: ["public", "private", "custom"],
  },
  actor: {
    username: { type: String, required: true },
  },
  description: { type: String },
};

class Prompts {
  constructor() {
    this.schema = promptSchema;
    this.prompts = prompts;
    this.users = users;
    this.data = [];
  }
  create(newPrompt) {
    let user = this.users.find(
      (user) => user.username === newPrompt.actor.username
    );
    if (user) {
      this.prompts.push(newPrompt);
    }
    return "prompt added";
  }
  get(username) {
    //here we will retrieve prompts made by a particular user.
    let userExists = this.prompts.find(
      (prompt) => prompt.actor.username === username
    );
    if (userExists) {
      return this.prompts.filter(
        (prompt) => prompt.actor.username === username
      );
    } else {
      let user = this.prompts.find((prompt) =>
        prompt.sharedAccess.find((sharedUsers) => sharedUsers === username)
      );
      if (user) {
        return this.prompts.filter((prompt) =>
          prompt.sharedAccess.find((sharedUsers) => sharedUsers === username)
        );
      }
    }
    return "user not found";
  }
  getAll() {
    this.data = [...this.prompts];
    return this.data;
  }
  share(id, username) {
    let user = this.users.find((user_name) => user_name.username === username);
    if (user) {
      return "user already has access to prompts";
    }
    let prompt = this.prompts.find((prompt) => prompt._id.$oid === id);
    if (prompt) {
      prompt.sharedAccess.push(username);
      this.prompts.push(prompt);
      return "prompt shared", prompt;
    }
  }
  deleteAll() {
    this.prompts = [];
    return "All prompts deleted";
  }
}

let prompt = new Prompts();
let result = prompt.share("668623883ac9b77c7c6fc98b", "stephen hawkins");
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
