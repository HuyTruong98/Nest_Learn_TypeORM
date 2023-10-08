import { Order } from 'src/order/entities/order.entity';
import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  refresh_token: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column()
  regDt: string;

  @Column({ nullable: true, default: null })
  modDt: string;

  @Column({ default: 1 })
  status: number;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];
}
