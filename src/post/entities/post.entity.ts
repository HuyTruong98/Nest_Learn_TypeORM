import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  regDt: string;

  @Column({ nullable: true, default: null })
  modDt: string;

  @ManyToOne(() => User, (user) => user.post)
  user: User;
}
