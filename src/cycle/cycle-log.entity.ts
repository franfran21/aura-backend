import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type EnergyLevel = 'baja' | 'media' | 'alta';
export type FlowLevel = 'leve' | 'moderado' | 'fuerte' | null;
export type MoodType = 'feliz' | 'tranquila' | 'triste' | 'irritable' | 'ansiosa' | 'cansada' | 'energetica' | 'neutral';

@Entity('cycle_logs')
export class CycleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  flow?: string;

  @Column({ nullable: true })
  energy?: string;

  @Column({ nullable: true })
  mood?: string;

  @Column({ nullable: true })
  painLevel?: string;

  @Column({ nullable: true })
  skin?: string;

  @Column({ nullable: true })
  sleep?: string;

  @Column({ nullable: true })
  symptoms?: string;

  @Column({ nullable: true })
  intercourse?: boolean;

  @Column({ nullable: true })
  protected?: boolean;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
