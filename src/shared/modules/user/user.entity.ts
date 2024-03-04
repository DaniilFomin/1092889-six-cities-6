import {defaultClasses, getModelForClass, prop, modelOptions} from '@typegoose/typegoose';
import {ImageExtType, User, UserType} from '../../types/index.js';
import {createSHA256} from '../../helpers/index.js';


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true, default: '', type: String})
  public email: string;

  @prop({required: true, type: String})
  public name: string;

  @prop({required: false, default: '', type: String})
  public avatar: ImageExtType;

  @prop({required: true, type: String})
  public type: UserType;

  @prop({required: true, default:'', type: String})
  private password?: string;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public getPassword() {
    return this.password;
  }

  public setPassword(password:string, salt: string) {
    this.password = createSHA256(password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
