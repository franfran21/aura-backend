import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cycles')
export class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  lastPeriodDate: string;

  @Column({ default: 28 })
  avgCycleLength: number;

  @Column({ default: 5 })
  avgPeriodLength: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
