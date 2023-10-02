import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column()
  regDt: string;

  @Column({ nullable: true, default: null })
  modDt: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
