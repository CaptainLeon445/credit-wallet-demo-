import db from "../../config/db.connection";

export default class UserUtils {
  static async getUserById(id: number) {
    const [user] = await db("users").where({ id }).returning("*");
    return user;
  }

  static async getUserByUsername(username: string) {
    const [user] = await db("users").where({ username }).returning("*");
    return user;
  }

  static async deactivateUser(id: number) {
    const [updatedUser] = await db("users")
      .update({ active: false })
      .where({ id })
      .returning("*");
    return updatedUser;
  }
}
