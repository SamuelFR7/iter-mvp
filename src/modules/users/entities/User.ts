class User {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  country: string;
  phone: string;

  private constructor(user: User) {
    return Object.assign(this, {
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address,
      country: user.country,
      phone: user.phone,
    });
  }

  static create(userInfo: User) {
    const user = new User(userInfo);

    return user;
  }
}

export { User };
