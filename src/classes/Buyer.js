import { User } from "./User";

export class Buyer extends User {
  constructor(
    name,
    email,
    phone = null,
    whatsapp = null,
    id = null,
    discussionPosts = []
  ) {
    super(name, email, "buyer", phone, whatsapp, id, discussionPosts);
  }

 
}
