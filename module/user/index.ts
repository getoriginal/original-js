import {Base} from "../base";
import {NewUser, User} from "./types";

const resource = 'user';
export class Users extends Base {
    public async getUserByUid(userUid: string): Promise<User> {
        return this.invoke(`/${resource}/${userUid}`);
    }

    public async getUserByEmail(email: string): Promise<User> {
        return this.invoke(`/${resource}` + new URLSearchParams({email}));
    }

    public async getUserByClientId(clientId: string): Promise<User> {
        return this.invoke(`/${resource}` + new URLSearchParams({clientId}));
    }

    public async createUser(user: NewUser): Promise<User> {
        return this.invoke(`/${resource}`, {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }
}