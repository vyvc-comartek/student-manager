import { Class } from 'src/classes/class.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 60 })
  name: string;

  @Column({ nullable: false })
  dob: Date;

  @Column('enum', {
    nullable: false,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  })
  gender: 'Male' | 'Female' | 'Other';

  @Column({ nullable: false, length: 128 })
  email: string;

  @ManyToOne(() => Class, (_class) => _class.students, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'classId' })
  class: Class;
}
