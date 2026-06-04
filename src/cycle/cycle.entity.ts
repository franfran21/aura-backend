import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cycles')
export class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastPeriodDate: Date;

  @Column({ default: 28 })
  avgCycleLength: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
