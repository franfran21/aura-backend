import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('metrics')
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ type: 'int' })
  hrv: number;

  @Column({ type: 'int' })
  sleepQuality: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
