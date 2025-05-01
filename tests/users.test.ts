import { createUser, getUserByEmail } from "@/lib/actions/users";

describe("User Actions", () => {
  it("should create a new user", async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    };

    const newUser = await createUser(userData);

    expect(newUser).toHaveProperty("id");
    expect(newUser.email).toBe(userData.email);
  });

  it("should fetch a user by email", async () => {
    const email = "testuser@example.com";

    const user = await getUserByEmail(email);

    expect(user).not.toBeNull();
    expect(user?.email).toBe(email);
  });
});
