/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { IUser } from '../../Interface'

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    name: string

    @Column({ type: 'text' })
    username: string

    @Column({ type: 'text' })
    email: string

    @Column({ type: 'text' })
    password: string

    @Column({ type: 'text' })
    role: string

    @Column({ type: 'boolean' })
    isActive: boolean

    @Column({ nullable: true, type: 'text' })
    companyName?: string

    @Column({ nullable: true, type: 'text' })
    roleType?: string

    @Column({ nullable: true, type: 'text' })
    hearAboutUs?: string

    @Column({ nullable: true, type: 'datetime' })
    emailVerifiedAt?: Date

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    expiredAt: Date

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    createdDate: Date

    @Column({ type: 'timestamp' })
    @UpdateDateColumn()
    updatedDate: Date
}
