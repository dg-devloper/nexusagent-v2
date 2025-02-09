import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { IUserVerification } from '../../Interface'

@Entity('user_verification')
export class UserVerification implements IUserVerification {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    userId: string

    @Column({ type: 'text' })
    token: string

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    createdDate: Date
}
