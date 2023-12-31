import { Column, Entity } from 'typeorm';
import { BigintIdEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends BigintIdEntity {
  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'firebase_token', nullable: true })
  firebaseToken: string;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'int', nullable: true })
  gender: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'int', default: User.STATUS.INACTIVE })
  status: number;

  static STATUS = {
    /** Đang hoạt động */
    ACTIVE: 1,
    /** Ngừng hoạt động */
    INACTIVE: -1,
    /** Khóa */
    LOCKED: -2,
  };

  static GENDER = {
    /** Nam */
    MALE: 1,
    /** Nữ */
    FEMALE: 2,
    /** Khác */
    OTHER: 3,
  };

  constructor(data: Partial<User>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.email = data.email;
      this.fullName = data.fullName;
      this.phoneNumber = data.phoneNumber;
      this.gender = data.gender;
      this.status = data.status;
      this.password = data.password;
      this.token = data.token;
      this.address = data.address;
      this.avatar = data.avatar;
    }
  }

  serialize() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      status: this.status,
      roleId: this.roleId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
