import { Category } from 'src/category/entities/category.entity';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column()
  quantity: number;

  @Column()
  regDt: string;

  @Column({ nullable: true, default: null })
  modDt: string;

  @ManyToOne(() => User, (user) => user.post)
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.post)
  orderProducts: OrderProduct[];
}
