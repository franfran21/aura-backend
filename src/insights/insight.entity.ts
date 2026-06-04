import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'insights' })
export class Insight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  metricsRaw: string;

  @Column({ type: 'text', nullable: true })
  aiDiagnosis: string;

  @Column({ type: 'varchar', length: 50, default: 'pending_review' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
